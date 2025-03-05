// src/components/training/FormattedPlanContent.jsx

import React, { useState, useEffect } from 'react';

// Você pode ajustar estas variáveis para combinar com a cor da sua logo
const THEME_COLORS = {
  // Cor principal (para o cabeçalho das seções)
  primaryBg: 'bg-indigo-500',  // Substitua por sua cor, por exemplo 'bg-blue-500' ou 'bg-[#FF5500]'
  primaryText: 'text-white',
  primaryHover: 'hover:bg-indigo-600',
  
  // Cor secundária (para botões de expandir/fechar)
  secondaryBg: 'bg-indigo-100',
  secondaryText: 'text-indigo-700',
  secondaryHover: 'hover:bg-indigo-200',
  
  // Cor dos ícones
  iconColor: 'text-white'
};

const FormattedPlanContent = ({ content }) => {
  // Estado para controlar quais seções estão expandidas
  // Por padrão, todas estarão fechadas (array vazio)
  const [expandedSections, setExpandedSections] = useState([]);
  
  // Função para verificar se uma seção está expandida
  const isSectionExpanded = (sectionId) => {
    return expandedSections.includes(sectionId);
  };
  
  // Função para alternar o estado de uma seção
  const toggleSection = (sectionId) => {
    if (isSectionExpanded(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };
  
  // Função para expandir todas as seções
  const expandAllSections = (sectionIds) => {
    setExpandedSections(sectionIds);
  };
  
  // Função para fechar todas as seções
  const collapseAllSections = () => {
    setExpandedSections([]);
  };
  
  // Analisar o conteúdo para extrair as seções (semanas)
  const parseContent = () => {
    if (!content) return [];
    
    // Podemos assumir que o conteúdo é uma string formatada em HTML ou markdown
    // Vamos dividir o conteúdo em seções usando um padrão específico (ex: ## Semana)
    // Este código precisa ser adaptado ao formato real dos seus dados
    
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];
    
    lines.forEach((line) => {
      // Verifica se a linha é um cabeçalho de semana
      // Ajuste este regex conforme o formato real do seu conteúdo
      const weekHeaderMatch = line.match(/#{2,3}\s*(Semana\s*\d+|Week\s*\d+)/i);
      
      if (weekHeaderMatch) {
        // Se já temos uma seção, salvamos ela antes de começar uma nova
        if (currentSection) {
          sections.push({
            id: currentSection,
            title: currentSection,
            content: currentContent.join('\n')
          });
        }
        
        // Inicia uma nova seção
        currentSection = weekHeaderMatch[0];
        currentContent = [line];
      } else if (currentSection) {
        currentContent.push(line);
      }
    });
    
    // Adiciona a última seção
    if (currentSection) {
      sections.push({
        id: currentSection,
        title: currentSection,
        content: currentContent.join('\n')
      });
    }
    
    return sections;
  };
  
  const sections = parseContent();
  const sectionIds = sections.map(section => section.id);
  
  return (
    <div className="plan-content">
      {/* Botões para expandir/fechar todas as seções */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => expandAllSections(sectionIds)}
          className={`inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md ${THEME_COLORS.secondaryBg} ${THEME_COLORS.secondaryText} ${THEME_COLORS.secondaryHover}`}
        >
          Expandir Todas
        </button>
        <button
          onClick={collapseAllSections}
          className={`inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md ${THEME_COLORS.secondaryBg} ${THEME_COLORS.secondaryText} ${THEME_COLORS.secondaryHover}`}
        >
          Fechar Todas
        </button>
      </div>
      
      {/* Renderizar as seções */}
      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border rounded-md overflow-hidden">
              <div 
                className={`${THEME_COLORS.primaryBg} ${THEME_COLORS.primaryText} px-4 py-3 cursor-pointer flex justify-between items-center`}
                onClick={() => toggleSection(section.id)}
              >
                <h3 className="text-lg font-medium">
                  {section.title.replace(/^#+\s*/, '')}
                </h3>
                <button
                  type="button"
                  className={THEME_COLORS.iconColor}
                >
                  {isSectionExpanded(section.id) ? (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {isSectionExpanded(section.id) && (
                <div className="px-4 py-3 bg-white">
                  <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Se não conseguirmos analisar as seções, mostramos o conteúdo completo
        <div 
          className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        ></div>
      )}
    </div>
  );
};

// Função auxiliar para formatar o conteúdo
// Esta função precisará ser adaptada ao formato real dos seus dados
const formatContent = (content) => {
  if (!content) return '';
  
  // Substitui os padrões markdown por HTML
  // Este é um exemplo básico; ajuste conforme necessário
  
  let formatted = content
    // Títulos
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    
    // Negrito e itálico
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Listas
    .replace(/^\s*\*\s(.*$)/gm, '<li>$1</li>')
    .replace(/<\/li>\n<li>/g, '</li><li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    
    // Quebras de linha
    .replace(/\n/g, '<br />');
  
  return formatted;
};

export default FormattedPlanContent;