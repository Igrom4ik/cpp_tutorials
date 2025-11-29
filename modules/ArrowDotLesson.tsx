
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ARROW_DOT_TASKS } from '../constants';
import { NodeData, Connection, NodePin } from '../types';
import { Play, Trash2, ArrowRight } from 'lucide-react';

// --- Layout Constants for accurate wire drawing ---
const NODE_WIDTH = 192; // w-48 = 12rem = 192px
const HEADER_HEIGHT = 32; // h-8 roughly
const CONTENT_OFFSET_Y = 100; // Approximate Y where pins start (Header + Padding + ContentBox)
const PIN_HEIGHT = 24; // h-6
const PIN_GAP = 16; // gap-4 = 1rem = 16px

const ArrowDotLesson: React.FC = () => {
  const [taskIndex, setTaskIndex] = useState(0);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [consoleMsg, setConsoleMsg] = useState<string>('');
  
  // Interaction State
  const [dragNode, setDragNode] = useState<{id: string, offsetX: number, offsetY: number} | null>(null);
  const [dragWire, setDragWire] = useState<{nodeId: string, pinId: string, startX: number, startY: number} | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number}>({x: 0, y: 0});
  
  const currentTask = ARROW_DOT_TASKS[taskIndex];
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Level
  useEffect(() => {
    // Deep copy nodes to local state so we can move them
    setNodes(JSON.parse(JSON.stringify(currentTask.nodes)));
    setConnections([]);
    setStatus('IDLE');
    setConsoleMsg(`Task ${taskIndex + 1}: ${currentTask.context}`);
  }, [taskIndex, currentTask]);

  // --- Helper: Calculate Pin Absolute Position ---
  const getPinPos = (node: NodeData, pinId: string, isInput: boolean) => {
    const pinIndex = isInput 
      ? node.inputs.findIndex(p => p.id === pinId)
      : node.outputs.findIndex(p => p.id === pinId);
    
    if (pinIndex === -1) return { x: node.x, y: node.y };

    // X Calculation: Inputs on left edge (0), Outputs on right edge (Width)
    // We add a small visual offset so the line starts "inside" the pin circle
    const x = isInput ? node.x : node.x + NODE_WIDTH; 

    // Y Calculation
    const y = node.y + CONTENT_OFFSET_Y + (pinIndex * (PIN_HEIGHT + PIN_GAP)) + (PIN_HEIGHT / 2);

    return { x, y };
  };

  // --- Event Handlers ---

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });

    if (dragNode) {
      setNodes(prev => prev.map(n => 
        n.id === dragNode.id 
          ? { ...n, x: x - dragNode.offsetX, y: y - dragNode.offsetY }
          : n
      ));
    }
  };

  const handleBgMouseUp = () => {
    setDragNode(null);
    setDragWire(null);
  };

  // Node Dragging
  const onNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragNode({
      id: nodeId,
      offsetX: mouseX - node.x,
      offsetY: mouseY - node.y
    });
  };

  // Pin Wiring
  const onPinMouseDown = (e: React.MouseEvent, nodeId: string, pinId: string, isInput: boolean) => {
    e.stopPropagation();
    // Only drag from outputs in this simple model, or inputs if re-wiring
    // For simplicity: Start dragging from ANY pin, but logic handles connection validity
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const { x, y } = getPinPos(node, pinId, isInput);
    
    setDragWire({
      nodeId,
      pinId,
      startX: x,
      startY: y
    });
  };

  const onPinMouseUp = (e: React.MouseEvent, targetNodeId: string, targetPinId: string, isInput: boolean) => {
    e.stopPropagation();
    if (!dragWire) return;

    // Validation:
    // 1. Cannot connect node to itself
    if (dragWire.nodeId === targetNodeId) return;

    // 2. Must connect Output -> Input (or vice versa if we allowed reverse dragging)
    // Let's assume start is Output and end is Input for now, or check types.
    // The current constant data structure doesn't strictly define types for checking "Exec" vs "Object" easily here 
    // without looking up the pin definition, but we can do a simple check:
    
    // Find source and target pin definitions
    const startNode = nodes.find(n => n.id === dragWire.nodeId);
    const endNode = nodes.find(n => n.id === targetNodeId);
    if (!startNode || !endNode) return;

    const startPinIsInput = startNode.inputs.some(p => p.id === dragWire.pinId);
    const endPinIsInput = isInput;

    // Prevent Input->Input or Output->Output
    if (startPinIsInput === endPinIsInput) return;

    // Determine which is source (Output) and which is target (Input)
    let sourceNode = startNode.id;
    let sourcePin = dragWire.pinId;
    let targetNode = targetNodeId;
    let targetPin = targetPinId;

    if (startPinIsInput) {
       // Dragged from Input to Output (Reverse connection)
       sourceNode = targetNodeId;
       sourcePin = targetPinId;
       targetNode = startNode.id;
       targetPin = dragWire.pinId;
    }

    // Create Connection
    const newConn: Connection = {
      id: `${sourceNode}:${sourcePin}-${targetNode}:${targetPin}`,
      fromNode: sourceNode,
      fromPin: sourcePin,
      toNode: targetNode,
      toPin: targetPin
    };

    // Remove existing connections to the target Input (Single input rule)
    const filtered = connections.filter(c => !(c.toNode === targetNode && c.toPin === targetPin));

    setConnections([...filtered, newConn]);
    setDragWire(null);
    setStatus('IDLE');
  };

  // --- Logic ---

  const clearConnections = () => {
    setConnections([]);
    setStatus('IDLE');
    setConsoleMsg('Connections cleared.');
  };

  const runCode = () => {
    // 1. Find Variable Node
    const varNode = nodes.find(n => n.type === 'VARIABLE');
    if (!varNode) return;

    // 2. Trace Var -> Operator
    const conn1 = connections.find(c => c.fromNode === varNode.id);
    if (!conn1) {
        setStatus('ERROR');
        setConsoleMsg("Error: Variable is disconnected.");
        return;
    }
    const opNode = nodes.find(n => n.id === conn1.toNode);

    // 3. Trace Operator -> Member
    const conn2 = connections.find(c => c.fromNode === opNode?.id);
    if (!conn2) {
        setStatus('ERROR');
        setConsoleMsg("Error: Operator result unused.");
        return;
    }
    const memNode = nodes.find(n => n.id === conn2.toNode);

    // 4. Validate Path
    const path = [varNode.id, opNode?.id, memNode?.id].filter(Boolean);
    const expected = currentTask.correctPath;

    // Check strict equality of IDs
    const isPathCorrect = path.length === expected.length && path.every((val, i) => val === expected[i]);

    if (isPathCorrect) {
        setStatus('SUCCESS');
        setConsoleMsg("Compilation Successful!\n> Executing... OK.\n> Access granted.");
    } else {
        setStatus('ERROR');
        if (opNode?.content === '->' && varNode.content?.includes('p1')) {
             setConsoleMsg(`error: member reference base type 'Player' is not a pointer`);
        } else if (opNode?.content === '.' && varNode.content?.includes('*')) {
             setConsoleMsg(`error: member reference base type 'Player *' is a pointer`);
        } else {
             setConsoleMsg("Error: Invalid node configuration.");
        }
    }
  };

  const nextTask = () => {
      if (taskIndex < ARROW_DOT_TASKS.length - 1) {
          setTaskIndex(prev => prev + 1);
      } else {
          setConsoleMsg("All modules completed!");
      }
  };

  return (
    <div className="flex flex-col h-full select-none" onMouseUp={handleBgMouseUp}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2 shrink-0">
            <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                    Visual Blueprint Editor
                </h2>
                <p className="text-zinc-400 text-sm">Level {taskIndex + 1}: Connect the nodes to compile valid C++ code.</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={clearConnections}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md border border-zinc-700 text-zinc-300 transition"
                >
                    <Trash2 size={16} /> Clear
                </button>
                <button 
                    onClick={runCode}
                    className="flex items-center gap-2 px-6 py-2 bg-green-700 hover:bg-green-600 rounded-md text-white font-bold transition shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                >
                    <Play size={16} fill="currentColor" /> Compile & Run
                </button>
            </div>
        </div>

        {/* Blueprint Canvas */}
        <div className="flex-1 relative bg-[#111111] rounded-xl border border-zinc-800 shadow-inner overflow-hidden flex flex-col">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
            </div>

            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className="flex-1 relative cursor-crosshair overflow-hidden"
                onMouseMove={handleMouseMove}
            >
                {/* SVG Layer for Wires */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                     {/* Existing Connections */}
                     {connections.map(conn => {
                         const startNode = nodes.find(n => n.id === conn.fromNode);
                         const endNode = nodes.find(n => n.id === conn.toNode);
                         if(!startNode || !endNode) return null;

                         const startPos = getPinPos(startNode, conn.fromPin, false); // From Output
                         const endPos = getPinPos(endNode, conn.toPin, true);     // To Input

                         // Bezier Curve
                         const dist = Math.abs(endPos.x - startPos.x) * 0.5;
                         const cp1x = startPos.x + dist; // Control Point 1
                         const cp2x = endPos.x - dist;   // Control Point 2

                         return (
                            <path 
                                key={conn.id}
                                d={`M ${startPos.x} ${startPos.y} C ${cp1x} ${startPos.y}, ${cp2x} ${endPos.y}, ${endPos.x} ${endPos.y}`}
                                stroke={status === 'SUCCESS' ? '#4ade80' : status === 'ERROR' ? '#ef4444' : '#fff'} 
                                strokeWidth="3" 
                                fill="none"
                                className={status === 'SUCCESS' ? 'animate-pulse' : ''}
                            />
                         );
                     })}

                     {/* Dragging Wire */}
                     {dragWire && (
                         <path 
                            d={`M ${dragWire.startX} ${dragWire.startY} C ${dragWire.startX + 100} ${dragWire.startY}, ${mousePos.x - 100} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                            stroke="#3b82f6" 
                            strokeWidth="3" 
                            strokeDasharray="5,5"
                            fill="none"
                         />
                     )}
                </svg>

                {/* Nodes */}
                {nodes.map(node => (
                    <NodeComponent 
                        key={node.id} 
                        data={node} 
                        onNodeMouseDown={onNodeMouseDown}
                        onPinMouseDown={onPinMouseDown}
                        onPinMouseUp={onPinMouseUp}
                    />
                ))}
            </div>

            {/* Console / Output Panel */}
            <div className={`h-32 border-t border-zinc-800 font-mono text-sm p-4 transition-colors duration-300 overflow-y-auto shrink-0 z-20 ${
                status === 'ERROR' ? 'bg-red-900/10' : status === 'SUCCESS' ? 'bg-green-900/10' : 'bg-[#0a0a0a]'
            }`}>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="text-zinc-500 uppercase text-xs tracking-wider mb-2 font-bold">Output Log</div>
                        {consoleMsg.split('\n').map((line, i) => (
                            <div key={i} className={`${
                                line.toLowerCase().includes('error') ? 'text-red-400' : 
                                line.includes('Success') ? 'text-green-400' : 'text-zinc-300'
                            }`}>
                                {line}
                            </div>
                        ))}
                    </div>
                    {status === 'SUCCESS' && (
                        <button 
                            onClick={nextTask}
                            className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded font-bold hover:bg-white transition flex items-center gap-2 animate-bounce"
                        >
                            Next Level <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

// --- Subcomponent: Node ---
const NodeComponent: React.FC<{
    data: NodeData,
    onNodeMouseDown: (e: React.MouseEvent, nodeId: string) => void,
    onPinMouseDown: (e: React.MouseEvent, nodeId: string, pinId: string, isInput: boolean) => void,
    onPinMouseUp: (e: React.MouseEvent, nodeId: string, pinId: string, isInput: boolean) => void
}> = ({ data, onNodeMouseDown, onPinMouseDown, onPinMouseUp }) => {
    
    return (
        <div 
            className="absolute rounded-lg shadow-2xl overflow-hidden border border-zinc-700 bg-[#1e1e1e] group"
            style={{ 
                left: data.x, 
                top: data.y,
                width: NODE_WIDTH
            }}
        >
            {/* Header (Draggable) */}
            <div 
                className="px-3 py-1 font-bold text-sm text-white/90 uppercase tracking-wide border-b border-white/10 cursor-grab active:cursor-grabbing hover:brightness-110 transition-all"
                style={{ 
                    background: `linear-gradient(90deg, ${data.color}AA, ${data.color}44)`,
                    height: HEADER_HEIGHT
                }}
                onMouseDown={(e) => onNodeMouseDown(e, data.id)}
            >
                {data.title}
            </div>

            {/* Body */}
            <div className="p-3 relative">
                {/* Content Box */}
                <div className="text-center font-mono text-lg font-bold text-zinc-200 mb-4 bg-black/30 rounded py-2 border border-white/5 truncate px-1">
                    {data.content}
                </div>

                <div className="flex justify-between items-start">
                    {/* Inputs */}
                    <div className="flex flex-col gap-4">
                        {data.inputs.map(pin => (
                            <div key={pin.id} className="flex items-center gap-2 relative h-6">
                                {/* Pin Point */}
                                <div 
                                    className="w-4 h-4 rounded-full border-2 border-zinc-500 bg-[#111] hover:bg-white hover:border-white transition cursor-pointer -ml-5 z-10"
                                    onMouseUp={(e) => onPinMouseUp(e, data.id, pin.id, true)}
                                >
                                    {pin.type === 'POINTER' && <div className="w-2 h-2 bg-blue-500 rounded-full m-0.5" />}
                                    {pin.type === 'OBJECT' && <div className="w-2 h-2 bg-emerald-500 rounded-full m-0.5" />}
                                </div>
                                <span className="text-xs text-zinc-400">{pin.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Outputs */}
                    <div className="flex flex-col gap-4 items-end">
                        {data.outputs.map(pin => (
                            <div key={pin.id} className="flex items-center gap-2 relative h-6">
                                <span className="text-xs text-zinc-400">{pin.label}</span>
                                {/* Pin Point */}
                                <div 
                                    className="w-4 h-4 rounded-full border-2 border-zinc-500 bg-[#111] hover:bg-white hover:border-white transition cursor-pointer -mr-5 z-10"
                                    onMouseDown={(e) => onPinMouseDown(e, data.id, pin.id, false)}
                                >
                                     {pin.type === 'POINTER' && <div className="w-2 h-2 bg-blue-500 rounded-full m-0.5" />}
                                     {pin.type === 'OBJECT' && <div className="w-2 h-2 bg-emerald-500 rounded-full m-0.5" />}
                                     {pin.type === 'MEMBER' && <div className="w-2 h-2 bg-purple-500 rounded-full m-0.5" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArrowDotLesson;
