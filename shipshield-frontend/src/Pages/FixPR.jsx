import React from 'react'
import { motion } from 'framer-motion'
import { GitPullRequest, CheckCircle } from 'lucide-react'

const FixPR = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 p-6 md:p-10"
    >
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-black">Fix PR</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review AI-generated fixes and prepare pull requests.
        </p>
      </header>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-700 font-medium">
          <GitPullRequest size={20} />
          Generated Pull Request
        </div>

        <p className="text-sm text-gray-500">
          AI suggestions for fixing detected issues will appear here.
          You can review changes before opening a pull request.
        </p>

        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle size={16} />
          No pending fixes yet
        </div>
      </div>
    </motion.section>
  )
}

export default FixPR
