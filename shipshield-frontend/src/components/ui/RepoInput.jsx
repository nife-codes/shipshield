import React from 'react'
import CustomButton from './Button'

const RepoInput = () => {
return (
    <form className='flex border border-white rounded'>
        <input 
            placeholder='Paste GitHub repository URL (e.g., github.com/owner/repo)' 
            className='bg-[#0B0E17] p-3 flex-1 text-white placeholder-gray-400 focus:outline-none'  
        />
        <CustomButton type="submit">Scan Repository</CustomButton>
    </form>
)
}

export default RepoInput
