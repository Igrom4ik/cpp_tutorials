
import { ArrowTask, QuizQuestion, TutorialStep, LoopScenario } from './types';

// --- Pointer Lesson Data ---
export const POINTER_STEPS: TutorialStep[] = [
  {
    lineId: 0,
    code: `// Начало программы (Main)\nint main() {\n  return 0;\n}`,
    explanation: "Память стека пуста. Мы начинаем выполнение функции main.",
    memory: []
  },
  {
    lineId: 1,
    code: `int a = 10;`,
    explanation: "Выделяется память (4 байта) для переменной 'a'. В неё записывается значение 10.",
    memory: [
      { address: "0x7FF0", value: 10, vars: ["a"], isHighlight: true }
    ]
  },
  {
    lineId: 2,
    code: `int* ptr = &a;`,
    explanation: "Создается указатель 'ptr'. Он хранит АДРЕС переменной 'a' (0x7FF0), а не число 10. Указатель 'указывает' на 'a'.",
    memory: [
      { address: "0x7FF0", value: 10, vars: ["a"] },
      { address: "0x7FF4", value: "0x7FF0", vars: ["ptr"], isHighlight: true }
    ]
  },
  {
    lineId: 3,
    code: `int& ref = a;`,
    explanation: "Создается ссылка 'ref'. Это НЕ новая память. Это псевдоним (второе имя) для существующей области памяти 'a'.",
    memory: [
      { address: "0x7FF0", value: 10, vars: ["a", "ref"], isHighlight: true },
      { address: "0x7FF4", value: "0x7FF0", vars: ["ptr"] }
    ]
  },
  {
    lineId: 4,
    code: `*ptr = 20;`,
    explanation: "Разыменование (*ptr): идем по адресу, хранящемуся в ptr (0x7FF0), и меняем значение на 20.",
    memory: [
      { address: "0x7FF0", value: 20, vars: ["a", "ref"], isHighlight: true },
      { address: "0x7FF4", value: "0x7FF0", vars: ["ptr"] }
    ]
  },
  {
    lineId: 5,
    code: `ref = 30;`,
    explanation: "Изменение через ссылку: так как ref — это просто другое имя для 'a', значение меняется напрямую.",
    memory: [
      { address: "0x7FF0", value: 30, vars: ["a", "ref"], isHighlight: true },
      { address: "0x7FF4", value: "0x7FF0", vars: ["ptr"] }
    ]
  },
  {
    lineId: 6,
    code: `int b = 99;`,
    explanation: "Создается новая переменная 'b' в новой ячейке памяти.",
    memory: [
      { address: "0x7FF0", value: 30, vars: ["a", "ref"] },
      { address: "0x7FF4", value: "0x7FF0", vars: ["ptr"] },
      { address: "0x7FF8", value: 99, vars: ["b"], isHighlight: true }
    ]
  },
  {
    lineId: 7,
    code: `ptr = &b;`,
    explanation: "Указатель 'ptr' перенаправлен. Теперь он хранит адрес 'b' (0x7FF8). Ссылка 'ref' осталась привязана к 'a' навсегда.",
    memory: [
      { address: "0x7FF0", value: 30, vars: ["a", "ref"] },
      { address: "0x7FF4", value: "0x7FF8", vars: ["ptr"], isHighlight: true },
      { address: "0x7FF8", value: 99, vars: ["b"] }
    ]
  },
  {
    lineId: 8,
    code: `*ptr = 50;`,
    explanation: "Изменяем значение по адресу в ptr (теперь это 'b'). Значение 'a' не меняется.",
    memory: [
      { address: "0x7FF0", value: 30, vars: ["a", "ref"] },
      { address: "0x7FF4", value: "0x7FF8", vars: ["ptr"] },
      { address: "0x7FF8", value: 50, vars: ["b"], isHighlight: true }
    ]
  }
];

// --- Arrow vs Dot Tasks ---

const NODE_OP_DOT = {
  id: 'node-dot', title: 'Dot Operator', type: 'OPERATOR', x: 250, y: 50, color: '#3b82f6', content: '.',
  inputs: [{id: 'in', label: 'Object', type: 'OBJECT'}], outputs: [{id: 'out', label: 'Member', type: 'MEMBER'}]
};

