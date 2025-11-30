
import React, { useState } from 'react';
import { DEVOPS_GUIDES } from '../data';
import { Terminal, Github, Cloud, Copy, Check, ChevronRight, Monitor, Play, AlertCircle } from 'lucide-react';

const iconMap: Record<string, any> = {
  Monitor, Github, Cloud
};

export const DevOpsGuide: React.FC = () => {
  const [activeGuideId, setActiveGuideId] = useState(DEVOPS_GUIDES[0].id);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const activeGuide = DEVOPS_GUIDES.find(g => g.id === activeGuideId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">DevOps Guidelines</h2>
        <p className="text-sm text-slate-500">Step-by-step instructions for local development and deployment.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
        {DEVOPS_GUIDES.map((guide) => {
          const Icon = iconMap[guide.icon];
          const isActive = guide.id === activeGuideId;
          return (
            <button
              key={guide.id}
              onClick={() => setActiveGuideId(guide.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{guide.title}</span>
            </button>
          );
        })}
      </div>

      {/* Guide Content */}
      {activeGuide && (
        <div className="animate-fade-in space-y-8">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <div className="bg-blue-200 p-2 rounded-lg text-blue-700">
                    {React.createElement(iconMap[activeGuide.icon], { size: 24 })}
                </div>
                <div>
                    <h3 className="font-bold text-blue-900 text-lg">{activeGuide.title}</h3>
                    <p className="text-blue-700 text-sm">{activeGuide.description}</p>
                </div>
            </div>

            <div className="space-y-6">
                {activeGuide.steps.map((step, index) => (
                    <div key={index} className="flex gap-4 relative">
                        {/* Connecting Line */}
                        {index < activeGuide.steps.length - 1 && (
                            <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-slate-200"></div>
                        )}
                        
                        {/* Step Number Bubble */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm z-10">
                            {index + 1}
                        </div>

                        {/* Step Content Card */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-slate-800 text-lg mb-1">{step.title}</h4>
                            <p className="text-slate-600 mb-4">{step.description}</p>

                            {/* Command Block */}
                            {step.command && (
                                <div className="bg-slate-900 rounded-lg p-4 relative group">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => copyToClipboard(step.command!)}
                                            className="p-1.5 bg-slate-700 text-slate-300 rounded hover:text-white transition-colors"
                                            title="Copy command"
                                        >
                                            {copiedText === step.command ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <pre className="font-mono text-xs md:text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
                                        <span className="text-slate-500 select-none">$ </span>
                                        {step.command}
                                    </pre>
                                </div>
                            )}

                            {/* Visual Tip */}
                            {step.tip && (
                                <div className="mt-4 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                    <span>{step.tip}</span>
                                </div>
                            )}

                            {/* Image Placeholder */}
                            {step.image && (
                                <div className="mt-4 bg-slate-100 rounded-lg h-32 flex items-center justify-center border border-dashed border-slate-300 text-slate-400">
                                    <span className="text-xs font-mono">Image: {step.image}.png</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Success State */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                    <Check size={24} strokeWidth={3} />
                </div>
                <h3 className="font-bold text-emerald-900 text-lg">Ready to Go!</h3>
                <p className="text-emerald-700 text-sm max-w-md">
                    You have completed the {activeGuide.title} guide. If you encounter any issues, check the repository issues tab or consult the documentation.
                </p>
            </div>
        </div>
      )}
    </div>
  );
};
