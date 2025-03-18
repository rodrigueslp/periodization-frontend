import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { feedbackService } from '../../services/feedback';
import { authService } from '../../services/auth';

const AdminFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Filtros
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const checkAdminAccess = () => {
      const userData = authService.getUserData();
      if (!userData || !userData.roles || !userData.roles.includes('ROLE_ADMIN')) {
        navigate('/dashboard');
      }
    };

    checkAdminAccess();
    fetchFeedbacks();
  }, [navigate]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackService.getAllFeedbacks();
      setFeedbacks(response);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os feedbacks. Por favor, tente novamente.');
      console.error('Erro ao buscar feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredFeedbacks = async () => {
    try {
      setLoading(true);
      const type = typeFilter !== 'all' ? typeFilter : null;
      const response = await feedbackService.getAllFeedbacks(type);
      setFeedbacks(response);
      setError(null);
    } catch (err) {
      setError('Erro ao filtrar os feedbacks. Por favor, tente novamente.');
      console.error('Erro ao filtrar feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros aos feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Filtro por data
    if (dateRangeFilter.startDate) {
      const feedbackDate = new Date(feedback.createdAt);
      const startDate = new Date(dateRangeFilter.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      if (feedbackDate < startDate) {
        return false;
      }
    }
    
    if (dateRangeFilter.endDate) {
      const feedbackDate = new Date(feedback.createdAt);
      const endDate = new Date(dateRangeFilter.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      if (feedbackDate > endDate) {
        return false;
      }
    }
    
    // Filtro por termo de busca (texto, email ou nome do usuário)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        (feedback.feedbackText && feedback.feedbackText.toLowerCase().includes(lowerSearchTerm)) ||
        (feedback.userEmail && feedback.userEmail.toLowerCase().includes(lowerSearchTerm)) ||
        (feedback.userName && feedback.userName.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    return true;
  });

  // Ordenar feedbacks do mais recente para o mais antigo
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Obter feedbacks para a página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFeedbacks.slice(indexOfFirstItem, indexOfLastItem);
  
  // Função para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Resetar filtros
  const resetFilters = () => {
    setTypeFilter('all');
    setDateRangeFilter({ startDate: '', endDate: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Obter cor de badge com base no tipo de feedback
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'BUG':
        return 'bg-red-100 text-red-800';
      case 'FEATURE_REQUEST':
        return 'bg-blue-100 text-blue-800';
      case 'IMPROVEMENT':
        return 'bg-green-100 text-green-800';
      case 'GENERAL':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mapear tipos de feedback para exibição amigável
  const getFeedbackTypeLabel = (type) => {
    switch (type) {
      case 'BUG':
        return 'Bug';
      case 'FEATURE_REQUEST':
        return 'Nova Funcionalidade';
      case 'IMPROVEMENT':
        return 'Melhoria';
      case 'GENERAL':
        return 'Geral';
      default:
        return type;
    }
  };

  // Formatar data para formato brasileiro
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Feedbacks dos Usuários</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visualize e gerencie todos os feedbacks enviados pelos usuários
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por Tipo */}
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Feedback
            </label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            >
              <option value="all">Todos</option>
              <option value="GENERAL">Geral</option>
              <option value="BUG">Bug</option>
              <option value="FEATURE_REQUEST">Nova Funcionalidade</option>
              <option value="IMPROVEMENT">Melhoria</option>
            </select>
          </div>
          
          {/* Filtro por Data Inicial */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              value={dateRangeFilter.startDate}
              onChange={(e) => setDateRangeFilter({...dateRangeFilter, startDate: e.target.value})}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            />
          </div>
          
          {/* Filtro por Data Final */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              id="endDate"
              value={dateRangeFilter.endDate}
              onChange={(e) => setDateRangeFilter({...dateRangeFilter, endDate: e.target.value})}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            />
          </div>
          
          {/* Campo de Busca */}
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Texto, email ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Limpar Filtros
          </button>
          <button
            onClick={() => fetchFilteredFeedbacks()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
      
      {/* Lista de Feedbacks */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Feedbacks
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Exibindo {filteredFeedbacks.length} feedbacks
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {currentItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {currentItems.map((feedback) => (
                  <div key={feedback.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between flex-wrap gap-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{feedback.userName || 'Usuário Anônimo'}</h4>
                        <p className="text-sm text-gray-500">{feedback.userEmail || 'Email não disponível'}</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(feedback.feedbackType)}`}>
                          {getFeedbackTypeLabel(feedback.feedbackType)}
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(feedback.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {feedback.feedbackText}
                    </div>
                    
                    {feedback.planId && (
                      <div className="mt-3 text-sm text-indigo-600">
                        Plano relacionado: {feedback.planId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Nenhum feedback encontrado com os filtros aplicados.
              </div>
            )}
            
            {/* Paginação */}
            {filteredFeedbacks.length > itemsPerPage && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredFeedbacks.length)}
                      </span> de <span className="font-medium">{filteredFeedbacks.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Anterior</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Botões de página */}
                      {Array.from({ length: Math.ceil(filteredFeedbacks.length / itemsPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === index + 1
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(filteredFeedbacks.length / itemsPerPage)}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === Math.ceil(filteredFeedbacks.length / itemsPerPage)
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Próximo</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminFeedbacksPage;