const NODE_OP_ARROW = {
  id: 'node-arrow', title: 'Arrow Operator', type: 'OPERATOR', x: 250, y: 250, color: '#8b5cf6', content: '->',
  inputs: [{id: 'in', label: 'Pointer', type: 'POINTER'}], outputs: [{id: 'out', label: 'Member', type: 'MEMBER'}]
};

const NODE_MEMBER = {
  id: 'node-mem', title: 'Struct Member', type: 'MEMBER', x: 500, y: 150, color: '#10b981', content: 'int hp',
  inputs: [{id: 'in', label: 'Access', type: 'MEMBER'}], outputs: []
};

const mkNodes = (nodes: any[]) => nodes as any[];

export const ARROW_DOT_TASKS: ArrowTask[] = [
  {
    id: 1,
    context: "У вас есть объект `p1` (не указатель). Соедините ноды, чтобы получить доступ к `hp`.",
    correctPath: ['node-var', 'node-dot', 'node-mem'],
    explanation: "Объекты используют точку (.) для доступа к полям.",
    nodes: mkNodes([
      { 
        id: 'node-var', title: 'Variable', type: 'VARIABLE', x: 20, y: 150, color: '#3b82f6', content: 'Player p1',
        inputs: [], outputs: [{id: 'out', label: 'Object', type: 'OBJECT'}]
      },
      NODE_OP_DOT,
      NODE_OP_ARROW,
      NODE_MEMBER
    ])
  },
  {
    id: 2,
    context: "У вас есть указатель `ptr`. Как добраться до `hp`?",
    correctPath: ['node-var', 'node-arrow', 'node-mem'],
    explanation: "Указатели требуют стрелку (->) для доступа к полям. Это сокращение для (*ptr).",
    nodes: mkNodes([
      { 
        id: 'node-var', title: 'Pointer Variable', type: 'VARIABLE', x: 20, y: 150, color: '#8b5cf6', content: 'Player* ptr',
        inputs: [], outputs: [{id: 'out', label: 'Pointer', type: 'POINTER'}]
      },
      NODE_OP_DOT,
      NODE_OP_ARROW,
      NODE_MEMBER
    ])
  },
  {
    id: 3,
    context: "Мы разыменовали указатель `(*ptr)`. Это превращает адрес обратно в объект. Какой оператор нужен теперь?",
    correctPath: ['node-var', 'node-dot', 'node-mem'],
    explanation: "(*ptr) возвращает сам Объект. К объектам применяется точка (.).",
    nodes: mkNodes([
      { 
        id: 'node-var', title: 'Expression', type: 'VARIABLE', x: 20, y: 150, color: '#3b82f6', content: '(*ptr)',
        inputs: [], outputs: [{id: 'out', label: 'Object', type: 'OBJECT'}]
      },
      NODE_OP_DOT,
      NODE_OP_ARROW,
      NODE_MEMBER
    ])
  },
  {
    id: 4,
    context: "Доступ к элементу массива `team[0]`. Массив хранит объекты Player.",
    correctPath: ['node-var', 'node-dot', 'node-mem'],
    explanation: "Оператор [] возвращает ссылку на объект в массиве. Используем точку.",
    nodes: mkNodes([
      { 
        id: 'node-var', title: 'Array Element', type: 'VARIABLE', x: 20, y: 150, color: '#3b82f6', content: 'team[0]',
        inputs: [], outputs: [{id: 'out', label: 'Object', type: 'OBJECT'}]
      },
      NODE_OP_DOT,
      NODE_OP_ARROW,
      NODE_MEMBER
    ])
  },
  {
    id: 5,
    context: "Внутри метода класса используем `this`. Это указатель на текущий объект.",
    correctPath: ['node-var', 'node-arrow', 'node-mem'],
    explanation: "`this` в C++ всегда является указателем. Нужна стрелка.",
    nodes: mkNodes([
      { 
        id: 'node-var', title: 'Keyword', type: 'VARIABLE', x: 20, y: 150, color: '#8b5cf6', content: 'this',
        inputs: [], outputs: [{id: 'out', label: 'Pointer', type: 'POINTER'}]
      },
      NODE_OP_DOT,
      NODE_OP_ARROW,
      NODE_MEMBER
    ])
  }
];

