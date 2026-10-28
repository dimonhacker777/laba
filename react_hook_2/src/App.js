import { useReducer, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { tasksReducer } from './tasksReducer.js';
import { AddTaskForm } from './components/AddTaskForm.jsx';
import { TaskList } from './components/TaskList.jsx';
import { useTheme } from './ThemeContext.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { useLanguage } from './LanguageContext.jsx'; 
import { LanguageToggle } from './components/LanguageToggle.jsx'; 

export default function App() {
  const { theme } = useTheme();
  const { lang } = useLanguage(); 
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  const visibleTasks = useMemo(() => {
    let filtered = tasks;
    
    if (filter === 'done') filtered = filtered.filter(t => t.done);
    if (filter === 'active') filtered = filtered.filter(t => !t.done);
    
    if (search.trim()) {
      filtered = filtered.filter(t => t.text.toLowerCase().includes(search.toLowerCase()));
    }
    
    return filtered;
  }, [tasks, filter, search]);

  const doneCount = useMemo(() => tasks.filter(t => t.done).length, [tasks]);
  
  const donePercent = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((doneCount / tasks.length) * 100);
  }, [tasks.length, doneCount]);

  const handleAdd = useCallback((text) => {
    dispatch({ type: 'add', task: { id: Date.now(), text, done: false } });
  }, []);

  const handleToggle = useCallback((id) => dispatch({ type: 'toggle', id }), []);
  
  const handleRemove = useCallback((id) => dispatch({ type: 'remove', id }), []);

  const handleRename = useCallback((id, text) => {
    dispatch({ type: 'rename', id, text });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={'app ' + theme}>
      <div className="card">
        <header className="top">
          <h1>{lang === 'ru' ? 'Менеджер задач' : 'Task Manager'}</h1>
          <LanguageToggle />
          <ThemeToggle />
        </header>
        
        <AddTaskForm onAdd={handleAdd} />

        <input 
          ref={searchRef}
          type="search"
          placeholder="Поиск задач (нажмите /)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: '10px', width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />

        <div className="tabs">
          {[['all', 'Все'], ['active', 'Активные'], ['done', 'Готовые']].map(([key, label]) => (
            <button key={key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        <p className="muted">
          Всего: {tasks.length}, выполнено: {doneCount} ({donePercent}%)
        </p>

        <TaskList 
          tasks={visibleTasks} 
          onToggle={handleToggle} 
          onRemove={handleRemove} 
          onRename={handleRename} 
        />
      </div>
    </div>
  );
}