
export enum ModuleType {
  HOME = 'HOME',
  POINTERS = 'POINTERS',
  ARROW_DOT = 'ARROW_DOT',
  LOOPS = 'LOOPS',
  BITWISE = 'BITWISE',
  QUIZ = 'QUIZ'
}

export interface MemoryBlockData {
  address: string;
  value: string | number;
  vars: string[]; // Variable names pointing/referencing here
  isHighlight?: boolean;
}

export interface TutorialStep {
  lineId: number;
  code: string;
  explanation: string;
  memory: MemoryBlockData[];
}

export type DiagramType = 'DIRECT' | 'POINTER' | 'DEREF' | 'ARRAY' | 'THIS';

// --- Node Graph Types ---

export type PinType = 'EXEC' | 'OBJECT' | 'POINTER' | 'MEMBER';

export interface NodePin {
  id: string;
  label: string;
  type: PinType;
}

export interface NodeData {
  id: string;
  title: string;
  type: 'VARIABLE' | 'OPERATOR' | 'MEMBER' | 'RESULT';
  x: number;
  y: number;
  inputs: NodePin[];
  outputs: NodePin[];
  color: string; // Header color (UE5 style)
  content?: string; // e.g. "Player p1" or "."
}

export interface Connection {
  id: string;
  fromNode: string;
  fromPin: string;
  toNode: string;
  toPin: string;
}

export interface ArrowTask {
  id: number;
  context: string;
  nodes: NodeData[]; // The initial layout of nodes
  correctPath: string[]; // List of Node IDs that must be connected in order. e.g. ['node-var', 'node-arrow', 'node-member']
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// --- Loop Types ---

export type FlowNodeType = 'START' | 'ACTION' | 'CONDITION' | 'END';

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  label: string;
  x: number;
  y: number;
  next?: string;       // ID of next node
  nextTrue?: string;   // ID if condition true
  nextFalse?: string;  // ID if condition false
}

export interface LoopStep {
  nodeId: string;      // Active node in flowchart
  lineIndex: number;   // Active line in code
  variables: Record<string, string | number>;
  explanation: string;
}

export interface LoopScenario {
  id: string;
  title: string;
  code: string[];
  nodes: FlowNode[];
  steps: LoopStep[];
}
