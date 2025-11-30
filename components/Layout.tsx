
import React from 'react';
import { LayoutDashboard, Network, Calendar, Layers, BookOpen, List, Terminal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold text-white">
              N
            </div>
            <h1 className="text-xl font-bold tracking-tight">NGO Ops Platform</h1>
          </div>
          <p className="text-xs text-slate-500 mt-2">EMR / EHR / HIS System v1.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/hierarchy" icon={Network} label="Hierarchy Explorer" />
          <NavItem to="/structure" icon={List} label="Full Stack Structure" />
          <NavItem to="/timeline" icon={Calendar} label="Project Timeline" />
          <NavItem to="/modules" icon={Layers} label="Domain & Modules" />
          <NavItem to="/devops" icon={Terminal} label="DevOps Guidelines" />
          <NavItem to="/glossary" icon={BookOpen} label="Glossary" />
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <p>Version 1.0.0</p>
          <p>Planning Phase</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between flex-shrink-0 shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-800">Platform Overview</h2>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
              Status: Planning
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
              PM
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};
