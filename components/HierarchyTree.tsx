
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PLATFORM_HIERARCHY } from '../data';
import { HierarchyNode } from '../types';
import { ZoomIn, ZoomOut, RefreshCw, GitMerge, AlertCircle, Database, Server, Code } from 'lucide-react';

export const HierarchyTree: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<d3.HierarchyNode<HierarchyNode> | null>(null);
  const [showDependencies, setShowDependencies] = useState(false);
  const [hierarchyRoot, setHierarchyRoot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'api' | 'schema'>('info');

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("font", "12px sans-serif")
      .style("user-select", "none");

    // Add arrow marker definitions
    const defs = svg.append("defs");
    defs.append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10) // Position relative to end of line
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#f59e0b");

    const g = svg.append("g");
    const linkGroup = g.append("g").attr("class", "links");
    const depLinkGroup = g.append("g").attr("class", "dep-links");
    const nodeGroup = g.append("g").attr("class", "nodes");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 6, height / 2).scale(0.8));

    const dataClone = JSON.parse(JSON.stringify(PLATFORM_HIERARCHY));
    const root = d3.hierarchy<HierarchyNode>(dataClone);
    
    const dependentsCount: Record<string, number> = {};
    const codeMap: Record<string, d3.HierarchyNode<HierarchyNode>> = {};

    root.descendants().forEach(d => {
        if (d.data.code) codeMap[d.data.code] = d;
    });

    root.descendants().forEach(d => {
        if (d.data.dependencies) {
            d.data.dependencies.forEach(depCode => {
                if (dependentsCount[depCode] === undefined) dependentsCount[depCode] = 0;
                dependentsCount[depCode]++;
            });
        }
    });

    root.descendants().forEach((d: any) => {
        d.dependentCount = d.data.code ? (dependentsCount[d.data.code] || 0) : 0;
        d.isCritical = d.dependentCount >= 2; 
    });

    if (!hierarchyRoot) {
      root.descendants().forEach((d, i) => {
        // @ts-ignore
        d.id = i; 
        if (d.depth && d.depth > 1) {
          // @ts-ignore
          d._children = d.children;
          // @ts-ignore
          d.children = null;
        }
      });
      setHierarchyRoot(root);
    } else {
        root.descendants().forEach((d, i) => {
            // @ts-ignore
            d.id = i; 
            if (d.depth && d.depth > 1) {
              // @ts-ignore
              d._children = d.children;
              // @ts-ignore
              d.children = null;
            }
        });
    }

    const update = (source: any) => {
        const duration = 250;
        
        const treeLayout = d3.tree<HierarchyNode>().nodeSize([35, 220]);
        treeLayout(root);

        const nodes = root.descendants().reverse();
        const links = root.links();

        nodes.forEach((d: any) => { d.y = d.depth * 250; });

        const visibleDepLinks: {source: any, target: any}[] = [];
        
        if (showDependencies) {
            const visibleCodeMap: Record<string, any> = {};
            nodes.forEach((d: any) => {
                if (d.data.code) visibleCodeMap[d.data.code] = d;
            });

            nodes.forEach((sourceNode: any) => {
                if (sourceNode.data.dependencies) {
                    sourceNode.data.dependencies.forEach((depCode: string) => {
                        const targetNode = visibleCodeMap[depCode];
                        if (targetNode) {
                            visibleDepLinks.push({ source: sourceNode, target: targetNode });
                        }
                    });
                }
            });
        }

        const depPath = depLinkGroup.selectAll<SVGPathElement, any>('path.dep-link')
            .data(visibleDepLinks);

        depPath.enter().append('path')
            .attr('class', 'dep-link')
            .attr("fill", "none")
            .attr("stroke", "#f59e0b") 
            .attr("stroke-width", "2px")
            .attr("stroke-dasharray", "6,4") // Make dashed for distinct style
            .attr("marker-end", "url(#arrowhead)") // Add arrow marker
            .attr("opacity", 0)
            .attr('d', (d) => {
               const s = { x: d.source.x, y: d.source.y };
               const t = { x: d.target.x, y: d.target.y };
               return `M ${s.y} ${s.x} Q ${(s.y + t.y)/2} ${(s.x + t.x)/2 - 50} ${t.y} ${t.x}`;
            })
            .merge(depPath)
            .transition().duration(duration)
            .attr("opacity", 0.8)
            .attr('d', (d) => {
               const s = { x: d.source.x, y: d.source.y };
               const t = { x: d.target.x, y: d.target.y };
               // Quadratic curve for dependency link
               return `M ${s.y} ${s.x} Q ${(s.y + t.y)/2 - 40} ${(s.x + t.x)/2} ${t.y} ${t.x}`;
            });

        depPath.exit().remove();

        const node = nodeGroup.selectAll<SVGGElement, d3.HierarchyNode<HierarchyNode>>('g.node')
            .data(nodes, (d: any) => d.id || (d.id = ++i));

        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", (d) => `translate(${source.y0 || 0},${source.x0 || 0})`)
            .on('click', click)
            .style('cursor', 'pointer');

        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            .style("fill", (d: any) => d._children ? "#3b82f6" : "#fff")
            .style("stroke", (d: any) => {
                 if (d.isCritical) return "#ef4444"; 
                 return "#3b82f6";
            })
            .style("stroke-width", (d: any) => d.isCritical ? "3px" : "2px");

        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", (d: any) => d.children || d._children ? -13 : 13)
            .attr("text-anchor", (d: any) => d.children || d._children ? "end" : "start")
            .text((d) => d.data.name)
            .style("fill-opacity", 1e-6)
            .style("font-weight", (d) => d.depth === 0 ? "bold" : "normal")
            .style("font-size", (d) => d.depth === 0 ? "16px" : "12px")
            .style("fill", (d: any) => d.isCritical ? "#b91c1c" : "#334155");

        nodeEnter.filter(d => !!d.data.code).append('text')
            .attr("class", "code-label")
            .attr("dy", "1.6em")
            .attr("x", (d: any) => d.children || d._children ? -13 : 13)
            .attr("text-anchor", (d: any) => d.children || d._children ? "end" : "start")
            .text((d) => d.data.code || '')
            .style("font-size", "9px")
            .style("fill", "#94a3b8")
            .style("fill-opacity", 1e-6);

        const badgeGroup = nodeEnter.filter((d: any) => d.dependentCount > 0).append('g')
            .attr("transform", "translate(0, -12)");
            
        badgeGroup.append('rect')
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", 16)
            .attr("height", 16)
            .attr("rx", 8)
            .style("fill", (d: any) => d.isCritical ? "#ef4444" : "#f59e0b");
            
        badgeGroup.append('text')
            .attr("dy", "3px")
            .attr("text-anchor", "middle")
            .text((d: any) => d.dependentCount)
            .style("font-size", "9px")
            .style("font-weight", "bold")
            .style("fill", "white");

        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

        nodeUpdate.select('circle.node')
            .attr('r', (d: any) => d.isCritical ? 8 : 6)
            .style("fill", (d: any) => d._children ? (d.isCritical ? "#ef4444" : "#3b82f6") : "#fff")
            .style("stroke", (d: any) => d.isCritical ? "#ef4444" : "#3b82f6");
            
        nodeUpdate.selectAll('text')
            .style("fill-opacity", 1);

        const nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", (d) => `translate(${source.y},${source.x})`)
            .remove();

        nodeExit.select('circle').attr('r', 1e-6);
        nodeExit.select('text').style("fill-opacity", 1e-6);

        const link = linkGroup.selectAll<SVGPathElement, d3.HierarchyLink<HierarchyNode>>('path.link')
            .data(links, (d: any) => d.target.id);

        const linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "#cbd5e1")
            .attr("stroke-width", "1.5px")
            .attr('d', (d) => {
                const o = { x: source.x0 || 0, y: source.y0 || 0 };
                return diagonal(o, o);
            });

        const linkUpdate = linkEnter.merge(link);

        linkUpdate.transition()
            .duration(duration)
            .attr('d', (d) => diagonal(d.source, d.target));

        link.exit().transition()
            .duration(duration)
            .attr('d', (d) => {
                const o = { x: source.x, y: source.y };
                return diagonal(o, o);
            })
            .remove();

        nodes.forEach((d: any) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        function click(event: any, d: any) {
            setSelectedNode(d);
            // Auto switch tab based on content availability
            if (d.data.dataSchema) {
                setActiveTab('schema');
            } else if (d.data.apiSpecs && d.data.apiSpecs.length > 0) {
                setActiveTab('api');
            } else {
                setActiveTab('info');
            }

            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    };

    let i = 0;
    // @ts-ignore
    root.x0 = height / 2;
    // @ts-ignore
    root.y0 = 0;

    function diagonal(s: any, d: any) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    }

    update(root);

  }, [showDependencies]);

  const hasApi = selectedNode?.data.apiSpecs && selectedNode.data.apiSpecs.length > 0;
  const hasSchema = !!selectedNode?.data.dataSchema;

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Hierarchy Explorer</h2>
           <p className="text-sm text-slate-500">Visualization of Domains, Modules, Services, and Data with dependency tracking.</p>
        </div>
        <div className="flex items-center space-x-3">
            <button 
                onClick={() => setShowDependencies(!showDependencies)}
                className={`flex items-center space-x-2 px-3 py-2 rounded border text-sm font-medium transition-colors ${
                    showDependencies 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
            >
                <GitMerge size={16} />
                <span>{showDependencies ? 'Hide Dependencies' : 'Show Dependencies'}</span>
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600" title="Reset View" onClick={() => window.location.reload()}>
                <RefreshCw size={18} />
            </button>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-inner relative overflow-hidden" ref={containerRef}>
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-lg text-xs space-y-2 shadow-sm pointer-events-none">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Standard Node</span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div>
                <span>Critical (2+ Dependents)</span>
            </div>
            {showDependencies && (
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-0 border-t-2 border-dashed border-amber-500 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 -mt-[3px] border-t-[3px] border-b-[3px] border-l-[4px] border-transparent border-l-amber-500"></div>
                    </div>
                    <span>Dependency Link</span>
                </div>
            )}
        </div>

        {/* Detail Panel Overlay */}
        {selectedNode && (
            <div className="absolute top-4 right-4 w-96 bg-white/95 backdrop-blur border border-slate-200 rounded-lg shadow-xl text-sm z-10 flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            {selectedNode.data.name}
                            {(selectedNode as any).isCritical && <AlertCircle size={16} className="text-red-500" />}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                {selectedNode.data.code || 'N/A'}
                            </span>
                             <span className="text-xs uppercase font-bold text-blue-600">
                                {selectedNode.data.type}
                            </span>
                        </div>
                     </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        Info
                    </button>
                    {hasApi && (
                        <button 
                            onClick={() => setActiveTab('api')}
                            className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'api' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            <span className="flex items-center justify-center gap-1"><Server size={12} /> API</span>
                        </button>
                    )}
                    {hasSchema && (
                         <button 
                            onClick={() => setActiveTab('schema')}
                            className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'schema' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                             <span className="flex items-center justify-center gap-1"><Database size={12} /> Schema</span>
                        </button>
                    )}
                </div>

                <div className="p-4 overflow-y-auto">
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            {selectedNode.data.description && (
                                <div>
                                    <span className="text-xs text-slate-400 font-medium uppercase">Description</span>
                                    <p className="text-slate-700 mt-1">{selectedNode.data.description}</p>
                                </div>
                            )}
                            
                            {(selectedNode as any).dependentCount > 0 && (
                                <div className="bg-amber-50 p-3 rounded border border-amber-100">
                                     <div className="text-xs text-amber-800 font-bold mb-1">Impact Analysis</div>
                                     <div className="text-amber-700">Required by <span className="font-bold">{(selectedNode as any).dependentCount}</span> other modules. Changes here may cascade.</div>
                                </div>
                            )}

                            {selectedNode.data.dependencies && selectedNode.data.dependencies.length > 0 && (
                                 <div>
                                     <span className="text-xs text-slate-400 font-medium uppercase block mb-2">Dependencies</span>
                                     <div className="flex flex-wrap gap-1">
                                        {selectedNode.data.dependencies.map(dep => (
                                            <span key={dep} className="px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200 text-xs font-mono">
                                                {dep}
                                            </span>
                                        ))}
                                     </div>
                                 </div>
                            )}
                            
                            <div>
                                <span className="text-xs text-slate-400 font-medium uppercase">Hierarchy Stats</span>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <div className="bg-slate-50 p-2 rounded">
                                        <div className="text-xs text-slate-500">Depth</div>
                                        <div className="font-mono text-slate-800">{selectedNode.depth}</div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded">
                                        <div className="text-xs text-slate-500">Children</div>
                                        <div className="font-mono text-slate-800">{(selectedNode.children || (selectedNode as any)._children || []).length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'api' && selectedNode.data.apiSpecs && (
                        <div className="space-y-4">
                            {selectedNode.data.apiSpecs.map((spec, idx) => (
                                <div key={idx} className="border border-slate-200 rounded p-3 bg-slate-50/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                                            spec.method === 'GET' ? 'bg-blue-500' : 
                                            spec.method === 'POST' ? 'bg-green-500' : 
                                            spec.method === 'PUT' ? 'bg-orange-500' : 'bg-red-500'
                                        }`}>
                                            {spec.method}
                                        </span>
                                        <span className="font-mono text-xs text-slate-700">{spec.endpoint}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-2">{spec.summary}</p>
                                    {spec.parameters && (
                                        <div className="text-xs text-slate-500">
                                            <span className="font-semibold">Params: </span>
                                            {spec.parameters.map(p => `${p.name} (${p.type})`).join(', ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'schema' && selectedNode.data.dataSchema && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Database size={14} className="text-slate-400" />
                                <span className="font-mono font-bold text-slate-700">{selectedNode.data.dataSchema.tableName}</span>
                            </div>
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="py-2 pl-2 font-medium text-slate-500">Column</th>
                                        <th className="py-2 font-medium text-slate-500">Type</th>
                                        <th className="py-2 font-medium text-slate-500">Constraint</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedNode.data.dataSchema.columns.map((col, idx) => (
                                        <tr key={idx}>
                                            <td className="py-2 pl-2 font-mono text-slate-700">{col.name}</td>
                                            <td className="py-2 text-blue-600">{col.type}</td>
                                            <td className="py-2 text-amber-600 font-mono text-[10px]">{col.constraints?.join(', ')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