// --- Quiz Questions ---
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Что хранит переменная-указатель (int* ptr)?",
    options: [
      "Само значение (int)",
      "Адрес ячейки памяти",
      "Ссылку на предыдущую переменную",
      "Всегда 0"
    ],
    correctIndex: 1,
    explanation: "Указатели хранят адреса памяти других переменных."
  },
  {
    id: 2,
    question: "Можно ли переназначить ссылку (int& ref) на другую переменную после инициализации?",
    options: [
      "Да, используя оператор &",
      "Да, используя оператор =",
      "Нет, ссылка привязывается один раз навсегда",
      "Только если ссылка константная"
    ],
    correctIndex: 2,
    explanation: "Ссылки в C++ должны быть инициализированы при создании и не могут быть перепривязаны."
  },
  {
    id: 3,
    question: "У вас есть `Car* myCar`. Как получить доступ к методу `drive()`?",
    options: [
      "myCar.drive()",
      "myCar->drive()",
      "myCar::drive()",
      "&myCar.drive()"
    ],
    correctIndex: 1,
    explanation: "Так как myCar — это указатель, для доступа к членам используется оператор стрелка (->)."
  },
  {
    id: 4,
    question: "Что делает оператор `*` перед именем указателя (например, `*ptr`)?",
    options: [
      "Создает новый указатель",
      "Удаляет переменную",
      "Разыменовывает (получает значение по адресу)",
      "Возвращает адрес указателя"
    ],
    correctIndex: 2,
    explanation: "Это операция разыменования. Она дает доступ к значению, лежащему по адресу, который хранит указатель."
  }
];

// --- Loop Scenarios ---

