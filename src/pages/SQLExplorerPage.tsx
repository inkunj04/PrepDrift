import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Database, Table, ArrowLeft, Lightbulb, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { savedQueries, executeQuery } from '@/lib/sqlEngine';
import type { SavedQuery, QueryResult } from '@/types/analytics';
import { cn } from '@/lib/utils';

export function SQLExplorerPage() {
  const [activeQuery, setActiveQuery] = useState<SavedQuery>(savedQueries[0]);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    // Simulate slight network delay for realism
    setTimeout(() => {
      const res = executeQuery(activeQuery.id);
      setResult(res);
      setIsExecuting(false);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] flex flex-col pt-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-shrink-0">
        <Link 
          to="/insights"
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-subtle transition-colors border border-surface-border bg-white shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary tracking-tight leading-none mb-1">SQL Explorer</h1>
          <p className="text-body-sm text-text-secondary">Query the synthetic behavioral dataset</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 pb-6">
        {/* Left Sidebar: Query List */}
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-surface-border bg-surface-subtle">
            <h3 className="text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest">Saved Queries</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 lg:max-h-none max-h-48">
            {savedQueries.map(q => (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuery(q);
                  setResult(null);
                }}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg text-body-sm transition-all duration-200 border',
                  activeQuery.id === q.id 
                    ? 'bg-accent/5 border-accent text-accent font-bold shadow-sm' 
                    : 'border-transparent text-text-secondary hover:bg-surface-subtle hover:text-text-primary font-medium hover:border-surface-border'
                )}
              >
                {q.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden">
          
          {/* Editor Area */}
          <div className="min-h-[250px] lg:min-h-0 lg:h-1/2 flex flex-col border-b border-surface-border">
            <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface-subtle">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-white border border-surface-border">
                  <Database size={14} className="text-text-secondary" />
                </div>
                <span className="text-body-sm font-bold text-text-primary">query.sql</span>
              </div>
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-lg text-body-sm font-bold transition-all shadow-sm border",
                  isExecuting 
                    ? "bg-surface-subtle text-text-tertiary border-surface-border cursor-not-allowed" 
                    : "bg-text-primary text-white border-transparent hover:bg-black"
                )}
              >
                <Play size={16} className={isExecuting ? "animate-pulse" : ""} />
                {isExecuting ? 'Running...' : 'Run Query'}
              </button>
            </div>
            
            <div className="flex-1 relative bg-[#1E1E1E]">
              <textarea
                value={activeQuery.sql}
                readOnly
                className="absolute inset-0 w-full h-full resize-none bg-transparent p-6 text-[0.9375rem] font-mono text-[#D4D4D4] focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="min-h-[300px] lg:min-h-0 lg:h-1/2 flex flex-col">
            <div className="flex items-center gap-8 px-6 pt-4 border-b border-surface-border bg-white">
              <button className="flex items-center gap-2 text-body-sm font-bold text-accent border-b-2 border-accent pb-3">
                <Table size={16} />
                Results
              </button>
              <button className="flex items-center gap-2 text-body-sm font-bold text-text-tertiary hover:text-text-primary pb-3 transition-colors border-b-2 border-transparent hover:border-surface-border-strong">
                <Lightbulb size={16} />
                PM Explanation
              </button>
              
              {result && (
                <div className="ml-auto flex items-center gap-4 text-[0.6875rem] font-bold uppercase tracking-widest text-text-tertiary pb-3">
                  <span className="bg-surface-subtle px-2.5 py-1 rounded border border-surface-border">{result.rowCount} rows</span>
                  <span className="flex items-center gap-1.5 bg-surface-subtle px-2.5 py-1 rounded border border-surface-border"><Clock size={12} /> {result.executionMs}ms</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-auto bg-white p-6">
              <AnimatePresence mode="wait">
                {isExecuting ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center gap-3 text-text-tertiary"
                  >
                     <Database className="animate-pulse" size={24} />
                    <span className="text-[0.6875rem] font-bold uppercase tracking-widest">Executing query...</span>
                  </motion.div>
                ) : result ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full"
                  >
                    {/* Data Table */}
                    <table className="w-full text-left border-collapse mb-8 border border-surface-border rounded-lg overflow-hidden">
                      <thead className="bg-surface-subtle border-b border-surface-border">
                        <tr>
                          {result.columns.map((col: string, i: number) => (
                            <th key={i} className="px-5 py-3 text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row: React.ReactNode[], ri: number) => (
                          <tr key={ri} className="hover:bg-surface-subtle/50 transition-colors border-b border-surface-border last:border-0">
                            {row.map((cell: React.ReactNode, ci: number) => (
                              <td key={ci} className="px-5 py-3 text-body-sm font-medium text-text-primary whitespace-nowrap">
                                {typeof cell === 'boolean' ? (
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[0.625rem] font-bold uppercase tracking-widest",
                                        cell ? "bg-status-healthy/10 text-status-healthy" : "bg-status-critical/10 text-status-critical"
                                    )}>
                                        {cell ? 'TRUE' : 'FALSE'}
                                    </span>
                                ) : cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* PM Explanation */}
                    <div className="bg-white border border-surface-border p-6 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="p-1.5 rounded-full bg-accent/10">
                            <Lightbulb size={16} className="text-accent" />
                        </div>
                        <h4 className="text-body font-bold text-text-primary">PM Interpretation</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-body-sm">
                        <div>
                          <span className="block text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-1">What this measures</span>
                          <span className="text-text-secondary leading-relaxed font-medium">{activeQuery.explanation.measures}</span>
                        </div>
                        <div>
                          <span className="block text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-1">Why it matters</span>
                          <span className="text-text-secondary leading-relaxed font-medium">{activeQuery.explanation.matters}</span>
                        </div>
                        <div>
                          <span className="block text-[0.6875rem] font-bold text-text-tertiary uppercase tracking-widest mb-1">Limitation</span>
                          <span className="text-text-secondary leading-relaxed font-medium">{activeQuery.explanation.limitation}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center text-text-tertiary text-body-sm font-medium"
                  >
                    Click "Run Query" to execute the SQL statement.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
