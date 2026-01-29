import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import CustomButton from '../components/ui/Button'
import SpinningScore from '../components/score/SpinningScore'
import AuditMetricCard from '../components/ui/AuditMetricCard'
import RepoScanModal from '../components/Auth/RepoScanModal'

import {
  AlertTriangle, MoveRight, X,
  FileText,
  CheckCircle,
  UploadCloud,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../animations/variants'



const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const analysisData = location.state?.analysis;

  // Helper to map 0-25 score to Grade/Color
  const getGrade = (score) => {
    if (score >= 22) return { grade: 'A', theme: 'success', badge: 'Excellent' };
    if (score >= 18) return { grade: 'B', theme: 'info', badge: 'Good' };
    if (score >= 14) return { grade: 'C', theme: 'warning', badge: 'Improve' };
    return { grade: 'D', theme: 'danger', badge: 'Critical' };
  };

  const mapData = () => {
    if (!analysisData) {
      // Default/Placeholder data
      return {
        score: 56,
        security: { val: 'C-', progress: 45, theme: 'danger', badge: 'Needs Work', desc: '3 High severity vulnerabilities detected' },
        docs: { val: '58%', progress: 58, theme: 'warning', badge: 'Improve', desc: 'README missing setup instructions' },
        testing: { val: '92%', progress: 92, theme: 'success', badge: 'Good', desc: 'All unit tests passed' },
        deploy: { val: 'A', progress: 85, theme: 'info', badge: 'Stable', desc: 'Dockerfiles optimized' }
      };
    }

    const { categories, score } = analysisData;
    const sec = getGrade(categories.productionSafety.score);
    const dep = getGrade(categories.deploymentReality.score);

    return {
      score: score,
      security: {
        val: sec.grade,
        progress: (categories.productionSafety.score / 25) * 100,
        theme: sec.theme,
        badge: sec.badge,
        desc: categories.productionSafety.issues[0] || 'No major issues found.'
      },
      docs: {
        val: `${Math.round((categories.repoCredibility.score / 25) * 100)}%`,
        progress: (categories.repoCredibility.score / 25) * 100,
        theme: 'warning',
        badge: 'Review',
        desc: categories.repoCredibility.issues[0] || 'Documentation looks good.'
      },
      testing: {
        val: `${Math.round((categories.developerExperience.score / 25) * 100)}%`,
        progress: (categories.developerExperience.score / 25) * 100,
        theme: 'success',
        badge: 'Good',
        desc: categories.developerExperience.issues[0] || 'Dev experience is solid.'
      },
      deploy: {
        val: dep.grade,
        progress: (categories.deploymentReality.score / 25) * 100,
        theme: dep.theme,
        badge: dep.badge,
        desc: categories.deploymentReality.issues[0] || 'Deployment config valid.'
      }
    };
  };

  const data = mapData();

  return (
    <section className='min-h-screen bg-gray-50'>
      <header className='flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white border-b border-[#E2E8F0] px-6 py-4 gap-4'>
        <div>
          <p className='text-sm text-[#475569] font-medium'>{analysisData?.repoUrl || 'Repo name'}</p>
          <h1 className='text-3xl font-bold text-black mt-1'>Readiness Audit</h1>
        </div>

        <div className='flex flex-wrap gap-3 w-full lg:w-auto'>
          <CustomButton
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Re-scan
          </CustomButton>
          <CustomButton className="w-full sm:w-auto">
            Export Report
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
          {/* Card */}
          <div className="max-w-lg flex bg-white p-7 rounded-lg flex-col gap-4 w-full">
            <p className="font-bold text-2xl text-black">Overall Ship Score</p>
            <p className="font-medium mt-2 text-[#64748B] text-base">
              Based on AI analysis of your codebase security, documentation coverage, test reliability, and deployment configurations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 items-start sm:items-center">
              <div className="bg-[#FDE68A] flex items-center gap-2 rounded-lg font-bold py-2 px-4 text-[#B45309]">
                <AlertTriangle size={20} /> {data.score < 80 ? 'not production ready' : 'Production Ready'}
              </div>
              <p className="text-[#64748B] text-sm mt-1 sm:mt-0">last scanned just now</p>
            </div>

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
        </motion.div>

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
              value={data.deploy.val}
              valueLabel="Config Score"
              badge={data.deploy.badge}
              description={data.deploy.desc}
              progress={data.deploy.progress}
              theme={data.deploy.theme}
            />
          </motion.div>

        </motion.div>

      </main>

      <RepoScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}

export default Dashboard