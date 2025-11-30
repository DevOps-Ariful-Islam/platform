
import React, { useState } from 'react';
import { PLATFORM_HIERARCHY } from '../data';
import { HierarchyNode } from '../types';
import { 
    ChevronRight, ChevronDown, Server, Database, Box, Layers, 
    Globe, Lock, Activity, FileText, Share2, AlertCircle, Link as LinkIcon
} from 'lucide-react';

interface TreeNodeProps {
    node: HierarchyNode;
    level: number;
    highlightCode?: string;
    onHighlight?: (code: string) => void;
}

const TypeIcon = ({ type, className }: { type: string, className?: string }) => {
    switch(type) {
        case 'platform': return <Globe size={16} className={`text-blue-600 ${className}`} />;
        case 'domain': return <Layers size={16} className={`text-purple-600 ${className}`} />;
        case 'module': return <Box size={16} className={`text-emerald-600 ${className}`} />;
        case 'component': return <Activity size={16} className={`text-amber-600 ${className}`} />;
        case 'service': return <Server size={16} className={`text-indigo-600 ${className}`} />;
        case 'data': return <Database size={16} className={`text-slate-600 ${className}`} />;
        default: return <FileText size={16} className={`text-slate-400 ${className}`} />;
    }
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, highlightCode, onHighlight }) => {
    const [isExpanded, setIsExpanded] = useState(level < 2); // Default expand top levels

    const hasChildren = (node.children && node.children.length > 0) || node.apiSpecs || node.dataSchema;
    const isHighlighted = highlightCode && node.code === highlightCode;

    // Auto-expand if highlighted (simplified, could be recursive)
    React.useEffect(() => {
        if (isHighlighted) {
             const element = document.getElementById(`node-${node.code}`);
             element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isHighlighted, node.code]);

    const handleDependencyClick = (depCode: string) => {
        if (onHighlight) onHighlight(depCode);
    };

    return (
        <div id={`node-${node.code}`} className="select-none">
            <div 
                className={`
                    flex items-center py-1.5 px-2 hover:bg-slate-50 transition-colors cursor-pointer border-l-2
                    ${isHighlighted ? 'bg-yellow-50 border-yellow-400' : 'border-transparent'}
                `}
                style={{ paddingLeft: `${level * 20}px` }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400">
                    {hasChildren && (
                        isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                </div>
                
                <TypeIcon type={node.type} className="mr-2" />
                
                <div className="flex-1 flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-800">{node.name}</span>
                    {node.code && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                            {node.code}
                        </span>
                    )}
                    {node.description && level < 3 && (
                        <span className="text-xs text-slate-400 truncate hidden md:inline ml-2 max-w-xs">
                             — {node.description}
                        </span>
                    )}
                </div>

                {node.dependencies && node.dependencies.length > 0 && (
                    <div className="flex gap-1 ml-auto">
                        {node.dependencies.map(dep => (
                            <button 
                                key={dep}
                                onClick={(e) => { e.stopPropagation(); handleDependencyClick(dep); }}
                                className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded hover:bg-amber-100 transition-colors"
                                title={`Depends on ${dep}`}
                            >
                                <LinkIcon size={10} /> {dep}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isExpanded && (
                <div className="animate-fade-in">
                    {/* API Specs Expansion */}
                    {node.type === 'service' && node.apiSpecs && (
                        <div className="ml-8 my-2 mr-4 border border-indigo-100 rounded-lg overflow-hidden shadow-sm bg-white">
                            <div className="bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 flex items-center gap-2 border-b border-indigo-100">
                                <Server size={12} /> API Specifications (Level 5 Detail)
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th className="py-2 px-3 w-16">Method</th>
                                            <th className="py-2 px-3">Endpoint</th>
                                            <th className="py-2 px-3">Summary</th>
                                            <th className="py-2 px-3">Parameters</th>
                                            <th className="py-2 px-3">Response</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {node.apiSpecs.map((spec, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="py-2 px-3">
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${
                                                        spec.method === 'GET' ? 'bg-blue-500' : 
                                                        spec.method === 'POST' ? 'bg-green-500' : 
                                                        spec.method === 'PUT' ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}>
                                                        {spec.method}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 font-mono text-slate-700">{spec.endpoint}</td>
                                                <td className="py-2 px-3 text-slate-600">{spec.summary}</td>
                                                <td className="py-2 px-3 text-slate-500">
                                                    {spec.parameters?.map((p, idx) => (
                                                        <div key={idx} className="whitespace-nowrap">
                                                            <span className="font-mono text-slate-700">{p.name}</span>
                                                            <span className="text-slate-400 mx-1">:</span>
                                                            <span className="text-blue-600">{p.type}</span>
                                                            {p.required && <span className="text-red-400 ml-1">*</span>}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-2 px-3 font-mono text-emerald-600">{spec.response}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Data Schema Expansion */}
                    {node.type === 'data' && node.dataSchema && (
                        <div className="ml-8 my-2 mr-4 border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                             <div className="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-2 border-b border-slate-200">
                                <Database size={12} /> Database Schema: {node.dataSchema.tableName}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th className="py-2 px-3">Column Name</th>
                                            <th className="py-2 px-3">Data Type</th>
                                            <th className="py-2 px-3">Constraints</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {node.dataSchema.columns.map((col, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="py-2 px-3 font-mono text-slate-700">{col.name}</td>
                                                <td className="py-2 px-3 text-blue-600 font-mono">{col.type}</td>
                                                <td className="py-2 px-3">
                                                    {col.constraints?.map((c, idx) => (
                                                        <span key={idx} className="inline-block bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100 mr-1 text-[10px]">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Children Recursion */}
                    {node.children?.map((child) => (
                        <TreeNode 
                            key={child.code || child.name} 
                            node={child} 
                            level={level + 1} 
                            highlightCode={highlightCode}
                            onHighlight={onHighlight}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const FullStackTree: React.FC = () => {
    const [highlightedCode, setHighlightedCode] = useState<string | undefined>(undefined);

    const handleHighlight = (code: string) => {
        setHighlightedCode(code);
        // Clear highlight after 2 seconds
        setTimeout(() => setHighlightedCode(undefined), 2000);
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-800">Full Stack Structure Tree</h2>
                <p className="text-sm text-slate-500">
                    Interactive hierarchical view of the complete platform from Domains (Level 2) down to API Specifications (Level 5) and Database Schemas.
                </p>
                
                <div className="flex gap-4 mt-4 text-xs text-slate-500 bg-white p-2 rounded border border-slate-200">
                    <div className="flex items-center gap-1"><Layers size={14} className="text-purple-600"/> Domain</div>
                    <div className="flex items-center gap-1"><Box size={14} className="text-emerald-600"/> Module</div>
                    <div className="flex items-center gap-1"><Server size={14} className="text-indigo-600"/> Service (API)</div>
                    <div className="flex items-center gap-1"><Database size={14} className="text-slate-600"/> Data Schema</div>
                </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex-1 overflow-y-auto p-2">
                    <TreeNode 
                        node={PLATFORM_HIERARCHY} 
                        level={0} 
                        highlightCode={highlightedCode}
                        onHighlight={handleHighlight}
                    />
                </div>
            </div>
        </div>
    );
};
