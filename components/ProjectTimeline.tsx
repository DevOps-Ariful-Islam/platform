import React from 'react';
import { PROJECT_PHASES } from '../data';

export const ProjectTimeline: React.FC = () => {
  const totalWeeks = 32;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Project Implementation Timeline</h2>
        <p className="text-sm text-slate-500">32-week roadmap across 5 phases. Estimated Budget: $1,000,000.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 overflow-x-auto">
        <div className="min-w-[800px]">
            {/* Header Weeks */}
            <div className="flex border-b border-slate-100 pb-4 mb-4">
                <div className="w-48 flex-shrink-0 font-bold text-slate-700">Phase</div>
                <div className="flex-1 grid grid-cols-8 gap-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="text-center text-xs text-slate-400 border-l border-slate-100">
                            W{(i * 4) + 1}-{(i + 1) * 4}
                        </div>
                    ))}
                </div>
            </div>

            {/* Phases Rows */}
            <div className="space-y-6">
                {PROJECT_PHASES.map((phase) => {
                    const duration = phase.endWeek - phase.startWeek + 1;
                    const startOffset = phase.startWeek - 1;
                    // Calculate percentage width and margin
                    const widthPct = (duration / totalWeeks) * 100;
                    const leftPct = (startOffset / totalWeeks) * 100;

                    let barColor = "bg-blue-500";
                    if(phase.id === 2) barColor = "bg-emerald-500";
                    if(phase.id === 3) barColor = "bg-purple-500";
                    if(phase.id === 4) barColor = "bg-orange-500";
                    if(phase.id === 5) barColor = "bg-slate-500";

                    return (
                        <div key={phase.id} className="relative">
                            <div className="flex items-center mb-2">
                                <div className="w-48 flex-shrink-0 pr-4">
                                    <h4 className="font-bold text-sm text-slate-800">{phase.name}</h4>
                                    <p className="text-xs text-slate-500">Weeks {phase.startWeek}-{phase.endWeek}</p>
                                    <p className="text-xs text-slate-400 mt-1">${phase.budget.toLocaleString()}</p>
                                </div>
                                <div className="flex-1 h-12 bg-slate-50 rounded-lg relative overflow-hidden border border-slate-100">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 grid grid-cols-8 w-full h-full">
                                         {Array.from({ length: 8 }).map((_, i) => (
                                            <div key={i} className="border-l border-slate-200 h-full first:border-l-0"></div>
                                        ))}
                                    </div>
                                    
                                    {/* The Bar */}
                                    <div 
                                        className={`absolute top-2 bottom-2 rounded-md shadow-sm ${barColor} flex items-center px-3 text-white text-xs font-medium whitespace-nowrap overflow-hidden transition-all hover:opacity-90 cursor-pointer`}
                                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                        title={phase.description}
                                    >
                                        {phase.status}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Deliverables tags */}
                            <div className="pl-48 flex flex-wrap gap-2">
                                {phase.deliverables.map((d, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded border border-slate-200">
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};