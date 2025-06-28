import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import FormattedPlanContent from '../components/training/FormattedPlanContent';
import GeneratingProgress from '../components/training/GeneratingProgress';
import { runningTrainingService } from '../services/runningTraining';
import MiniProgress from '../components/ui/MiniProgress';
import { formatDateSafely } from '../utils/dateUtils';

const ViewRunningPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const { planId } = useParams();
  const [downloadError, setDownloadError] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Polling para atualização automática caso o plano esteja em geração
  useEffect(() => {
    let interval;
    
    const fetchPlan = async () => {
      try {
        const data = await runningTrainingService.getPlan(planId);
        setPlan(data);
        
        // Se o plano estiver em geração, continuamos o polling
        if (data.status === 'QUEUED' || data.status === 'GENERATING') {
          if (!interval) {
            interval = setInterval(fetchPlan, 10000); // a cada 10 segundos
          }
        } else if (interval) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Erro ao buscar plano:', err);
        setError(err.message || 'Não foi possível carregar o plano. Por favor, tente novamente.');
        if (interval) {
          clearInterval(interval);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [planId]);

  const handleDownload = async () => {
    try {
      setDownloadError(null);
      setTooltipVisible(false);
      await runningTrainingService.downloadPlan(planId);
    } catch (err) {
      console.error('Erro download Excel:', err);
      setDownloadError(err.message || 'Erro ao baixar o arquivo Excel. Por favor, tente novamente.');
      setTooltipVisible(true);
      
      // Esconder o tooltip após 5 segundos
      setTimeout(() => {
        setTooltipVisible(false);
      }, 5000);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadError(null);
      setTooltipVisible(false);
      await runningTrainingService.downloadPlanPdf(planId);
    } catch (err) {
      console.error('Erro download PDF:', err);
      setDownloadError(err.message || 'Erro ao baixar o arquivo PDF. Por favor, tente novamente.');
      setTooltipVisible(true);
      
      // Esconder o tooltip após 5 segundos
      setTimeout(() => {
        setTooltipVisible(false);
      }, 5000);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setGeneratingPlan(true);
      await runningTrainingService.generateApprovedPlan(planId);
      
      // Recarregar os dados do plano após iniciar a geração
      const updatedPlan = await runningTrainingService.getPlan(planId);
      setPlan(updatedPlan);
      setGeneratingPlan(false);
    } catch (err) {
      setError('Erro ao iniciar geração do plano. Por favor, tente novamente.');
      setGeneratingPlan(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex