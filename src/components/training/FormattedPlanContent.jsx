// src/components/training/FormattedPlanContent.jsx
import React, { useState, useEffect } from 'react';

const FormattedPlanContent = ({ content }) => {
  // Garantir que content seja uma string
  const textContent = content ? String(content) : '';
  
  // State para controlar seções expandidas/minimizadas
  const [expandedSections, setExpandedSections] = useState({});

  // Efeito para configurar todas as seções como expandidas ou não por padrão
  useEffect(() => {
    const initialState = {};
    sections.forEach(section => {
      initialState[section.title] = true; // true = expandido
    });
    setExpandedSections(initialState);
  }, [textContent]);
  
  // Processar o conteúdo para identificar seções principais
  const processContent = (text) => {
    // Remove caracteres especiais extras e formata o texto
    const cleanText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
      
    return cleanText;
  };
  
  // Extrair seções do conteúdo
  const extractSections = (text) => {
    const lines = text.split('\n');
    const sections = [];
    
    let currentSectionTitle = 'Introdução';
    let currentSectionContent = [];
    let inSection = false;
    
    lines.forEach((line, index) => {
      // Detectar cabeçalhos de seção (## TÍTULO ou # TÍTULO)
      const sectionMatch = line.match(/^#{1,2}\s+(.+)$/);
      const isBigHeader = line.startsWith('# ');
      const isSectionHeader = line.startsWith('## ');
      
      // Para cabeçalhos grandes # ou seções ##
      if (isBigHeader || isSectionHeader) {
        // Se já estávamos em uma seção, salvamos ela
        if (inSection) {
          sections.push({
            title: currentSectionTitle,
            content: currentSectionContent
          });
          currentSectionContent = [];
        }
        
        // Iniciar nova seção
        inSection = true;
        // Remover os símbolos # do título
        currentSectionTitle = line.replace(/^#+\s+/, '');
      }
      // Se estamos em uma seção, adicionar a linha ao conteúdo atual
      else if (inSection) {
        currentSectionContent.push(line);
      }
      // Se não estamos em uma seção e não é um cabeçalho, é conteúdo introdutório
      else {
        // Apenas para a primeira seção (introdução)
        if (sections.length === 0) {
          if (line.trim() !== '') {
            currentSectionContent.push(line);
          }
        }
      }
    });
    
    // Adicionar a última seção se houver conteúdo
    if (inSection) {
      sections.push({
        title: currentSectionTitle,
        content: currentSectionContent
      });
    } else if (currentSectionContent.length > 0) {
      // Adicionar introdução se houver conteúdo
      sections.push({
        title: 'Introdução',
        content: currentSectionContent
      });
    }
    
    return sections;
  };

  // Formatar uma linha individual
  const formatLine = (line) => {
    // Remover ## ou # do início (cabeçalhos)
    line = line.replace(/^#+\s+/, '');
    
    // Substituir **texto** por <strong>texto</strong>
    line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    return line;
  };

  // Renderizar uma linha formatada para HTML
  const renderFormattedLine = (line) => {
    // Tratar negrito
    const parts = [];
    let lastIndex = 0;
    
    // Encontrar padrões **texto** para negrito
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(line)) !== null) {
      // Adicionar texto antes do negrito
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: line.substring(lastIndex, match.index)
        });
      }
      
      // Adicionar texto em negrito
      parts.push({
        type: 'bold',
        content: match[1]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Adicionar texto restante
    if (lastIndex < line.length) {
      parts.push({
        type: 'text',
        content: line.substring(lastIndex)
      });
    }
    
    // Se não encontrou partes, retorna a linha inteira
    if (parts.length === 0) {
      return line;
    }
    
    // Renderizar as partes
    return parts.map((part, index) => {
      if (part.type === 'bold') {
        return <strong key={index}>{part.content}</strong>;
      } else {
        return <span key={index}>{part.content}</span>;
      }
    });
  };

  // Renderizar o conteúdo de uma seção
  const renderSectionContent = (lines) => {
    if (!lines || lines.length === 0) return null;
    
    return lines.map((line, index) => {
      // Detectar tipo de linha
      if (line.match(/^-\s+\*\*([^*]+)\*\*:/)) {
        // Item de lista em negrito com dois pontos (campo: valor)
        const parts = line.split(':');
        const label = parts[0].replace(/^-\s+\*\*/, '').replace(/\*\*$/, '');
        const value = parts.slice(1).join(':').trim();
        
        return (
          <div key={index} className="flex py-1">
            <div className="w-40 font-semibold text-indigo-700">{label}:</div>
            <div>{value}</div>
          </div>
        );
      } 
      else if (line.match(/^-\s+/)) {
        // Item de lista simples
        const content = line.replace(/^-\s+/, '');
        
        return (
          <div key={index} className="pl-4 border-l-2 border-indigo-100 py-1">
            <span className="text-indigo-500 mr-2">•</span>
            {renderFormattedLine(content)}
          </div>
        );
      }
      else if (line.match(/^#/)) {
        // Cabeçalho nível 3 ou mais
        const content = line.replace(/^#+\s+/, '');
        const level = (line.match(/^#+/) || [''])[0].length;
        
        if (level >= 3) {
          return (
            <h4 key={index} className="font-semibold text-lg text-indigo-600 mt-4 mb-2">
              {content}
            </h4>
          );
        }
      }
      else if (line.trim() === '') {
        // Linha vazia
        return <div key={index} className="h-2"></div>;
      }
      
      // Linha normal
      return (
        <p key={index} className="py-1">
          {renderFormattedLine(line)}
        </p>
      );
    });
  };

  // Toggle para expandir/minimizar uma seção
  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Processar o texto
  const processedText = processContent(textContent);
  
  // Extrair seções
  const sections = extractSections(processedText);

  // Se não há conteúdo, mostra mensagem
  if (!textContent.trim()) {
    return <p className="text-gray-500 italic">Nenhum conteúdo de plano disponível.</p>;
  }

  return (
    <div className="plan-content space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
          <div 
            className="flex items-center justify-between cursor-pointer bg-indigo-50 p-3 hover:bg-indigo-100 transition-colors"
            onClick={() => toggleSection(section.title)}
          >
            <h2 className="text-lg font-bold text-indigo-800">
              {section.title}
            </h2>
            <div className="text-indigo-600">
              {expandedSections[section.title] ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </div>
          
          {/* Conteúdo da seção (colapsável) */}
          {expandedSections[section.title] && (
            <div className="p-4 bg-white">
              {renderSectionContent(section.content)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormattedPlanContent;