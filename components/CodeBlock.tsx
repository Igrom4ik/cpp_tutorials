import React from 'react';

interface CodeBlockProps {
  code: string;
  activeLine?: number; // 0-based index relative to the snippet provided if needed, but here we treat 'code' as full block
  highlightLineText?: string; // Or highlight by matching text content of the active step
}

const CodeBlock: React.FC<{ code: string; currentLineId?: number }> = ({ code, currentLineId }) => {
  // Simple syntax highlighting based on regex splitting
  const lines = code.split('\n');

  const colorize = (text: string) => {
    // Very basic tokenizer for C++ visuals
    const parts = text.split(/(\/\/.*|\bint\b|\bvoid\b|\bclass\b|\breturn\b|\bif\b|\belse\b|\bnew\b|\bstruct\b|\d+|".*?"|'.*?'|[{}();=*,&.\[\]]|->)/g);
    
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('//')) return <span key={i} className="text-code-comment italic">{part}</span>;
      if (['int', 'void', 'class', 'struct', 'bool', 'char', 'float'].includes(part)) return <span key={i} className="text-code-type font-bold">{part}</span>;
      if (['return', 'if', 'else', 'new', 'this'].includes(part)) return <span key={i} className="text-code-keyword font-bold">{part}</span>;
      if (/^\d+$/.test(part)) return <span key={i} className="text-code-num">{part}</span>;
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(part)) return <span key={i} className="text-code-var">{part}</span>; // Generic var
      return <span key={i} className="text-gray-300">{part}</span>;
    });
  };

  return (
    <div className="bg-code-bg p-4 rounded-lg font-mono text-sm overflow-x-auto border border-zinc-700 shadow-xl">
      {lines.map((line, index) => {
        // We match lines crudely. In a real app, we'd pass exact line index.
        // Here, the constants use 1-liner snippets mostly, or full blocks.
        // Let's assume the passed `code` matches the lines we want to show.
        const isActive = index === -1; // Disabled generic highlighting for now to focus on content
        
        return (
          <div key={index} className={`${isActive ? 'bg-zinc-700/50' : ''} whitespace-pre py-0.5`}>
            <span className="text-zinc-600 select-none mr-4 w-6 inline-block text-right">{index + 1}</span>
            {colorize(line)}
          </div>
        );
      })}
    </div>
  );
};

export default CodeBlock;
