import React from 'react';
import { KEY_METRICS, DOMAINS } from '../data';
import { DollarSign, Clock, Grid, Server, Network, Database, Activity, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const iconMap: Record<string, any> = {
  DollarSign, Clock, Grid, Server, Network, Database
};

export const Dashboard: React.FC = () => {
  const chartData = DOMAINS.map(d => ({
    name: d.id,
    full: d.name,
    modules: d.modules,
    color: d.color.replace('bg-', '').replace('-500', '') // approximate mapping
  }));

  const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f97316', '#64748b'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Executive Summary</h2>
        <p className="text-slate-500">High-level overview of the NGO Operations Platform project plan and architecture.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KEY_METRICS.map((metric, idx) => {
          const Icon = iconMap[metric.icon] || Activity;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm font-medium">{metric.label}</span>
                <Icon size={16} className="text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{metric.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Domain Distribution Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Grid size={18} className="mr-2 text-blue-500" />
            Module Distribution by Domain
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="full" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="modules" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links / Domain Cards */}
        <div className="space-y-4">
             <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-xl font-bold mb-2">Project Status: Planning</h3>
                <p className="text-slate-300 mb-4">The project is currently in the initial planning phase (Week 0). The roadmap spans 32 weeks with 5 distinct phases.</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                    <span>Started</span>
                    <span>5% Complete</span>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Architecture Highlights</h3>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <div className="mt-1 mr-3 min-w-[20px]"><ArrowUpRight size={16} className="text-green-500" /></div>
                        <span className="text-slate-600 text-sm">Micro-modular design with 24 specialized modules ensures scalability.</span>
                    </li>
                    <li className="flex items-start">
                        <div className="mt-1 mr-3 min-w-[20px]"><ArrowUpRight size={16} className="text-green-500" /></div>
                        <span className="text-slate-600 text-sm">Canonical Indexing System (e.g., CD.1.1) provides unique identification for all components.</span>
                    </li>
                    <li className="flex items-start">
                        <div className="mt-1 mr-3 min-w-[20px]"><ArrowUpRight size={16} className="text-green-500" /></div>
                        <span className="text-slate-600 text-sm">Full compliance with FHIR and HL7 standards for interoperability.</span>
                    </li>
                </ul>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DOMAINS.map(d => (
            <div key={d.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-default">
                <div className={`w-3 h-3 rounded-full mb-3 ${d.color}`}></div>
                <h4 className="font-bold text-slate-800">{d.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{d.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>{d.id}</span>
                    <span>{d.modules} Modules</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};