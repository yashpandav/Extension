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
    <div className="relative">

      <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-md border border-white/30 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg"></div>
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>

        {/* Header Section */}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-white">
            My Tasks
          </h1>

          {/* Filter Buttons */}
          <div className="flex space-x-4">
            {['active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as 'active' | 'completed')}
                className={`text-sm font-semibold px-4 py-2 rounded-full shadow-md transition-all duration-300 ${filter === f
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={addTodo} className="flex flex-col space-y-4 mb-6 shadow-md">
          <div className="flex items-center bg-gray-800/80 border border-gray-600 rounded-lg transition-all duration-300 hover:shadow-lg">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task"
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 rounded-l-lg focus:outline-none focus:ring-0"
            />

            <select
              className="bg-gray-800 text-white border-l-0 border-gray-600 p-3 rounded-r-lg transition-colors duration-300 focus:outline-none"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            >
              {['Low', 'Medium', 'High'].map((level) => (
                <option key={level} value={level} className="bg-gray-800 text-white">
                  {level}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 focus:outline-none active:scale-95"
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
    </div>
  );
};

export default TodoList;
