// src/utils/dateUtils.js

/**
 * Verifica se a string já está no formato brasileiro DD/MM/YYYY
 * @param {string} dateStr - String da data a ser verificada
 * @returns {boolean} - Verdadeiro se já estiver no formato brasileiro
 */
export function isAlreadyBrFormat(dateStr) {
    if (typeof dateStr !== 'string') return false;
    
    // Verificar se corresponde ao padrão DD/MM/YYYY
    const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return regex.test(dateStr);
  }
  
  /**
   * Converte uma data do formato brasileiro para um objeto Date
   * @param {string|Date|number} dateValue - Valor da data a ser convertido
   * @returns {Date|null} - Objeto Date ou null se inválido
   */
  export function convertBrDateToIso(dateValue) {
    if (!dateValue) return null;
    
    // Verificar se já é um objeto Date
    if (dateValue instanceof Date) return dateValue;
    
    // Verificar se é um timestamp numérico
    if (!isNaN(dateValue) && typeof dateValue === 'number') {
      return new Date(dateValue);
    }
    
    // Se for uma string no formato ISO, usar diretamente
    if (typeof dateValue === 'string' && dateValue.includes('T')) {
      return new Date(dateValue);
    }
    
    // Verificar se é string no formato DD/MM/YYYY
    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      const parts = dateValue.split('/');
      if (parts.length === 3) {
        // Criar formato YYYY-MM-DD para o construtor Date
        return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
      }
    }
    
    // Tentativa padrão
    return new Date(dateValue);
  }
  
  /**
   * Formata uma data de maneira segura, lidando com vários formatos possíveis
   * @param {string|Date|number} dateValue - Valor da data a ser formatado
   * @returns {string} - Data formatada em PT-BR ou valor original se não puder ser formatado
   */
  export function formatDateSafely(dateValue) {
    if (!dateValue) return '';
    
    // Se já estiver no formato brasileiro, retornar como está
    if (isAlreadyBrFormat(dateValue)) {
      return dateValue;
    }
    
    // Caso contrário, tentar converter
    try {
      const date = convertBrDateToIso(dateValue);
      if (!isNaN(date)) {
        return date.toLocaleDateString('pt-BR');
      }
      return String(dateValue); // Se não conseguir converter, retorna o valor original como string
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return String(dateValue);
    }
  }