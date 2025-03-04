// Configuração base para fetchAPI
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Função genérica para fetchAPI com tratamento de erros
async function fetchAPI(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Adicionar token de autenticação (quando implementarmos autenticação real)
  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  console.log(config);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro: ${response.status} ${response.statusText}`);
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
  delete: (endpoint) => fetchAPI(endpoint, { method: 'DELETE' })
};