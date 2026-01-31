import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GitPullRequest, CheckCircle, Loader2, AlertTriangle, ExternalLink } from 'lucide-react'
import CustomButton from '../components/ui/Button'
import { api } from '../services/api' // Make sure api.js has a call for /pr/generate

const FixPR = () => {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [prData, setPrData] = useState(null)
  const [error, setError] = useState(null)

  const handleGeneratePR = async () => {
    if (!repoUrl) return setError('Please enter a GitHub repository URL.')

    setLoading(true)
    setError(null)
    setPrData(null)

    try {
      const response = await api.generatePR({ repoUrl }) // POST to backend
      setPrData(response)
    } catch (err) {
      setError(err.message || 'Failed to generate PR. Check the repo URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 p-6 md:p-10"
    >
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-black">Fix PR</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review AI-generated fixes and create pull requests directly.
        </p>
      </header>

      {/* Input */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Enter GitHub repo URL (e.g., https://github.com/user/repo)"
          className="flex-1 p-3 border border-gray-300 rounded-lg"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <CustomButton onClick={handleGeneratePR} disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <GitPullRequest className="mr-2" />}
          Generate PR
        </CustomButton>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 font-medium mb-4">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* PR Result */}
      {prData ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 max-w-xl">
          <div className="flex items-center gap-3 text-green-600 font-medium">
            <CheckCircle size={20} />
            PR Generated Successfully
          </div>
          <p className="text-sm text-gray-500">
            Branch <span className="font-medium">{prData.branch}</span> created and PR is ready.
          </p>
          <a
            href={prData.prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
          >
            View Pull Request <ExternalLink size={16} />
          </a>
        </div>
      ) : (
        !loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <CheckCircle size={16} />
            No PR generated yet
          </div>
        )
      )}
    </motion.section>
  )
}

export default FixPR
