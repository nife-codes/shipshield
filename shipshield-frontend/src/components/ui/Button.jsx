import React from 'react';

const Button = ({ children }) => {
    return (
        <button className={`bg-[#7B5CF6] text-white border-none py-2 px-4 w-full rounded`}>
        <h1 className='text-sm'>
         {children}    
        </h1>
        </button>
    );
}

export default Button;
