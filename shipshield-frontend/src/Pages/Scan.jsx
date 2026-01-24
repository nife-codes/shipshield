import React, { useEffect, useState } from 'react'
import SpinningScore from '../components/score/SpinningScore'
import CustomButton from '../components/ui/Button'
import AnalysisSteps from '../components/ui/AnalysisSteps'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Scan = ({ steps = [] }) => {
  const defaultSteps = [
    {
      status: 'done',
      title: 'Repository cloned successfully',
      time: '10:40:01'
    },
    {
      status: 'done',
      title: 'Fetched repo in 2.4s successfully',
      time: '10:40:01'
    },
    {
      status: 'done',
      title: 'Dependency analysis',
      description: 'Scanned 1240 packages. No critical vulnerabilities',
      time: '10:40:05'
    },
    {
      status: 'running',
      title: 'Running static code analysis',
      description: 'Running for anti-patterns and code quality issues.',
      time: '10:40:06'
    },
    {
      status: 'pending',
      title: 'AI context integration',
      description: 'Waiting for analysis completion...',
      time: ''
    },
    {
      status: 'pending',
      title: 'Generate Readiness Report',
      description: 'Analyzing audit scores.',
      time: ''
    }
  ];

  const finalSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <section className='bg-[#F2F3F7] flex justify-center p-4 md:p-10 items-center min-h-screen'>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
        className='bg-white flex flex-col border border-[#D9F5E6] items-center rounded-lg p-6 md:p-10 w-full max-w-2xl shadow-xl'
      >
        <h1 className='text-black uppercase text-2xl text-center font-bold'>Analyzing Repository</h1>
        <p className='text-gray-600 font-medium text-sm text-center mt-3 px-4'>
          ShipSafe is running a comprehensive readiness audit on <span className='bg-[#F3F4F6] px-2 py-1 rounded text-[#6B7280] font-mono break-all'>Repo name</span>
        </p>

        <motion.div
          className='mt-8'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.3, delay: 0.2 }}
        >
          <SpinningScore score={56} size={150} />
        </motion.div>

        <div className="w-full mt-6">
          <AnalysisSteps steps={finalSteps} />
        </div>


        {finalSteps.every(step => step.status === 'done') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className='mt-8'
          >
            <SpinningScore score={56} size={150} />
          </motion.div>
        )}

        <hr className='text-[#b4b4b494] w-full my-6' />
        <div className='flex flex-col-reverse sm:flex-row justify-between items-center w-full gap-4'>
          <div className='flex-1 w-full sm:w-auto text-center sm:text-left'>
            <button className='text-sm font-medium text-gray-500 hover:text-black transition-colors'>View Logs</button>
          </div>
          <div className='flex-1 w-full sm:w-auto'>
            <CustomButton color='danger' className="w-full sm:w-auto">
              Cancel Audit
            </CustomButton>
          </div>
        </div>
      </motion.main>
    </section>
  )
}

export default Scan
