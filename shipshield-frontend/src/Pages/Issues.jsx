import React from 'react'
import { motion } from 'framer-motion'

const Issues = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-10"
    >
      <h1 className="text-2xl font-bold mb-4">Issues</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-gray-500">
        Issues tracking module placeholder.
      </div>
    </motion.div>
  )
}

export default Issues
