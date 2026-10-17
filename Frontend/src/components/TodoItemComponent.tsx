import React, { useState } from 'react';
import type { TodoList } from '../types';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface TodoItemProps {
  todo: TodoList;
  onToggle: (id: number, currentCompleted: boolean) => Promise<void>;
  onUpdate: (id: number, title: string, description: string | null) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TodoItemComponent: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(todo.title);
  const [editDesc, setEditDesc] = useState<string>(todo.description || '');
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsBusy(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDesc.trim() || null);
      setIsEditing(false);
    } finally {
      setIsBusy(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setIsEditing(false);
  };

  const handleToggle = async () => {
    setIsBusy(true);
    try {
      await onToggle(todo.id, todo.completed);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setIsBusy(true);
    try {
      await onDelete(todo.id);
    } finally {
      setIsBusy(false);
    }
  };

  if (isEditing) {
    return (
      <li className="p-3 bg-white border border-slate-300 rounded-md shadow-sm space-y-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:border-slate-600"
          placeholder="Task title"
          autoFocus
          disabled={isBusy}
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          rows={2}
          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-600 resize-none"
          placeholder="Optional description"
          disabled={isBusy}
        />
        <div className="flex justify-end space-x-2 pt-1">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isBusy}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isBusy || !editTitle.trim()}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-white bg-slate-900 hover:bg-slate-800 rounded disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`p-3 bg-white border rounded-md transition-all flex items-start justify-between gap-3 ${
      todo.completed ? 'border-slate-200 bg-slate-50/50' : 'border-slate-200'
    }`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isBusy}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm break-words ${
            todo.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'
          }`}>
            {todo.title}
          </p>
          {todo.description && (
            <p className={`text-xs mt-0.5 break-words ${
              todo.completed ? 'text-slate-400 line-through' : 'text-slate-500'
            }`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1 shrink-0">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={isBusy}
          title="Edit"
          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isBusy}
          title="Delete"
          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
};
