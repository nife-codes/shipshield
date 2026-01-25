import React from 'react'
import CustomButton from './Button'

const RepoInput = ({ onSubmit, theme = 'dark', className = '' }) => {
    const [url, setUrl] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(url);
        } else {
            console.log('Repo URL:', url);
        }
    };

    const isLight = theme === 'light';

    return (
        <form onSubmit={handleSubmit} className={`flex rounded-lg overflow-hidden border transition-colors ${isLight ? 'border-gray-200 bg-white' : 'border-white/20 bg-[#0B0E17]'
            } ${className}`}>
            <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder='Paste GitHub repository URL (e.g., github.com/owner/repo)'
                className={`p-3 flex-1 focus:outline-none text-sm md:text-base ${isLight ? 'text-gray-900 placeholder-gray-500' : 'text-white placeholder-gray-400 bg-transparent'
                    }`}
            />
            <CustomButton type="submit" variant={isLight ? 'default' : 'default'} className="rounded-none">
                Scan Repository
            </CustomButton>
        </form>
    )
}

export default RepoInput
