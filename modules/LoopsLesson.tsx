
import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Layers } from 'lucide-react';
import { LOOP_SCENARIOS } from '../constants';
import { FlowNode } from '../types';

const LoopsLesson: React.FC = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(0);

  const scenario = LOOP_SCENARIOS[scenarioIndex];
  const currentStep = scenario.steps[step];
  const currentNode = scenario.nodes.find(n => n.id === currentStep.nodeId);

  const reset = () => setStep(0);
  const next = () => setStep(Math.min(scenario.steps.length - 1, step + 1));
  const prev = () => setStep(Math.max(0, step - 1));

  // Switch scenario handler
  const selectScenario = (idx: number) => {
    setScenarioIndex(idx);
    setStep(0);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Bar: Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-zinc-800">
        {LOOP_SCENARIOS.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => selectScenario(idx)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              idx === scenarioIndex
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* Left Column: Code & Variables */}
        <div className="lg:w-1/3 flex flex-col gap-4 min-w-[300px]">
           {/* Code Panel */}
           <div className="bg-[#1e1e1e] rounded-xl border border-zinc-700 shadow-xl overflow-hidden flex flex-col shrink-0">
              <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 font-bold uppercase flex items-center gap-2">
                 <Layers size={14} /> Source Code
              </div>
              <div className="p-4 font-mono text-sm overflow-auto">
                 {scenario.code.map((line, idx) => (
                    <div 
                        key={idx}
                        className={`px-2 py-1 rounded transition-colors duration-200 flex ${
                            currentStep.lineIndex === idx 
                            ? 'bg-orange-900/40 text-orange-200 border-l-2 border-orange-500' 
                            : 'text-zinc-500 border-l-2 border-transparent'
                        }`}
                    >
                        <span className="w-6 text-right mr-3 opacity-30 select-none">{idx + 1}</span>
                        <span className="whitespace-pre">{line}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Variable Watch */}
           <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
              <div className="text-zinc-500 text-xs font-bold uppercase mb-3">Variables</div>
              <div className="flex gap-4 flex-wrap">
                  {Object.entries(currentStep.variables).map(([key, val]) => (
                      <div key={key} className="bg-zinc-900 border border-zinc-600 rounded px-4 py-2 min-w-[80px] text-center">
                          <div className="text-xs text-zinc-400 mb-1">{key}</div>
                          <div className="text-xl font-mono font-bold text-orange-400">{val}</div>
                      </div>
                  ))}
              </div>
           </div>

           {/* Explanation */}
           <div className="bg-orange-900/10 border border-orange-500/20 rounded-xl p-4 flex-1">
              <div className="flex items-center gap-2 text-orange-400 font-bold mb-2">
                 <Play size={16} fill="currentColor"/> Status
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm">
                  {currentStep.explanation}
              </p>
           </div>
        </div>

        {/* Right Column: Flowchart Visualizer */}
        <div className="flex-1 bg-[#111] rounded-xl border border-zinc-800 relative overflow-hidden shadow-inner flex flex-col">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>
            
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                <Flowchart nodes={scenario.nodes} activeNodeId={currentStep.nodeId} />
            </div>

            {/* Controls Bar */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur flex justify-center gap-4 shrink-0 z-10">
                <button onClick={reset} className="p-2 hover:bg-zinc-700 rounded text-zinc-400"><RotateCcw size={20}/></button>
                <button onClick={prev} disabled={step === 0} className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-white disabled:opacity-50"><ArrowLeft size={20}/></button>
                <button onClick={next} disabled={step === scenario.steps.length - 1} className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded text-white disabled:opacity-50 font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)]"><ArrowRight size={20}/></button>
            </div>
        </div>

      </div>
    </div>
  );
};

// --- SVG Flowchart Component ---

const Flowchart: React.FC<{ nodes: FlowNode[], activeNodeId: string }> = ({ nodes, activeNodeId }) => {
    
    // Calculate SVG dimensions
    const maxX = Math.max(...nodes.map(n => n.x)) + 150;
    const maxY = Math.max(...nodes.map(n => n.y)) + 100;
    const minX = Math.min(...nodes.map(n => n.x));
    const width = Math.max(600, maxX);
    const height = Math.max(500, maxY);

    // Render Connections
    const renderConnection = (from: FlowNode, toId: string, label?: string) => {
        const to = nodes.find(n => n.id === toId);
        if (!to) return null;

        // Simple straight lines or elbows? Let's try direct for now, or simple logic
        // If looping back (y > target.y), curve around.
        
        let pathD = '';
        const startX = from.x + 60; // Center of node (assuming 120 width)
        const startY = from.y + (from.type === 'CONDITION' ? 60 : 40); // Bottom of node
        const endX = to.x + 60;
        const endY = to.y;

        const isLoopBack = startY > endY + 20;

        if (isLoopBack) {
             // Loop back path (right side)
             pathD = `M ${from.x + 120} ${from.y + 20} H ${maxX - 20} V ${endY + 20} H ${to.x + 120}`;
        } else {
             // Standard Downward
             if (from.type === 'CONDITION' && label === 'False') {
                 // Side exit
                 pathD = `M ${from.x + 120} ${from.y + 30} H ${endX} V ${endY}`;
             } else if (from.type === 'CONDITION' && label === 'True') {
                 // Bottom exit
                 pathD = `M ${startX} ${from.y + 60} L ${endX} ${endY}`;
             } else {
                 pathD = `M ${startX} ${from.y + 40} L ${endX} ${endY}`;
             }
        }

        return (
            <g key={`${from.id}-${toId}`}>
                <path d={pathD} stroke="#555" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                {label && (
                    <text x={(startX + endX)/2 + 10} y={(startY + endY)/2} fill="#888" fontSize="10" fontFamily="monospace">
                        {label}
                    </text>
                )}
            </g>
        );
    };

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
                </marker>
            </defs>

            {/* Connections */}
            {nodes.map(node => (
                <React.Fragment key={node.id}>
                    {node.next && renderConnection(node, node.next)}
                    {node.nextTrue && renderConnection(node, node.nextTrue, 'True')}
                    {node.nextFalse && renderConnection(node, node.nextFalse, 'False')}
                </React.Fragment>
            ))}

            {/* Nodes */}
            {nodes.map(node => {
                const isActive = node.id === activeNodeId;
                const baseClass = `transition-all duration-300 ${isActive ? 'stroke-orange-500 stroke-2 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'stroke-zinc-600'}`;
                const fillClass = isActive ? 'fill-zinc-800' : 'fill-zinc-900';
                
                return (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                        {node.type === 'CONDITION' ? (
                            // Diamond
                            <polygon 
                                points="60,0 120,30 60,60 0,30" 
                                className={`${baseClass} ${fillClass}`}
                            />
                        ) : node.type === 'START' || node.type === 'END' ? (
                            // Rounded Pill
                            <rect 
                                x="0" y="0" width="120" height="40" rx="20"
                                className={`${baseClass} ${fillClass}`}
                            />
                        ) : (
                            // Rectangle
                            <rect 
                                x="0" y="0" width="120" height="40" rx="4"
                                className={`${baseClass} ${fillClass}`}
                            />
                        )}

                        <text 
                            x="60" y={node.type === 'CONDITION' ? 34 : 24} 
                            textAnchor="middle" 
                            className={`text-xs font-mono select-none pointer-events-none ${isActive ? 'fill-orange-400 font-bold' : 'fill-zinc-400'}`}
                        >
                            {node.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default LoopsLesson;
