import React, { useState, useEffect } from 'react';
import type { TodoList } from '../types';
import { api } from '../services/api';
import { TodoItemComponent } from './TodoItemComponent';
import { Plus, ListFilter, AlertCircle } from 'lucide-react';

export const TodoView: React.FC = () => {
  const [todos, setTodos] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New todo form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [showDescInput, setShowDescInput] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);

  // Filter state
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodos();
      setTodos(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setAdding(true);
    try {
      const created = await api.createTodo(newTitle.trim(), newDesc.trim() || undefined);
      setTodos([created, ...todos]);
      setNewTitle('');
      setNewDesc('');
      setShowDescInput(false);
    } catch (err: any) {
      alert(err?.message || 'Error adding task');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: number, currentCompleted: boolean) => {
    try {
      const updated = await api.updateTodo(id, { completed: !currentCompleted });
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err: any) {
      alert(err?.message || 'Failed to update task');
    }
  };

  const handleUpdate = async (id: number, title: string, description: string | null) => {
    try {
      const updated = await api.updateTodo(id, { title, description });
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err: any) {
      alert(err?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete task');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Create Todo Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm mb-6">
        <form onSubmit={handleAddTodo} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-slate-600"
              disabled={adding}
            />
            <button
              type="submit"
              disabled={adding || !newTitle.trim()}
              className="inline-flex items-center space-x-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {showDescInput ? (
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Optional notes or details..."
              rows={2}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-600 resize-none"
              disabled={adding}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowDescInput(true)}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
            >
              + Add description
            </button>
          )}
        </form>
      </div>

      {/* Filter and stats row */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 text-xs text-slate-500">
        <div className="flex items-center space-x-1">
          <ListFilter className="w-3.5 h-3.5" />
          <span>{activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining</span>
        </div>

        <div className="flex space-x-2">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2 py-1 rounded capitalize font-medium transition-colors ${
                filter === tab ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchTodos} className="ml-auto underline font-medium">Retry</button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400">Loading tasks...</div>
      ) : filteredTodos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg text-sm text-slate-400">
          {filter === 'all' ? 'No tasks yet. Create your first task above!' : `No ${filter} tasks.`}
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <TodoItemComponent
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
