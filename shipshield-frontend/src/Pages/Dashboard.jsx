import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import CustomButton from '../components/ui/Button'
import SpinningScore from '../components/score/SpinningScore'
import AuditMetricCard from '../components/ui/AuditMetricCard'
import RepoScanModal from '../components/Auth/RepoScanModal'
import { Skeleton } from '../components/ui/Skeleton'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { mapAnalysisData } from '../lib/utils'
import { exportAsJSON, exportAsCSV, exportAsHTML, exportAsText } from '../lib/export'

import {
  AlertTriangle, MoveRight, X,
  Shield,TestTube, Rocket, Download, ChevronDown, FileText,
  CheckCircle,
  UploadCloud,
} from 'lucide-react';
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../animations/variants'



import { api } from '../services/api';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.analysis);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    if (!analysisData) {
      const fetchLatest = async () => {
        try {
          const history = await api.getHistory();
          if (history && history.length > 0) {
            setAnalysisData(history[0]);
          }
        } catch (err) {
          console.error("Failed to fetch dashboard data", err);
        } finally {
          setLoading(false);
        }
      };

      fetchLatest();
    } else {
      setLoading(false);
    }
  }, []);

  // Trigger confetti for high scores
  useEffect(() => {
    if (analysisData && analysisData.score >= 80) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [analysisData]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format) => {
    const repoName = analysisData?.repoUrl?.split('/').pop() || 'shipshield_report';

    switch (format) {
      case 'json':
        exportAsJSON(analysisData, repoName);
        break;
      case 'csv':
        exportAsCSV(analysisData, repoName);
        break;
      case 'html':
        exportAsHTML(analysisData, repoName);
        break;
      case 'text':
        exportAsText(analysisData, repoName);
        break;
      default:
        break;
    }

    setShowExportMenu(false);
  };

  const data = mapAnalysisData(analysisData);

  return (
    <section className='min-h-screen bg-gray-50'>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <header className='flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white border-b border-[#E2E8F0] px-6 py-4 gap-4'>
        <div>
          <p className='text-sm text-[#475569] font-medium'>{analysisData?.repoUrl || 'Repo name'}</p>
          <h1 className='text-3xl font-bold text-gray-900 mt-1'>Analysis Dashboard</h1>
        </div>
        <div className='flex gap-3'>
          {/* Export Dropdown */}
          {analysisData && (
            <div className='relative' ref={exportRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700'
              >
                <Download size={18} />
                Export Report
                <ChevronDown size={16} />
              </button>

              {showExportMenu && (
                <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                  <button
                    onClick={() => handleExport('json')}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 first:rounded-t-lg'
                  >
                    <Download size={16} />
                    JSON Format
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 border-t border-gray-100'
                  >
                    <Download size={16} />
                    CSV Format
                  </button>
                  <button
                    onClick={() => handleExport('html')}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 border-t border-gray-100'
                  >
                    <Download size={16} />
                    HTML Report
                  </button>
                  <button
                    onClick={() => handleExport('text')}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 border-t border-gray-100 last:rounded-b-lg'
                  >
                    <Download size={16} />
                    Text File
                  </button>
                </div>
              )}
            </div>
          )}

          <CustomButton onClick={() => setIsModalOpen(true)} color="primary" variant="solid">
            New Scan
          </CustomButton>
        </div>
      </header>


      <main className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row bg-gradient-to-b from-white to-[#4f5ad51a] border border-white rounded-xl p-8 gap-10 items-center w-full max-w-6xl shadow-sm"
        >
          {loading ? (
            <div className="w-full flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row gap-8 w-full">
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-4 mt-6">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-6 w-40 mt-6" />
                </div>
                <div className="flex-1 flex justify-center">
                  <Skeleton className="rounded-full h-64 w-64" />
                </div>
              </div>
            </div>
          ) : !data ? (
            <div className="w-full h-64 flex justify-center items-center">
              <p className="text-gray-500">No scan data available. Start a new scan.</p>
            </div>
          ) : (
            <>
              {/* Card */}
              <div className="max-w-lg flex bg-white p-7 rounded-lg flex-col gap-4 w-full">
                <p className="font-bold text-2xl text-black">Overall Ship Score</p>
                <p className="font-medium mt-2 text-[#64748B] text-base">
                  Based on AI analysis of your codebase security, documentation coverage, test reliability, and deployment configurations.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 items-start sm:items-center">
                  {data.score >= 80 ? (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center gap-2 rounded-lg font-bold py-2.5 px-5 text-white shadow-lg">
                      🎉 Production Ready!
                    </div>
                  ) : (
                    <div className="bg-[#FDE68A] flex items-center gap-2 rounded-lg font-bold py-2 px-4 text-[#B45309]">
                      <AlertTriangle size={20} /> Not Production Ready
                    </div>
                  )}
                  <p className="text-[#64748B] text-sm mt-1 sm:mt-0">last scanned just now</p>
                </div>

                {/* Top Issues Section */}
                {data.topIssues && data.topIssues.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Top Issues:</p>
                    <ul className="space-y-2">
                      {data.topIssues.slice(0, 2).map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                          <AlertTriangle size={14} className="mt-1 flex-shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <NavLink to="/issues" className="mt-6 inline-block group">
                  <p className="text-[#4F5BD5] text-base flex gap-2 items-center cursor-pointer font-medium group-hover:underline">
                    View Detailed Breakdown <MoveRight className="transition-transform group-hover:translate-x-1" />
                  </p>
                </NavLink>
              </div>

              {/* Spinning Score */}
              <div className="flex-1 flex justify-center">
                <SpinningScore score={data.score} size={250} />
              </div>
            </>
          )}
        </motion.div>

        {loading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl'>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        )}

        {data && !loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl'
          >
            <motion.div variants={itemVariants} className="h-full">
              <AuditMetricCard
                title="Security Audit"
                icon={X}
                value={data.security.val}
                valueLabel="Critical Issues"
                badge={data.security.badge}
                description={data.security.desc}
                progress={data.security.progress}
                theme={data.security.theme}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <AuditMetricCard
                title="Documentation"
                icon={FileText}
                value={data.docs.val}
                valueLabel="Coverage"
                badge={data.docs.badge}
                description={data.docs.desc}
                progress={data.docs.progress}
                theme={data.docs.theme}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <AuditMetricCard
                title="CI & Testing"
                icon={CheckCircle}
                value={data.testing.val}
                valueLabel="Pass Rate"
                badge={data.testing.badge}
                description={data.testing.desc}
                progress={data.testing.progress}
                theme={data.testing.theme}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <AuditMetricCard
                title="Deployment"
                icon={UploadCloud}
                value={data ? data.deploy.val : '-'}
                valueLabel="Config Score"
                badge={data ? data.deploy.badge : ''}
                description={data ? data.deploy.desc : ''}
                progress={data ? data.deploy.progress : 0}
                theme={data ? data.deploy.theme : 'gray'}
              />
            </motion.div>

          </motion.div>
        )}

      </main>

      <RepoScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section >
  )
}

export default Dashboard