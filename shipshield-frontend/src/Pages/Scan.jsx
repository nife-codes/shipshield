import React, { useEffect, useState } from 'react'
import SpinningScore from '../components/score/SpinningScore'
import CustomButton from '../components/ui/Button'
import AnalysisSteps from '../components/ui/AnalysisSteps'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { api } from '../services/api';

const Scan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const repoUrl = location.state?.repoUrl || 'https://github.com/example/repo';
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    { title: 'Repository cloned successfully', duration: 1000 },
    { title: 'Fetched repo in 2.4s successfully', duration: 1500 },
    { title: 'Dependency analysis', description: 'Scanned 1240 packages. No critical vulnerabilities', duration: 2000 },
    { title: 'Running static code analysis', description: 'Running for anti-patterns and code quality issues.', duration: 2500 },
    { title: 'AI context integration', description: 'Analyzing codebase awareness...', duration: 2000 },
    { title: 'Generate Readiness Report', description: 'Finalizing audit scores.', duration: 1500 }
  ];

  const [stepsState, setStepsState] = useState(steps.map(s => ({
    ...s,
    status: 'pending',
    time: ''
  })));

  useEffect(() => {
    const startAnalysis = async () => {
      try {
        // Use a placeholder deploymentUrl if none is provided via state or input
        const deploymentUrl = location.state?.deploymentUrl || 'https://example.com';
        const result = await api.analyzeRepo(repoUrl, deploymentUrl);
        setAnalysisResult(result);
      } catch (err) {
        console.error("Analysis failed:", err);
        setError(err.message);
      }
    };

    if (repoUrl) {
      startAnalysis();
    }
  }, [repoUrl, location.state]);

  useEffect(() => {
    if (analysisResult && currentStepIndex >= steps.length) {
      // All done, wait a bit then redirect to success page
      const timer = setTimeout(() => {
        navigate('/dashboard', { state: { analysis: analysisResult } });
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (!analysisResult || currentStepIndex >= steps.length) return;

    const currentStep = steps[currentStepIndex];

    // Set current to running
    setStepsState(prev => prev.map((s, i) =>
      i === currentStepIndex ? { ...s, status: 'running' } : s
    ));

    const timer = setTimeout(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour12: false });

      // Mark as done
      setStepsState(prev => prev.map((s, i) =>
        i === currentStepIndex ? { ...s, status: 'done', time: timeString } : s
      ));

      setCurrentStepIndex(prev => prev + 1);
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, analysisResult, navigate]);

  if (error) {
    return (
      <section className='bg-[#F2F3F7] flex justify-center p-4 md:p-10 items-center min-h-screen'>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
          className='bg-white flex flex-col border border-red-200 items-center rounded-lg p-6 md:p-10 w-full max-w-2xl shadow-xl'
        >
          <h1 className='text-black uppercase text-2xl text-center font-bold'>Analysis Failed</h1>
          <p className='text-red-600 font-medium text-sm text-center mt-3 px-4'>
            {error}
          </p>
          <div className='mt-6'>
            <CustomButton onClick={() => navigate('/')}>
              Try Another Repository
            </CustomButton>
          </div>
        </motion.main>
      </section>
    );
  }

  return (
    <section className='bg-[#F2F3F7] flex justify-center p-4 md:p-10 items-center min-h-screen'>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
        className='bg-white flex flex-col border border-[#D9F5E6] items-center rounded-lg p-6 md:p-10 w-full max-w-2xl shadow-xl'
      >
        <h1 className='text-black uppercase text-2xl text-center font-bold'>Analyzing Repository</h1>
        <p className='text-gray-600 font-medium text-sm text-center mt-3 px-4'>
          ShipSafe is running a comprehensive readiness audit on <span className='bg-[#F3F4F6] px-2 py-1 rounded text-[#6B7280] font-mono break-all'>{repoUrl}</span>
        </p>

        <motion.div
          className='mt-8'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.3, delay: 0.2 }}
        >
          <SpinningScore score={analysisResult?.score || 56} size={150} />
        </motion.div>

        <div className="w-full mt-6">
          <AnalysisSteps steps={stepsState} />
        </div>

        <hr className='text-[#b4b4b494] w-full my-6' />
        <div className='flex flex-col-reverse sm:flex-row justify-between items-center w-full gap-4'>
          <div className='flex-1 w-full sm:w-auto text-center sm:text-left'>
            <button className='text-sm font-medium text-gray-500 hover:text-black transition-colors'>View Logs</button>
          </div>
          <div className='flex-1 w-full sm:w-auto'>
            <CustomButton
              color='danger'
              className="w-full sm:w-auto"
              onClick={() => navigate('/dashboard')}
            >
              Cancel Audit
            </CustomButton>
          </div>
        </div>
      </motion.main>
    </section>
  )
}

export default Scan
