import React from 'react'
import SpinningScore from '../components/score/SpinningScore'
import CustomButton from '../components/ui/Button'
import AnalysisSteps from '../components/ui/AnalysisSteps'

const Scan = ({steps = []}) => {
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
    <section className='bg-[#F2F3F7] flex justify-center p-10 items-center min-h-screen'>
         <main className='bg-white flex flex-col border border-[#D9F5E6] items-center rounded-lg p-10 max-w-max'>
                    <h1 className='text-black uppercase text-2xl text-center font-bold'>Analyzing Repository</h1>
                    <p className='text-gray-600 font-medium text-sm text-center mt-3'>ShipSafe is running a comprehensive readiness audit on <span className='bg-[#F3F4F6] px-2 py-1 rounded text-[#6B7280] font-mono'>Repo name</span></p>
                    <div className='mt-8'>
                            <SpinningScore score={56} size={150} /> 
                    </div>

                        <AnalysisSteps steps={finalSteps} />
        
        
            {finalSteps.every(step => step.status === 'done') && (
             <div className='mt-8'>
             <SpinningScore score={56} size={150} /> 
             </div>
            )}

                    <hr className='text-[#b4b4b494] w-full my-6'/>
                    <div className='flex justify-between items-center w-full gap-4'>
                            <div className='flex-1'>
                                <p className='text-sm font-medium'>View Logs</p>
                            </div>
                            <div className='flex-1'>
                                <CustomButton color='danger'>
                                    Cancel Audit
                                </CustomButton>
                            </div>
                    </div>
         </main>
    </section>
)
}

export default Scan
