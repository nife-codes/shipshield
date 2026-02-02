import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitPullRequest, CheckCircle, Loader2, AlertTriangle, ExternalLink, Check } from 'lucide-react'
import CustomButton from '../components/ui/Button'
import { api } from '../services/api'
import { mapAnalysisData, generateFixSuggestion } from '../lib/scoring'
import { generateFileChanges } from '../lib/fixGenerator'

const FixPR = () => {
  const [repoData, setRepoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [prData, setPrData] = useState(null)
  const [error, setError] = useState(null)
  const [suggestedFixes, setSuggestedFixes] = useState([])
  const [selectedFixes, setSelectedFixes] = useState(new Set())

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const latestRepo = await api.getLatestRepo()
        setRepoData(latestRepo)

        // Get analysis data to extract issues
        const scored = mapAnalysisData(latestRepo)
        const fixes = (scored.topIssues || []).map((issue, idx) => ({
          id: idx + 1,
          title: issue.title || `Issue #${idx + 1}`,
          description: issue.description || issue,
          fix: generateFixSuggestion(issue.description || issue, issue.title),
          severity: issue.severity || 'Medium',
        }))
        setSuggestedFixes(fixes)

        // Select all fixes by default
        setSelectedFixes(new Set(fixes.map(f => f.id)))
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch repo data:', err)
        setError('Failed to load repository data')
        setLoading(false)
      }
    }
    fetchRepoData()
  }, [])

  const toggleFix = (fixId) => {
    setSelectedFixes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fixId)) {
        newSet.delete(fixId)
      } else {
        newSet.add(fixId)
      }
      return newSet
    })
  }

  const handleGeneratePR = async () => {
    if (!repoData?.repoUrl) {
      setError('Repository URL not found')
      return
    }

    if (selectedFixes.size === 0) {
      setError('Please select at least one fix to include in the PR')
      return
    }

    setGenerating(true)
    setError(null)
    setPrData(null)

    try {
      // Get selected fix objects
      const selectedFixObjects = suggestedFixes.filter(fix => selectedFixes.has(fix.id))

      // Generate actual file changes based on selected fixes
      const filesToAdd = generateFileChanges(selectedFixObjects)

      // Generate PR with real file changes
      const response = await api.generatePR(repoData.repoUrl, filesToAdd)
      setPrData(response)
    } catch (err) {
      setError(err.message || 'Failed to generate PR')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header - matching Dashboard style */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white border-b border-[#E2E8F0] px-6 py-4 gap-4">
        <div>
          <p className="text-sm text-[#475569] font-medium">{repoData?.name || 'Repository'}</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Generate Fix PR</h1>
        </div>

        <CustomButton
          onClick={handleGeneratePR}
          disabled={generating || selectedFixes.size === 0}
          color="primary"
          variant="solid"
        >
          {generating ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Generating PR...
            </>
          ) : (
            <>
              <GitPullRequest size={18} className="mr-2" />
              Generate PR ({selectedFixes.size} {selectedFixes.size === 1 ? 'fix' : 'fixes'})
            </>
          )}
        </CustomButton>
      </header>

      <main className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Repository Info Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg text-black mb-2">Repository</h2>
          <p className="text-sm text-[#64748B]">{repoData?.repoUrl || 'No repository URL'}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* PR Success Message */}
        {prData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-green-600 font-medium mb-4">
              <CheckCircle size={24} />
              <span className="text-lg">PR Generated Successfully!</span>
            </div>
            <p className="text-sm text-[#64748B] mb-4">
              Branch <span className="font-medium text-black">{prData.branch}</span> created and pull request is ready.
            </p>
            <a
              href={prData.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              View Pull Request <ExternalLink size={16} />
            </a>
          </motion.div>
        )}

        {/* Fixes Selection */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] bg-gray-50">
            <h2 className="font-bold text-lg text-black">Select Fixes to Include</h2>
            <p className="text-sm text-[#64748B] mt-1">
              Choose which improvements to include in the pull request
            </p>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {suggestedFixes.length === 0 ? (
              <div className="px-6 py-8 text-center text-[#64748B]">
                <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                <p className="font-medium">No issues found!</p>
                <p className="text-sm mt-1">Your repository looks good.</p>
              </div>
            ) : (
              suggestedFixes.map((fix) => (
                <motion.div
                  key={fix.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedFixes.has(fix.id) ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => toggleFix(fix.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="mt-1">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedFixes.has(fix.id)
                            ? 'bg-[#4F5BD5] border-[#4F5BD5]'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {selectedFixes.has(fix.id) && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-black">{fix.title}</h3>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            fix.severity === 'High'
                              ? 'bg-red-100 text-red-600'
                              : fix.severity === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {fix.severity}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B] mb-2">{fix.description}</p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-1">Suggested Fix:</p>
                        <p className="text-sm text-[#64748B]">{fix.fix}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </motion.section>
  )
}

export default FixPR