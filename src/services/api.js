// Configuração base para fetchAPI
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Flag para controlar requisições de refresh em andamento
let isRefreshing = false;
let refreshSubscribers = [];

// Função para adicionar callbacks à fila
const subscribeToTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Função para executar callbacks quando o token for renovado
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

// Verifica se o token está próximo de expirar (5 minutos)
const isTokenExpiringSoon = () => {
  const expiresAt = localStorage.getItem('expiresAt');
  if (!expiresAt) return true;

  // Margem de segurança de 5 minutos (300000 ms)
  return Date.now() + 300000 > parseInt(expiresAt);
};

// Função para renovar o token
const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise(resolve => {
      subscribeToTokenRefresh(token => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token não disponível');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Falha ao renovar o token');
    }

    const data = await response.json();
    
    // Atualizar tokens no localStorage
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    // Calcular expiração (assumindo 1 hora de validade)
    const expiresAt = Date.now() + 3600000; // 1 hora em milissegundos
    localStorage.setItem('expiresAt', expiresAt.toString());

    onTokenRefreshed(data.accessToken);
    isRefreshing = false;
    
    return data.accessToken;
  } catch (error) {
    isRefreshing = false;
    // Se falhar, limpar dados e redirecionar para login
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userInfo');
    
    // Redirecionar para login
    window.location.href = '/login';
    throw error;
  }
};

// Função genérica para fetchAPI com tratamento de erros
async function fetchAPI(endpoint, options = {}) {
  // Verificar se o token está expirado e tentar renovar
  if (localStorage.getItem('token') && isTokenExpiringSoon()) {
    try {
      await refreshToken();
    } catch (error) {
      console.error('Falha ao renovar token:', error);
      // Continua com o token atual, mesmo que esteja prestes a expirar
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Adicionar token de autenticação
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Verifica se a resposta foi não autorizada (401)
    if (response.status === 401) {
      // Tentar renovar o token e repetir a requisição
      try {
        const newToken = await refreshToken();
        
        // Atualizar o token no cabeçalho e repetir a requisição
        headers.Authorization = `Bearer ${newToken}`;
        const retryConfig = {
          ...options,
          headers
        };
        
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, retryConfig);
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(errorData.error || `Erro: ${retryResponse.status} ${retryResponse.statusText}`);
        }
        
        // Para download de arquivos, retorna o blob diretamente
        if (endpoint.includes('/download')) {
          return retryResponse.blob();
        }
        
        // Para outras respostas, tenta parsear como JSON
        return retryResponse.json();
      } catch (refreshError) {
        console.error('Erro ao renovar o token:', refreshError);
        throw refreshError;
      }
    }
    
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || `Erro: ${response.status} ${response.statusText}`);
        } else {
          throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }
      } catch (jsonError) {
        if (jsonError instanceof SyntaxError) {
          throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }
        throw jsonError;
      }
    }

    // Para download de arquivos, retorna o blob diretamente
    if (endpoint.includes('/download')) {
      return response.blob();
    }

    // Para outras respostas, tenta parsear como JSON
    return response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Adicionar um monitor de atividade para renovar o token quando o usuário estiver inativo
const setupActivityMonitor = () => {
  let inactivityTimer;
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutos
  
  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(async () => {
      // Verificar se o usuário ainda está logado
      if (localStorage.getItem('token')) {
        try {
          // Tentar renovar o token silenciosamente
          await refreshToken();
          console.log('Token renovado após período de inatividade');
        } catch (error) {
          console.error('Falha ao renovar token após inatividade:', error);
        }
      }
    }, inactivityTimeout);
  };
  
  // Eventos para monitorar atividade do usuário
  const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
  
  // Adicionar listeners para todos os eventos
  activityEvents.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, { passive: true });
  });
  
  // Iniciar o timer
  resetInactivityTimer();
};

// Inicializar o monitor de atividade se houver um token
if (localStorage.getItem('token')) {
  setupActivityMonitor();
}

export default {
  get: (endpoint) => fetchAPI(endpoint, { method: 'GET' }),
  post: (endpoint, data) => fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => fetchAPI(endpoint, { method: 'DELETE' }),
  refreshToken // Exportar para poder ser chamado diretamente
};