export const LOOP_SCENARIOS: LoopScenario[] = [
  {
    id: 'for',
    title: 'For Loop (Классический)',
    code: [
      '// Проходим 3 раза',
      'for (int i = 0; i < 3; i++) {',
      '    print(i);',
      '}',
      'done();'
    ],
    nodes: [
      { id: 'start', type: 'START', label: 'Start', x: 150, y: 20, next: 'init' },
      { id: 'init', type: 'ACTION', label: 'int i = 0', x: 150, y: 80, next: 'cond' },
      { id: 'cond', type: 'CONDITION', label: 'i < 3 ?', x: 150, y: 160, nextTrue: 'body', nextFalse: 'end' },
      { id: 'body', type: 'ACTION', label: 'print(i)', x: 150, y: 260, next: 'update' },
      { id: 'update', type: 'ACTION', label: 'i++', x: 150, y: 340, next: 'cond' }, // Loop back visually handled by SVG
      { id: 'end', type: 'END', label: 'Exit', x: 350, y: 160 }
    ],
    steps: [
      { nodeId: 'start', lineIndex: 0, variables: { i: '?' }, explanation: "Начало программы." },
      { nodeId: 'init', lineIndex: 1, variables: { i: 0 }, explanation: "Инициализация: i устанавливается в 0." },
      { nodeId: 'cond', lineIndex: 1, variables: { i: 0 }, explanation: "Проверка: 0 < 3? Да (True)." },
      { nodeId: 'body', lineIndex: 2, variables: { i: 0 }, explanation: "Выполняется тело цикла. Вывод: 0" },
      { nodeId: 'update', lineIndex: 1, variables: { i: 1 }, explanation: "Обновление: i увеличивается до 1." },
      { nodeId: 'cond', lineIndex: 1, variables: { i: 1 }, explanation: "Проверка: 1 < 3? Да (True)." },
      { nodeId: 'body', lineIndex: 2, variables: { i: 1 }, explanation: "Выполняется тело цикла. Вывод: 1" },
      { nodeId: 'update', lineIndex: 1, variables: { i: 2 }, explanation: "Обновление: i увеличивается до 2." },
      { nodeId: 'cond', lineIndex: 1, variables: { i: 2 }, explanation: "Проверка: 2 < 3? Да (True)." },
      { nodeId: 'body', lineIndex: 2, variables: { i: 2 }, explanation: "Выполняется тело цикла. Вывод: 2" },
      { nodeId: 'update', lineIndex: 1, variables: { i: 3 }, explanation: "Обновление: i увеличивается до 3." },
      { nodeId: 'cond', lineIndex: 1, variables: { i: 3 }, explanation: "Проверка: 3 < 3? Нет (False)." },
      { nodeId: 'end', lineIndex: 4, variables: { i: 3 }, explanation: "Выход из цикла." },
    ]
  },
  {
    id: 'while',
    title: 'While Loop (Пока...)',
    code: [
      'int i = 0;',
      'while (i < 2) {',
      '    i++;',
      '}',
      'done();'
    ],
    nodes: [
      { id: 'start', type: 'START', label: 'Start', x: 150, y: 20, next: 'init' },
      { id: 'init', type: 'ACTION', label: 'i = 0', x: 150, y: 80, next: 'cond' },
      { id: 'cond', type: 'CONDITION', label: 'i < 2 ?', x: 150, y: 160, nextTrue: 'body', nextFalse: 'end' },
      { id: 'body', type: 'ACTION', label: 'i++', x: 150, y: 260, next: 'cond' },
      { id: 'end', type: 'END', label: 'Exit', x: 350, y: 160 }
    ],
    steps: [
      { nodeId: 'start', lineIndex: 0, variables: { i: '?' }, explanation: "Начало." },
      { nodeId: 'init', lineIndex: 0, variables: { i: 0 }, explanation: "Переменная i создана до цикла." },
      { nodeId: 'cond', lineIndex: 1, variables: { i: 0 }, explanation: "While проверяет условие ДО выполнения. 0 < 2?" },
      { nodeId: 'body', lineIndex: 2, variables: { i: 1 }, explanation: "Тело цикла: i увеличивается до 1." },
      { nodeId: 'cond', lineIndex: 1, variables: { i: 1 }, explanation: "Снова проверка. 1 < 2?" },
      { nodeId: 'body', lineIndex: 2, variables: { i: 2 }, explanation: "Тело цикла: i увеличивается до 2." },
      { nodeId: 'cond', lineIndex: 1, variables: { i: 2 }, explanation: "Проверка. 2 < 2? False." },
      { nodeId: 'end', lineIndex: 4, variables: { i: 2 }, explanation: "Цикл завершен." }
    ]
  },
  {
    id: 'do_while',
    title: 'Do-While (Хотя бы раз)',
    code: [
      'int i = 10;',
      'do {',
      '    print(i);',
      '} while (i < 5);',
      'done();'
    ],
    nodes: [
      { id: 'start', type: 'START', label: 'Start', x: 150, y: 20, next: 'init' },
      { id: 'init', type: 'ACTION', label: 'i = 10', x: 150, y: 80, next: 'body' },
      { id: 'body', type: 'ACTION', label: 'print(i)', x: 150, y: 160, next: 'cond' },
      { id: 'cond', type: 'CONDITION', label: 'i < 5 ?', x: 150, y: 240, nextTrue: 'body', nextFalse: 'end' },
      { id: 'end', type: 'END', label: 'Exit', x: 350, y: 240 }
    ],
    steps: [
      { nodeId: 'start', lineIndex: 0, variables: { i: '?' }, explanation: "Начало." },
      { nodeId: 'init', lineIndex: 0, variables: { i: 10 }, explanation: "i = 10." },
      { nodeId: 'body', lineIndex: 2, variables: { i: 10 }, explanation: "Do-While СНАЧАЛА делает тело. Вывод: 10." },
      { nodeId: 'cond', lineIndex: 3, variables: { i: 10 }, explanation: "ПОТОМ проверяет условие. 10 < 5? False." },
      { nodeId: 'end', lineIndex: 4, variables: { i: 10 }, explanation: "Выход, хотя условие сразу было ложным." }
    ]
  },
  {
    id: 'nested',
    title: 'Nested (Вложенные)',
    code: [
      'for (int i=0; i<2; i++) { // Outer',
      '  for (int j=0; j<2; j++) { // Inner',
      '     print(i, j);',
      '  }',
      '}',
      'done();'
    ],
    // Simplified Linear visual flow for nested to keep it readable
    nodes: [
      { id: 'start', type: 'START', label: 'Start', x: 150, y: 20, next: 'out_init' },
      { id: 'out_init', type: 'ACTION', label: 'i = 0', x: 150, y: 70, next: 'out_cond' },
      { id: 'out_cond', type: 'CONDITION', label: 'i < 2?', x: 150, y: 130, nextTrue: 'in_init', nextFalse: 'end' },
      
      { id: 'in_init', type: 'ACTION', label: 'j = 0', x: 150, y: 210, next: 'in_cond' },
      { id: 'in_cond', type: 'CONDITION', label: 'j < 2?', x: 150, y: 270, nextTrue: 'in_body', nextFalse: 'out_upd' },
      
      { id: 'in_body', type: 'ACTION', label: 'print(i,j)', x: 150, y: 350, next: 'in_upd' },
      { id: 'in_upd', type: 'ACTION', label: 'j++', x: 280, y: 310, next: 'in_cond' }, // Visual loop back
      
      { id: 'out_upd', type: 'ACTION', label: 'i++', x: 380, y: 130, next: 'out_cond' },
      { id: 'end', type: 'END', label: 'Exit', x: 50, y: 130 }
    ],
    steps: [
      { nodeId: 'start', lineIndex: 0, variables: { i: '?', j: '?' }, explanation: "Начало." },
      
      // i = 0
      { nodeId: 'out_init', lineIndex: 0, variables: { i: 0, j: '?' }, explanation: "Внешний цикл: i=0." },
      { nodeId: 'out_cond', lineIndex: 0, variables: { i: 0, j: '?' }, explanation: "0 < 2? True. Заходим внутрь." },
      
        // j = 0
        { nodeId: 'in_init', lineIndex: 1, variables: { i: 0, j: 0 }, explanation: "Внутренний цикл (старт): j=0." },
        { nodeId: 'in_cond', lineIndex: 1, variables: { i: 0, j: 0 }, explanation: "Inner: 0 < 2? True." },
        { nodeId: 'in_body', lineIndex: 2, variables: { i: 0, j: 0 }, explanation: "Print (0, 0)." },
        { nodeId: 'in_upd', lineIndex: 1, variables: { i: 0, j: 1 }, explanation: "Inner: j++ -> 1." },
        
        // j = 1
        { nodeId: 'in_cond', lineIndex: 1, variables: { i: 0, j: 1 }, explanation: "Inner: 1 < 2? True." },
        { nodeId: 'in_body', lineIndex: 2, variables: { i: 0, j: 1 }, explanation: "Print (0, 1)." },
        { nodeId: 'in_upd', lineIndex: 1, variables: { i: 0, j: 2 }, explanation: "Inner: j++ -> 2." },
        
        // j End
        { nodeId: 'in_cond', lineIndex: 1, variables: { i: 0, j: 2 }, explanation: "Inner: 2 < 2? False. Выход из внутреннего." },
      
      { nodeId: 'out_upd', lineIndex: 0, variables: { i: 1, j: 2 }, explanation: "Внешний цикл: i++ -> 1." },
      { nodeId: 'out_cond', lineIndex: 0, variables: { i: 1, j: 2 }, explanation: "1 < 2? True. Снова внутрь." },

        // j = 0 (Reset)
        { nodeId: 'in_init', lineIndex: 1, variables: { i: 1, j: 0 }, explanation: "Внутренний цикл СБРАСЫВАЕТСЯ: j=0." },
        { nodeId: 'in_cond', lineIndex: 1, variables: { i: 1, j: 0 }, explanation: "Inner: 0 < 2? True." },
        { nodeId: 'in_body', lineIndex: 2, variables: { i: 1, j: 0 }, explanation: "Print (1, 0)." },
        { nodeId: 'in_upd', lineIndex: 1, variables: { i: 1, j: 1 }, explanation: "Inner: j++ -> 1." },
        
        // j = 1
        { nodeId: 'in_cond', lineIndex: 1, variables: { i: 1, j: 1 }, explanation: "Inner: 1 < 2? True." },
        { nodeId: 'in_body', lineIndex: 2, variables: { i: 1, j: 1 }, explanation: "Print (1, 1)." },
        { nodeId: 'in_upd', lineIndex: 1, variables: { i: 1, j: 2 }, explanation: "Inner: j++ -> 2." },
        
        // j End
        { nodeId: 'in_cond', lineIndex: 1, variables: { i: 1, j: 2 }, explanation: "Inner: 2 < 2? False." },

      { nodeId: 'out_upd', lineIndex: 0, variables: { i: 2, j: 2 }, explanation: "Внешний цикл: i++ -> 2." },
      { nodeId: 'out_cond', lineIndex: 0, variables: { i: 2, j: 2 }, explanation: "2 < 2? False. Выход из внешнего." },
      
      { nodeId: 'end', lineIndex: 5, variables: { i: 2, j: 2 }, explanation: "Программа завершена." }
    ]
  }
];
