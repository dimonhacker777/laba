import { memo } from 'react';

export const TaskItem = memo(function TaskItem({ task, onToggle, onRemove, onRename }) {
  const handleRename = () => {
    const newText = prompt('Введите новый текст задачи:', task.text);
    if (newText && newText.trim() !== '' && newText !== task.text) {
      onRename(task.id, newText.trim());
    }
  };

  return (
    <li className={task.done ? 'done' : ''}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
      <span>{task.text}</span>
      <button onClick={handleRename}>✎</button> {/* Кнопка редактирования */}
      <button onClick={() => onRemove(task.id)}>✕</button>
    </li>
  );
});