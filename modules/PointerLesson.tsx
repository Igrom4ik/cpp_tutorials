import React, { useState, useEffect } from 'react';
import { POINTER_STEPS } from '../constants';
import CodeBlock from '../components/CodeBlock';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const PointerLesson: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = POINTER_STEPS[stepIndex];

  // Helper to construct full code up to current step for context
  // In this simplified view, we just show the code of the current step or all steps cumulatively.
  // Let's show all lines, highlighting the active one.
  const fullCode = POINTER_STEPS.map(s => s.code).join('\n');

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-400">Указатели и Ссылки</h2>
        <div className="text-zinc-400 text-sm">Шаг {stepIndex + 1} / {POINTER_STEPS.length}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Code Panel */}
        <div className="flex flex-col gap-4">
            <div className="bg-code-bg rounded-lg border border-zinc-700 shadow-lg flex-1 overflow-hidden flex flex-col">
                <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700 text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                    Source.cpp
                </div>
                <div className="p-4 font-mono text-sm overflow-auto flex-1">
                    {POINTER_STEPS.map((s, i) => (
                        <div 
                            key={i} 
                            className={`px-2 py-1 rounded transition-colors duration-200 border-l-2 ${
                                i === stepIndex 
                                ? 'bg-blue-900/30 border-blue-500' 
                                : 'border-transparent opacity-60'
                            }`}
                        >
                            <span className="text-zinc-600 mr-3 select-none">{i + 1}</span>
                            <span className={i === stepIndex ? 'text-blue-100 font-medium' : 'text-zinc-400'}>
                                {s.code}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Что происходит:
                </h4>
                <p className="text-zinc-300 leading-relaxed">{currentStep.explanation}</p>
            </div>
        </div>

        {/* Memory Panel */}
        <div className="flex flex-col gap-4">
             <div className="bg-zinc-50 rounded-lg border border-zinc-200 shadow-lg flex-1 flex flex-col overflow-hidden relative">
                <div className="bg-zinc-200 px-4 py-2 border-b border-zinc-300 text-xs text-zinc-600 uppercase tracking-wider font-bold flex justify-between">
                    <span>Stack Memory (RAM)</span>
                    <span>Address Range: 0x7FF0 - ...</span>
                </div>
                
                <div className="p-6 flex-1 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] overflow-y-auto">
                    <div className="flex flex-col-reverse gap-4 items-center">
                        {/* Render blocks in reverse so stack grows up visually, or normal list. Let's do normal list downwards. */}
                        {currentStep.memory.length === 0 && (
                            <div className="text-zinc-400 italic mt-10">Память свободна...</div>
                        )}
                        
                        {currentStep.memory.map((block, idx) => (
                            <div 
                                key={block.address}
                                className={`relative w-full max-w-md p-4 rounded border-2 transition-all duration-500 ${
                                    block.isHighlight 
                                    ? 'border-red-500 bg-red-50 scale-105 shadow-xl z-10' 
                                    : 'border-zinc-400 bg-white shadow-sm'
                                }`}
                            >
                                {/* Address Tag */}
                                <div className="absolute -top-3 right-4 bg-zinc-200 text-zinc-600 text-xs px-2 py-0.5 rounded font-mono border border-zinc-300">
                                    {block.address}
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* Variables pointing here */}
                                    <div className="flex flex-col gap-1">
                                        {block.vars.map(v => (
                                            <div key={v} className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded font-bold text-white shadow-sm ${
                                                    v === 'ptr' ? 'bg-purple-500' :
                                                    v === 'ref' ? 'bg-green-600' : 'bg-blue-500'
                                                }`}>
                                                    {v}
                                                </span>
                                                {/* Arrow for pointer visual check */}
                                                {v === 'ptr' && (
                                                   <span className="text-xs text-zinc-400">⟶ {block.value}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Value */}
                                    <div className={`font-mono text-xl font-bold ${
                                        typeof block.value === 'string' && block.value.startsWith('0x') 
                                        ? 'text-purple-600' // Pointer value
                                        : 'text-zinc-800'   // Int value
                                    }`}>
                                        {block.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-auto pt-4 border-t border-zinc-800">
        <button 
            onClick={() => setStepIndex(0)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
        >
            <RotateCcw size={18} /> Сброс
        </button>
        <button 
            onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
            disabled={stepIndex === 0}
            className="flex items-center gap-2 px-6 py-2 rounded bg-blue-900 hover:bg-blue-800 text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            <ArrowLeft size={18} /> Назад
        </button>
        <button 
            onClick={() => setStepIndex(Math.min(POINTER_STEPS.length - 1, stepIndex + 1))}
            disabled={stepIndex === POINTER_STEPS.length - 1}
            className="flex items-center gap-2 px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-900/20"
        >
            {stepIndex === POINTER_STEPS.length - 1 ? 'Готово' : 'Далее'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PointerLesson;
