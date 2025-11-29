
import React, { useState } from 'react';
import { ModuleType } from './types';
import PointerLesson from './modules/PointerLesson';
import ArrowDotLesson from './modules/ArrowDotLesson';
import LoopsLesson from './modules/LoopsLesson';
import BitwiseLesson from './modules/BitwiseLesson';
import Quiz from './modules/Quiz';
import { Terminal, Cpu, MoveRight, HelpCircle, GraduationCap, Repeat, Binary } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.HOME);

  const renderContent = () => {
    switch (activeModule) {
      case ModuleType.POINTERS:
        return <PointerLesson />;
      case ModuleType.ARROW_DOT:
        return <ArrowDotLesson />;
      case ModuleType.LOOPS:
        return <LoopsLesson />;
      case ModuleType.BITWISE:
        return <BitwiseLesson />;
      case ModuleType.QUIZ:
        return <Quiz />;
      case ModuleType.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-full text-center space-y-8 animate-fade-in pb-12">
             <div className="p-6 bg-zinc-800 rounded-full border border-zinc-700 shadow-2xl mt-8">
                <Terminal size={64} className="text-blue-500" />
             </div>
             <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                  CppMastery
                </h1>
                <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                  Интерактивный тренажер для изучения памяти C++. 
                  Разберитесь с указателями, ссылками, циклами и битовыми операциями.
                </p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mt-8 px-4">
                <HomeCard 
                    onClick={() => setActiveModule(ModuleType.POINTERS)}
                    icon={<Cpu className="text-blue-400" />}
                    color="bg-blue-900/30"
                    borderColor="hover:border-blue-500"
                    title="Указатели и Память"
                    desc="Визуализация стека, ссылок и разименования."
                />
                
                <HomeCard 
                    onClick={() => setActiveModule(ModuleType.ARROW_DOT)}
                    icon={<MoveRight className="text-emerald-400" />}
                    color="bg-emerald-900/30"
                    borderColor="hover:border-emerald-500"
                    title="Точка vs Стрелка"
                    desc="Интерактивная игра: выберите правильный оператор."
                />

                <HomeCard 
                    onClick={() => setActiveModule(ModuleType.LOOPS)}
                    icon={<Repeat className="text-orange-400" />}
                    color="bg-orange-900/30"
                    borderColor="hover:border-orange-500"
                    title="Циклы (Loops)"
                    desc="Пошаговая отладка циклов for и while."
                />

                <HomeCard 
                    onClick={() => setActiveModule(ModuleType.BITWISE)}
                    icon={<Binary className="text-cyan-400" />}
                    color="bg-cyan-900/30"
                    borderColor="hover:border-cyan-500"
                    title="Битовые Операции"
                    desc="Визуальный калькулятор битов."
                />

                <HomeCard 
                    onClick={() => setActiveModule(ModuleType.QUIZ)}
                    icon={<GraduationCap className="text-purple-400" />}
                    color="bg-purple-900/30"
                    borderColor="hover:border-purple-500"
                    title="Проверка Знаний"
                    desc="Тест для закрепления материала."
                />
             </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-zinc-800 cursor-pointer" onClick={() => setActiveModule(ModuleType.HOME)}>
            <Terminal className="text-blue-500 shrink-0" />
            <span className="font-bold text-lg hidden md:block tracking-tight">CppMastery</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            <NavItem 
                active={activeModule === ModuleType.POINTERS} 
                onClick={() => setActiveModule(ModuleType.POINTERS)}
                icon={<Cpu size={20} />}
                label="Указатели"
            />
            <NavItem 
                active={activeModule === ModuleType.ARROW_DOT} 
                onClick={() => setActiveModule(ModuleType.ARROW_DOT)}
                icon={<MoveRight size={20} />}
                label="Arrow vs Dot"
            />
            <NavItem 
                active={activeModule === ModuleType.LOOPS} 
                onClick={() => setActiveModule(ModuleType.LOOPS)}
                icon={<Repeat size={20} />}
                label="Циклы"
            />
            <NavItem 
                active={activeModule === ModuleType.BITWISE} 
                onClick={() => setActiveModule(ModuleType.BITWISE)}
                icon={<Binary size={20} />}
                label="Биты"
            />
            <NavItem 
                active={activeModule === ModuleType.QUIZ} 
                onClick={() => setActiveModule(ModuleType.QUIZ)}
                icon={<HelpCircle size={20} />}
                label="Тест"
            />
        </nav>

        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 text-center md:text-left shrink-0">
           <span className="hidden md:inline">v1.1.0 Local Mode</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden relative">
        <div className="h-full w-full max-w-7xl mx-auto bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6 md:p-8 shadow-inner overflow-auto custom-scrollbar">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            active 
            ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
        }`}
    >
        <span className={active ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}>{icon}</span>
        <span className="font-medium hidden md:block">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 hidden md:block box-shadow-glow"></div>}
    </button>
);

const HomeCard: React.FC<{ onClick: () => void; icon: React.ReactNode; color: string; borderColor: string; title: string; desc: string }> = ({ onClick, icon, color, borderColor, title, desc }) => (
    <button 
        onClick={onClick}
        className={`group p-6 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 ${borderColor} rounded-xl transition-all hover:-translate-y-1 text-left h-full`}
    >
        <div className={`mb-4 ${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
        {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400">{desc}</p>
    </button>
);

export default App;
