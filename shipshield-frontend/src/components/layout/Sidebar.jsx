import React from 'react'
import logo from '../../assets/logo.png'
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  GitPullRequest,
  X
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, route: "/dashboard" },
    { label: "Issues", icon: AlertTriangle, route: "/issues" },
    { label: "Fix PR", icon: GitPullRequest, route: "/fixpr" },
  ];


  return (
    <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E2E8F0] transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
    `}>
      <header className="p-4 flex justify-between items-center border-b border-[#E2E8F0]">
        <div className="flex items-center">
          <img src={logo} alt="ShipShield Logo" className="h-8 w-8 inline-block mr-2" />
          <p className='text-black font-medium'>shipshield</p>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-black">
          <X size={20} />
        </button>
      </header>

      <nav className="p-4">
        {navItems.map((item) => (
          <NavLink
            to={item.route}
            key={item.label}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) =>
              `flex items-center p-3 mb-4  rounded cursor-pointer` +
              (isActive ? " bg-[#E0E4FF] text-[#4F5BD5] font-semibold" : "hover:bg-gray-200 text-gray-700 ")
            }
          >
            <item.icon size={20} className="mr-3" />
            <p className="text-sm font-medium">{item.label}</p>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
