import React from 'react'
import logo from '../../assets/logo.png'
const Navbar = () => {
  return (
  <header className="bg-[#0B0E17] p-2 flex  items-center border-b border-[#1A1F2B]">
    <img src={logo} alt="ShipShield Logo" className="h-8 w-8 inline-block mr-2"/>
    <p className='text-white font-medium'>shipshield</p>
  </header>
  )
}

export default Navbar
