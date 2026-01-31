import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ShieldAlert, FileWarning } from 'lucide-react'
import CustomButton from '../components/ui/Button'

const issues = [
  {
    id: 1,
    title: 'Outdated Dependencies',
    description: '3 high-severity vulnerabilities found in package.json dependencies.',
    severity: 'High',
    icon: ShieldAlert,
  },
  {
    id: 2,
    title: 'Missing Environment Variables',
    description: '.env.example file is missing. This affects deployment reliability.',
    severity: 'Medium',
    icon: FileWarning,
  },
  {
    id: 3,
    title: 'Weak Error Handling',
    description: 'Some API calls do not handle failure states properly.',
    severity: 'Low',
    icon: AlertTriangle,
  },
]

const Issues = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 p-6 md:p-10"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Issues</h1>
        <p className="text-[#64748B] mt-1">
          Detailed breakdown of problems affecting your project’s ship readiness.
        </p>
      </div>

      {/* Issues List */}
      <div className="space-y-4 max-w-5xl">
        {issues.map((issue) => {
          const Icon = issue.icon

          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gray-100">
                  <Icon className="text-[#4F5BD5]" size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-black">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-[#64748B] mt-1">
                    {issue.description}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    issue.severity === 'High'
                      ? 'bg-red-100 text-red-600'
                      : issue.severity === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {issue.severity}
                </span>

                <CustomButton variant="outline">
                  View Fix
                </CustomButton>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

export default Issues
