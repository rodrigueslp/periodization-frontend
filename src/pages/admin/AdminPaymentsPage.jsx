import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { paymentService } from '../../services/payment';
import { authService } from '../../services/auth';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // IDs dos usuários que devem ser ocultados (hardcoded para teste)
  const HIDDEN_USER_IDS = [1, 2, 3, 5];

  useEffect(() => {
    const checkAdminAccess = () => {
      const userData = authService.getUserData();
      if (!userData || !userData.roles || !userData.roles.includes('ROLE_ADMIN')) {
        navigate('/dashboard');
      }
    };

    checkAdminAccess();
    fetchPayments();
  }, [navigate]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments();
      
      // Filtrar pagamentos para ocultar usuários específicos
      const filteredPayments = response.filter(payment => {
        // Verificar se o payment tem userId e se não está na lista de IDs ocultos
        return payment.userId && !HIDDEN_USER_IDS.includes(payment.userId);
      });
      
      setPayments(filteredPayments);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os pagamentos. Por favor, tente novamente.');
      console.error('Erro ao buscar pagamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros aos pagamentos - VERSÃO CORRIGIDA
  const applyFilters = (paymentsToFilter) => {
    return paymentsToFilter.filter(payment => {
      // Filtro por status
      if (statusFilter !== 'all' && payment.status !== statusFilter) {
        return false;
      }
      
      // Filtro por data - com correção para problemas de fuso horário e formato ISO
      if (dateRangeFilter.startDate || dateRangeFilter.endDate) {
        // Converter a string ISO para objeto Date
        const paymentDate = new Date(payment.createdAt);
        
        // Extrair apenas a data (sem componente de tempo)
        const paymentYear = paymentDate.getFullYear();
        const paymentMonth = paymentDate.getMonth();
        const paymentDay = paymentDate.getDate();
        
        // Criar uma data apenas com o componente de data (sem horas)
        const paymentDateOnly = new Date(Date.UTC(paymentYear, paymentMonth, paymentDay));
        
        if (dateRangeFilter.startDate) {
          // Criar data de início com UTC para comparação consistente
          const startDate = new Date(dateRangeFilter.startDate + 'T00:00:00Z');
          
          if (paymentDateOnly < startDate) {
            return false;
          }
        }
        
        if (dateRangeFilter.endDate) {
          // Criar data final com UTC
          const endDate = new Date(dateRangeFilter.endDate + 'T00:00:00Z');
          
          // Adicionar um dia para incluir o próprio dia final
          const adjustedEndDate = new Date(endDate);
          adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
          
          if (paymentDateOnly >= adjustedEndDate) {
            return false;
          }
        }
      }
      
      // Filtro por termo de busca
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          (payment.userEmail && payment.userEmail.toLowerCase().includes(lowerSearchTerm)) ||
          (payment.userName && payment.userName.toLowerCase().includes(lowerSearchTerm)) ||
          (payment.description && payment.description.toLowerCase().includes(lowerSearchTerm)) ||
          (payment.externalReference && payment.externalReference.toLowerCase().includes(lowerSearchTerm))
        );
      }
      
      return true;
    });
  };

  // Aplicar filtros e ordenação
  const filteredPayments = applyFilters(payments);

  // Ordenar pagamentos do mais recente para o mais antigo
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Obter pagamentos para a página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPayments.slice(indexOfFirstItem, indexOfLastItem);
  
  // Função para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Resetar filtros
  const resetFilters = () => {
    setStatusFilter('all');
    setDateRangeFilter({ startDate: '', endDate: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Obter cor de badge com base no status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in_process':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatar valor para moeda brasileira
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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

  // Calcular totais para o resumo
  const calculateTotals = () => {
    const totalPayments = filteredPayments.length;
    const approvedPayments = filteredPayments.filter(p => p.status === 'approved').length;
    const pendingPayments = filteredPayments.filter(p => p.status === 'pending' || p.status === 'in_process').length;
    
    // Calcular soma total
    const totalAmount = filteredPayments
      .filter(p => p.status === 'approved') // Opcional: considerar apenas pagamentos aprovados
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    // Calcular soma por status
    const approvedAmount = filteredPayments
      .filter(p => p.status === 'approved')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    const pendingAmount = filteredPayments
      .filter(p => p.status === 'pending' || p.status === 'in_process')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    return {
      totalPayments,
      approvedPayments,
      pendingPayments,
      totalAmount,
      approvedAmount,
      pendingAmount
    };
  };

  const totals = calculateTotals();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Administração de Pagamentos</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie e visualize todos os pagamentos realizados na plataforma
        </p>
        {/* Indicador visual para o filtro aplicado */}
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Ocultando usuários de teste (IDs: 1, 2, 3, 5)
          </span>
        </div>
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

      {/* Resumo de pagamentos */}
      <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo de Pagamentos</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card com Totais Gerais */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-base font-medium text-gray-700 mb-2">Total Geral</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pagamentos:</span>
                <span className="text-sm font-medium">{totals.totalPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Valor Total:</span>
                <span className="text-sm font-medium">{formatCurrency(totals.totalAmount)}</span>
              </div>
            </div>
          </div>
          
          {/* Card com Totais de Aprovados */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-base font-medium text-green-700 mb-2">Aprovados</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-500">Pagamentos:</span>
                <span className="text-sm font-medium">{totals.approvedPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-500">Valor Total:</span>
                <span className="text-sm font-medium">{formatCurrency(totals.approvedAmount)}</span>
              </div>
            </div>
          </div>
          
          {/* Card com Totais de Pendentes */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-base font-medium text-yellow-700 mb-2">Pendentes</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-yellow-500">Pagamentos:</span>
                <span className="text-sm font-medium">{totals.pendingPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-yellow-500">Valor Pendente:</span>
                <span className="text-sm font-medium">{formatCurrency(totals.pendingAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por Status */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            >
              <option value="all">Todos</option>
              <option value="approved">Aprovado</option>
              <option value="pending">Pendente</option>
              <option value="rejected">Rejeitado</option>
              <option value="in_process">Em Processamento</option>
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
              placeholder="Email, nome ou descrição..."
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
            onClick={() => fetchPayments()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Atualizar
          </button>
        </div>
      </div>
      
      {/* Lista de Pagamentos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Pagamentos
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Exibindo {filteredPayments.length} pagamentos (usuários de teste ocultos)
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID / Referência
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((payment) => (
                      <tr key={payment.externalReference} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div>{payment.paymentId}</div>
                          <div className="text-xs text-gray-500">{payment.externalReference}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium text-gray-900">{payment.userName || 'N/A'}</div>
                          <div className="text-xs">{payment.userEmail || 'N/A'}</div>
                          {/* Mostrar userId para debug se necessário */}
                          <div className="text-xs text-gray-400">ID: {payment.userId}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate">
                            {payment.description || 'N/A'}
                          </div>
                          {payment.planId && (
                            <div className="text-xs text-indigo-600">
                              Plano: {payment.planId}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.createdAt)}
                          {payment.updatedAt && (
                            <div className="text-xs text-gray-400">
                              Atualizado: {formatDate(payment.updatedAt)}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum pagamento encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Paginação */}
            {filteredPayments.length > itemsPerPage && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredPayments.length)}
                      </span> de <span className="font-medium">{filteredPayments.length}</span> resultados
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
                      {Array.from({ length: Math.ceil(filteredPayments.length / itemsPerPage) }).map((_, index) => (
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
                        disabled={currentPage === Math.ceil(filteredPayments.length / itemsPerPage)}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === Math.ceil(filteredPayments.length / itemsPerPage)
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

export default AdminPaymentsPage;
