
import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data';
import { Search, Tag } from 'lucide-react';

export const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(GLOSSARY_TERMS.map(t => t.category)))];

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Glossary of Terms</h2>
           <p className="text-sm text-slate-500">Definitions for healthcare, technical, and platform-specific terminology.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search terms..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((term, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{term.term}</h3>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {term.category}
                    </span>
                </div>
                {term.hierarchy && (
                    <div className="text-xs text-blue-600 font-medium mb-2 flex items-center gap-1">
                        <Tag size={12} /> {term.hierarchy}
                    </div>
                )}
                <p className="text-sm text-slate-600 leading-relaxed">{term.definition}</p>
                {term.related && (
                    <div className="mt-4 pt-3 border-t border-slate-50">
                        <span className="text-xs text-slate-400 mr-2">Related:</span>
                        {term.related.map(r => (
                            <span key={r} className="text-xs text-blue-500 mr-2 cursor-pointer hover:underline">{r}</span>
                        ))}
                    </div>
                )}
            </div>
        ))}
      </div>
      
      {filteredTerms.length === 0 && (
          <div className="text-center py-12 text-slate-400">
              No terms found matching your criteria.
          </div>
      )}
    </div>
  );
};
