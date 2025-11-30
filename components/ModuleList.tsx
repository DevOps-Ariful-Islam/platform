import React from 'react';
import { DOMAINS, PLATFORM_HIERARCHY } from '../data';
import { ChevronRight } from 'lucide-react';

export const ModuleList: React.FC = () => {
  // Flatten hierarchy to get modules grouped by domain
  const domainsNode = PLATFORM_HIERARCHY.children;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Domains & Modules</h2>
        <p className="text-sm text-slate-500">Detailed breakdown of the 5 domains and their constituent modules.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {domainsNode?.map((domain) => (
          <div key={domain.code} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center">
                   <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded mr-3 font-mono">{domain.code}</span>
                   {domain.name}
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                {domain.children?.length} Modules
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {domain.children?.map((module) => (
                <div key={module.code} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between group">
                    <div className="flex items-center mb-2 md:mb-0">
                        <div className="mr-4">
                             <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {module.code?.split('.').pop()}
                             </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-slate-900">{module.name}</h4>
                            <p className="text-xs text-slate-400 font-mono">{module.code}</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 md:w-1/2 justify-end">
                        {module.children?.slice(0, 3).map((comp, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                {comp.name}
                            </span>
                        ))}
                        {(module.children?.length || 0) > 3 && (
                            <span className="text-xs bg-slate-50 text-slate-400 px-2 py-1 rounded">
                                +{(module.children?.length || 0) - 3} more
                            </span>
                        )}
                        <ChevronRight size={16} className="text-slate-300 ml-2 group-hover:text-blue-500 transition-colors" />
                    </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};