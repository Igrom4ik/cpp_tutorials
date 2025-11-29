
import React, { useState } from 'react';

type Operator = '&' | '|' | '^' | '<<' | '>>';

const BitwiseLesson: React.FC = () => {
  const [valA, setValA] = useState(12); // Default example 00001100
  const [valB, setValB] = useState(5);  // Default example 00000101
  const [op, setOp] = useState<Operator>('&');

  // Convert number to 8-bit array [0, 0, 0, 0, 1, 1, 0, 0]
  const toBits = (num: number) => {
    const bits = [];
    for (let i = 7; i >= 0; i--) {
      bits.push((num >> i) & 1);
    }
    return bits;
  };

  // Toggle specific bit in a number
  const toggleBit = (num: number, bitIndex: number, setter: (n: number) => void) => {
    // bitIndex 0 is MSB (7th pos), so we need shift amount: 7 - index
    const shift = 7 - bitIndex;
    const mask = 1 << shift;
    setter(num ^ mask);
  };

  const getResult = () => {
    switch (op) {
      case '&': return valA & valB;
      case '|': return valA | valB;
      case '^': return valA ^ valB;
      case '<<': return (valA << 1) & 0xFF; // Keep 8 bit visual
      case '>>': return valA >> 1;
      default: return 0;
    }
  };

  const result = getResult();

  return (
    <div className="flex flex-col h-full select-none">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Битовый Калькулятор</h2>
        <p className="text-zinc-400">Нажимайте на биты (0 или 1), чтобы менять числа, и выбирайте операцию.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 flex-1 bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
        
        {/* Row A */}
        <BitRow 
            label="A" 
            value={valA} 
            onChange={(idx) => toggleBit(valA, idx, setValA)} 
            color="text-blue-400" 
            bgColor="bg-blue-500"
        />

        {/* Operator Selector */}
        <div className="flex gap-4 items-center">
            {['&', '|', '^', '<<', '>>'].map((o) => (
                <button
                    key={o}
                    onClick={() => setOp(o as Operator)}
                    className={`w-12 h-12 rounded-lg font-mono text-xl font-bold flex items-center justify-center border transition-all ${
                        op === o 
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)] scale-110' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                    }`}
                >
                    {o === '<<' ? 'L' : o === '>>' ? 'R' : o}
                </button>
            ))}
            <div className="ml-4 text-cyan-400 font-bold text-lg">
                {op === '&' && "AND (И)"}
                {op === '|' && "OR (ИЛИ)"}
                {op === '^' && "XOR (Искл. ИЛИ)"}
                {op === '<<' && "Left Shift (Сдвиг влево на 1)"}
                {op === '>>' && "Right Shift (Сдвиг вправо на 1)"}
            </div>
        </div>

        {/* Row B (Hide for shifts if you want, but strictly bitwise usually takes 2 ops except NOT/Shift. Shifts normally take 1 operand + amount. Let's disable B for shift visual simplicity or treat B as amount? Let's just grey it out for shifts) */}
        <div className={`transition-opacity duration-300 ${['<<', '>>'].includes(op) ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
            <BitRow 
                label="B" 
                value={valB} 
                onChange={(idx) => toggleBit(valB, idx, setValB)} 
                color="text-purple-400" 
                bgColor="bg-purple-500"
            />
        </div>

        {/* Divider */}
        <div className="w-full max-w-2xl h-1 bg-zinc-700 rounded relative">
            <div className="absolute right-0 -top-3 text-zinc-500 font-mono">=</div>
        </div>

        {/* Result */}
        <div className="flex items-center gap-6">
            <div className="w-12 text-right font-bold text-green-400 text-2xl">RES</div>
            <div className="flex gap-2">
                {toBits(result).map((bit, i) => (
                    <div 
                        key={i}
                        className={`w-12 h-16 rounded flex items-center justify-center text-2xl font-mono font-bold border-2 transition-all ${
                            bit 
                            ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                            : 'bg-zinc-800 border-zinc-700 text-zinc-600'
                        }`}
                    >
                        {bit}
                    </div>
                ))}
            </div>
            <div className="w-24 font-mono text-2xl text-green-400 pl-4 border-l border-zinc-700">
                {result}
            </div>
        </div>

      </div>
    </div>
  );
};

const BitRow: React.FC<{ 
    label: string, 
    value: number, 
    onChange: (idx: number) => void,
    color: string,
    bgColor: string
}> = ({ label, value, onChange, color, bgColor }) => {
    
    // Helper to get bits
    const bits = [];
    for (let i = 7; i >= 0; i--) {
      bits.push((value >> i) & 1);
    }

    return (
        <div className="flex items-center gap-6">
            <div className={`w-12 text-right font-bold text-2xl ${color}`}>{label}</div>
            
            <div className="flex gap-2">
                {bits.map((bit, i) => (
                    <button
                        key={i}
                        onClick={() => onChange(i)}
                        className={`w-12 h-16 rounded flex items-center justify-center text-2xl font-mono font-bold border-2 transition-all hover:-translate-y-1 active:translate-y-0 ${
                            bit 
                            ? `${bgColor} border-transparent text-white shadow-lg` 
                            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500'
                        }`}
                    >
                        {bit}
                    </button>
                ))}
            </div>

            <div className={`w-24 font-mono text-2xl pl-4 border-l border-zinc-700 ${color}`}>
                {value}
            </div>
        </div>
    );
};

export default BitwiseLesson;
