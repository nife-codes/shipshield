import React, { useState } from 'react'
import CustomButton from '../components/ui/Button'
import SpinningScore from '../components/score/SpinningScore'
import AuditMetricCard from '../components/ui/AuditMetricCard'
import RepoScanModal from '../components/Auth/RepoScanModal'
import { NavLink } from 'react-router-dom'
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



  return (
    <section className='min-h-screen bg-gray-50'>
      <header className='flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white border-b border-[#E2E8F0] px-6 py-4 gap-4'>
        <div>
          <p className='text-sm text-[#475569] font-medium'>Repo name</p>
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
                <AlertTriangle size={20} /> not production ready
              </div>
              <p className="text-[#64748B] text-sm mt-1 sm:mt-0">last scanned 2 minutes ago</p>
            </div>

            <NavLink to="/issues" className="mt-6 inline-block group">
              <p className="text-[#4F5BD5] text-base flex gap-2 items-center cursor-pointer font-medium group-hover:underline">
                View Detailed Breakdown <MoveRight className="transition-transform group-hover:translate-x-1" />
              </p>
            </NavLink>
          </div>

          {/* Spinning Score */}
          <div className="flex-1 flex justify-center">
            <SpinningScore score={56} size={250} />
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
              value="C-"
              valueLabel="Critical Issues"
              badge="Needs Work"
              description="3 High severity vulnerabilities detected in package.json"
              progress={45}
              theme="danger"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <AuditMetricCard
              title="Documentation"
              icon={FileText}
              value="58%"
              valueLabel="Coverage"
              badge="Improve"
              description="README.md is missing setup instructions. API docs are partial."
              progress={58}
              theme="warning"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <AuditMetricCard
              title="CI & Testing"
              icon={CheckCircle}
              value="92%"
              valueLabel="Pass Rate"
              badge="Good"
              description="All unit tests passed. Integration tests coverage is robust."
              progress={92}
              theme="success"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <AuditMetricCard
              title="Deployment"
              icon={UploadCloud}
              value="A"
              valueLabel="Config Score"
              badge="Stable"
              description="Dockerfiles are optimized. Kubernetes manifests validated."
              progress={85}
              theme="info"
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