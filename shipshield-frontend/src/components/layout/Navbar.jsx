import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="bg-[#0B0E17] p-4 flex justify-between items-center border-b border-[#1A1F2B]">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="ShipShield Logo" className="h-8 w-8 inline-block mr-2" />
        <p className="text-white font-medium">shipshield</p>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/SignIn" className="text-white px-4 py-2 bg-[#7B5CF6] rounded hover:bg-[#1A1F2B] transition">
          Sign In
        </Link>
        <Link to="/SignUp" className="text-white px-4 py-2 rounded border border-[#1A1F2B] hover:bg-[#1A1F2B] transition">
          Sign Up
        </Link>
      </div>
    </header>
  )
}

export default Navbar
