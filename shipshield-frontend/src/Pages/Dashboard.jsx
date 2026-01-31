import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import CustomButton from '../components/ui/Button'
import SpinningScore from '../components/score/SpinningScore'
import AuditMetricCard from '../components/ui/AuditMetricCard'
import RepoScanModal from '../components/Auth/RepoScanModal'
import { Skeleton } from '../components/ui/Skeleton'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

import { AlertTriangle, MoveRight, X, FileText, CheckCircle, UploadCloud, Download, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../animations/variants'

import { mapAnalysisData } from '../lib/scoring' // Helper to format backend data
import { api } from '../services/api' // API helper to fetch repo data

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [repoData, setRepoData] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportRef = useRef(null)

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const latestRepo = await api.getLatestRepo() // Fetch latest repo info from backend
        setRepoData(latestRepo)
        const scored = mapAnalysisData(latestRepo) // Format data for dashboard
        setAnalysisData(scored)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching or scoring repo:', err)
        setLoading(false)
      }
    }

    fetchRepoData()
  }, [])

  useEffect(() => {
    if (analysisData && analysisData.score >= 80) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [analysisData])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <section className="min-h-screen bg-gray-50">
      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.3} />
      )}

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white border-b border-[#E2E8F0] px-6 py-4 gap-4">
        <div>
          <p className="text-sm text-[#475569] font-medium">{repoData?.name || 'Repo name'}</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Analysis Dashboard</h1>
        </div>

        <div className="flex gap-3">
          {analysisData && (
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                <Download size={18} />
                Export Report
                <ChevronDown size={16} />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">JSON</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-t border-gray-100">CSV</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-t border-gray-100">HTML</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-t border-gray-100 last:rounded-b-lg">Text</button>
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
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <>
              <div className="max-w-lg flex bg-white p-7 rounded-lg flex-col gap-4 w-full">
                <p className="font-bold text-2xl text-black">Overall Ship Score</p>
                <p className="font-medium mt-2 text-[#64748B] text-base">
                  Based on AI analysis of your codebase security, documentation coverage, test reliability, and deployment configurations.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4 items-start sm:items-center">
                  {analysisData.score >= 80 ? (
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

                {analysisData.topIssues && analysisData.topIssues.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Top Issues:</p>
                    <ul className="space-y-2">
                      {analysisData.topIssues.slice(0, 2).map((issue, idx) => (
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

              <div className="flex-1 flex justify-center">
                <SpinningScore score={analysisData.score} size={250} />
              </div>
            </>
          )}
        </motion.div>

        {analysisData && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl"
          >
            <motion.div variants={itemVariants} className="h-full">
              <AuditMetricCard
                title="Security Audit"
                icon={X}
                value={analysisData.security.val}
                valueLabel="Critical Issues"
                badge={analysisData.security.badge}
                description={analysisData.security.desc}
                progress={analysisData.security.progress}
                theme={analysisData.security.theme}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <AuditMetricCard
                title="Documentation"
                icon={FileText}
                value={analysisData.docs.val}
                valueLabel="Coverage"
                badge={analysisData.docs.badge}
                description={analysisData.docs.desc}
                progress={analysisData.docs.progress}
                theme={analysisData.docs.theme}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <AuditMetricCard
                title="CI & Testing"
                icon={CheckCircle}
                value={analysisData.testing.val}
                valueLabel="Pass Rate"
                badge={analysisData.testing.badge}
                description={analysisData.testing.desc}
                progress={analysisData.testing.progress}
                theme={analysisData.testing.theme}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <AuditMetricCard
                title="Deployment"
                icon={UploadCloud}
                value={analysisData.deploy.val}
                valueLabel="Config Score"
                badge={analysisData.deploy.badge}
                description={analysisData.deploy.desc}
                progress={analysisData.deploy.progress}
                theme={analysisData.deploy.theme}
              />
            </motion.div>
          </motion.div>
        )}
      </main>

      <RepoScanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

export default Dashboard
