import React from 'react'
import Button from './Button'

const RepoInput = () => {
return (
    <form className='flex border border-white rounded'>
        <input 
            placeholder='Paste GitHub repository URL (e.g., github.com/owner/repo)' 
            className='bg-[#0B0E17] p-3 w-full text-white placeholder-gray-400 focus:outline-none'  
        />
        <Button type="submit">Scan Repository</Button>
    </form>
)
}

export default RepoInput
