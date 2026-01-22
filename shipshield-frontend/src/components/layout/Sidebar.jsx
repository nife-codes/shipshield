import React from 'react'
import logo from '../../assets/logo.png'
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  GitPullRequest,
} from "lucide-react";

const Sidebar = () => {
   const navItems = [
  { label: "Overview", icon: LayoutDashboard, route: "/dashboard" },
  { label: "Issues", icon: AlertTriangle, route: "/issues"   },
  { label: "Fix PR", icon: GitPullRequest, route: "/fixpr"  },
];


  return (
    <div className="w-70 bg-white border-r border-[#E2E8F0]">
      <header className="p-4 flex  items-center border-b border-[#E2E8F0]">
          <img src={logo} alt="ShipShield Logo" className="h-8 w-8 inline-block mr-2"/>
          <p className='text-black font-medium'>shipshield</p>
        </header>

        <nav className="p-4">
            {navItems.map((item) => (
                <NavLink
                to={item.route}
                key={item.label}
                className={({ isActive }) =>
                `flex items-center p-3 mb-4  rounded cursor-pointer` +
                (isActive ? " bg-[#E0E4FF] text-[#4F5BD5] font-semibold" : "hover:bg-gray-200 text-gray-700 ")
                }
                >
                    <item.icon size={20} className="mr-3"/>
                    <p className="text-sm font-medium">{item.label}</p>
                </NavLink>
            ))}
        </nav>
    </div>
  )
}

export default Sidebar
