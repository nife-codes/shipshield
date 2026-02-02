import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ShieldAlert, FileWarning, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import CustomButton from '../components/ui/Button'
import { useLocation } from 'react-router-dom'
import { api } from '../services/api'
import { mapAnalysisData, generateFixSuggestion } from '../lib/scoring'

const severityIcons = {
  High: ShieldAlert,
  Medium: FileWarning,
  Low: AlertTriangle,
}

const Issues = () => {
  const location = useLocation()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedIssues, setExpandedIssues] = useState(new Set())

  const toggleIssue = (issueId) => {
    setExpandedIssues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(issueId)) {
        newSet.delete(issueId)
      } else {
        newSet.add(issueId)
      }
      return newSet
    })
  }

  useEffect(() => {
    const fetchIssues = async () => {
      // If data exists in navigation state, use it
      if (location.state?.topIssues) {
        setIssues(transformIssues(location.state.topIssues))
        setLoading(false)
        return
      }

      // Otherwise fetch from backend
      try {
        const latestRepo = await api.getLatestRepo()
        if (latestRepo) {
          const scored = mapAnalysisData(latestRepo)
          setIssues(transformIssues(scored.topIssues || []))
        }
      } catch (err) {
        console.error('Failed to load issues:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [location.state])

  // Helper to map backend issues to frontend structure
  const transformIssues = (rawIssues) => {
    return rawIssues.map((issue, idx) => ({
      id: idx + 1,
      title: issue.title || `Issue #${idx + 1}`,
      description: issue.description || issue,
      severity: issue.severity || 'Medium',
      icon: severityIcons[issue.severity] || AlertTriangle,
      suggestedFix: generateFixSuggestion(issue.description || issue, issue.title),
    }))
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 mb-4">
        <h1 className="text-3xl font-bold text-black">Issues</h1>
        <p className="text-[#64748B] mt-1">
          Detailed breakdown of problems affecting your project's ship readiness.
        </p>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gray-50 p-6 md:p-10"
      >
        {/* Issues List */}
        <div className="space-y-4 max-w-5xl">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : issues.length === 0 ? (
            <p className="text-gray-500">No issues found. Your repo looks good!</p>
          ) : (
            issues.map((issue) => {
              const Icon = issue.icon

              return (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <Icon className="text-[#4F5BD5]" size={22} />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-black">{issue.title}</h3>
                        <p className="text-sm text-[#64748B] mt-1">{issue.description}</p>
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

                      <CustomButton
                        variant="outline"
                        onClick={() => toggleIssue(issue.id)}
                      >
                        {expandedIssues.has(issue.id) ? (
                          <>
                            Hide Fix <ChevronUp size={16} className="ml-1" />
                          </>
                        ) : (
                          <>
                            View Fix <ChevronDown size={16} className="ml-1" />
                          </>
                        )}
                      </CustomButton>
                    </div>
                  </div>

                  {/* Expandable Fix Section */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedIssues.has(issue.id) ? 'auto' : 0,
                      opacity: expandedIssues.has(issue.id) ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-[#E2E8F0] bg-gray-50">
                      <h4 className="font-semibold text-sm text-black mb-2">Suggested Fix:</h4>
                      <p className="text-sm text-[#64748B] leading-relaxed">
                        {issue.suggestedFix}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.section>
    </>
  )
}

export default Issues