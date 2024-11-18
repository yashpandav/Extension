import React, { useState, useEffect, FormEvent } from 'react';
import { CheckCircle2, Circle, Plus, X, Trash2 } from 'lucide-react';

export const TodoList = () => {
  const [todos, setTodos] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(savedTodos);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearAllTodos = () => {
    setTodos([]);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-xl w-full max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tasks</h2>

      {/* Add New Task */}
      <form onSubmit={addTodo} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-4">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`flex items-center gap-3 p-3 rounded-lg shadow-md border ${
              todo.completed ? 'bg-gray-100 border-gray-200' : 'bg-white border-blue-300'
            } transition-all`}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`text-gray-600 hover:text-blue-500 ${todo.completed ? 'text-green-500' : ''}`}
            >
              {todo.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </button>
            <span className={`flex-1 text-lg font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="text-gray-400 hover:text-red-500 transition"
              title="Remove task"
            >
              <X className="w-5 h-5" />
            </button>
          </li>
        ))}
        {!todos.length && (
          <li className="text-center text-gray-500">No tasks yet. Add some!</li>
        )}
      </ul>

      {/* Clear All Button */}
      {todos.length > 0 && (
        <div className="mt-6 text-right">
          <button
            onClick={clearAllTodos}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition"
          >
            <Trash2 className="inline-block w-4 h-4 mr-2" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
