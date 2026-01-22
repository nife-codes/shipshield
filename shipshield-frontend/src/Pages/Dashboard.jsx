import React from 'react'
import CustomButton from '../components/ui/Button'
import SpinningScore from '../components/score/SpinningScore'
import AuditMetricCard from '../components/ui/AuditMetricCard'
import { NavLink } from 'react-router-dom'
import {AlertTriangle,MoveRight,X,
  FileText,
  CheckCircle,
  UploadCloud,} from 'lucide-react'



const Dashboard = () => {
return (
    <section className='min-h-screen bg-gray-50'>
        <header className='flex justify-between items-center bg-white border-b border-[#E2E8F0] px-6 py-4'>
            <div>
                <p className='text-sm text-[#475569] font-medium'>Repo name</p>
                <h1 className='text-3xl font-bold text-black mt-1'>Readiness Audit</h1>
            </div>

            <div className='flex gap-3'>
                <CustomButton variant="outline">Re-scan</CustomButton>
                <CustomButton>Export Report</CustomButton>
            </div>
        </header>


        <main className="min-h-screen p-4 flex flex-col justify-center items-center gap-8 bg-gray-50">
  <div className="flex flex-col md:flex-row bg-gradient-to-b from-white/0 to-[#4f5ad54b] rounded-xl p-8 gap-10 items-center w-full max-w-5xl">
    
    {/* Card */}
    <div className="max-w-lg bg-white p-8 rounded-xl shadow-md flex flex-col gap-4">
      <p className="font-bold text-2xl text-black">Overall Ship Score</p>
      <p className="font-medium mt-2 text-[#64748B] text-base">
        Based on AI analysis of your codebase security, documentation coverage, test reliability, and deployment configurations.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-4 items-start sm:items-center">
        <div className="bg-[#FDE68A] flex items-center gap-2 rounded-lg font-bold py-2 px-4 text-[#B45309]">
          <AlertTriangle /> not production ready
        </div>
        <p className="text-[#64748B] text-sm mt-1 sm:mt-0">last scanned 2 minutes ago</p>
      </div>

      <NavLink to="/issues" className="mt-6 inline-block">
        <p className="text-[#4F5BD5] text-base flex gap-2 items-center cursor-pointer font-medium">
          View Detailed Breakdown <MoveRight />
        </p>
      </NavLink>
    </div>

    {/* Spinning Score */}
    <SpinningScore score={56} size={300} /> 
  </div>

  <div className='flex gap-3'>
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

  </div>

</main>


    </section>
)
}

export default Dashboard