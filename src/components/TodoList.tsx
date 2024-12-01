import React, { useState, useEffect, FormEvent } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import EditTodoDialog from './ToDoHelper/EditTodoDialog';
import SortableItem from './ToDoHelper/SortableItem';
import { RefreshCcw } from 'lucide-react';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  description?: string;
  relatedSites?: string[];
  priority: 'Low' | 'Medium' | 'High';
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const storedTodos = localStorage.getItem('chromeExtensionTodos');
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch {
      return [];
    }
  });
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    try {
      localStorage.setItem('chromeExtensionTodos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  const updateTodo = (updatedTodo: TodoItem) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    );
    setEditingTodo(null);
  };

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTodo = newTodo.trim();
    if (!trimmedTodo) return;

    const newTodoItem: TodoItem = {
      id: crypto.randomUUID(),
      text: trimmedTodo,
      completed: false,
      createdAt: Date.now(),
      priority: newPriority,
    };

    setTodos(prevTodos => [...prevTodos, newTodoItem]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTodos(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
  });

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Tasks</h1>
        <div className="flex space-x-2">
          {['active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as 'active' | 'completed')}
              className={`text-sm px-3 py-1 rounded ${filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={addTodo} className="flex flex-col space-y-4 mb-6 shadow-md">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 bg-gray-800 text-white border border-gray-600 p-3 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <select
            className="bg-gray-800 text-white border-l-0 border border-gray-600 p-3 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNewPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            value={newPriority}
          >
            {['Low', 'Medium', 'High'].map(level => (
              <option key={level} value={level} className="bg-gray-800 text-white">
                {level}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition transform hover:-translate-y-0.5 active:scale-95"
        >
          Add Task
        </button>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredTodos} strategy={verticalListSortingStrategy}>
          {filteredTodos.map(todo => (
            <SortableItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id)}
              onRemove={() => removeTodo(todo.id)}
              onEdit={() => setEditingTodo(todo)}
            />
          ))}
        </SortableContext>

        {editingTodo && (
          <EditTodoDialog
            todo={editingTodo}
            onSave={updateTodo}
            onClose={() => setEditingTodo(null)}
          />
        )}
      </DndContext>

      {
        filter === 'completed' && todos.some(todo => todo.completed) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearCompleted}
              className="text-sm text-red-500 hover:text-red-700 flex items-center"
            >
              <RefreshCcw className="mr-2 w-4 h-4" />
              Clear All
            </button>
          </div>
        )
      }
    </div>
  );
};

export default TodoList;
