import React, { useState, useEffect, FormEvent } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  X,
  GripVertical,
  RefreshCcw,
  Edit
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  description?: string;
  relatedSites?: string[];
  links?: string[];
}

const EditTodoDialog = ({
  todo,
  onSave,
  onClose
}: {
  todo: TodoItem,
  onSave: (updatedTodo: TodoItem) => void,
  onClose: () => void
}) => {
  const [editedTodo, setEditedTodo] = useState<TodoItem>({ ...todo });

  const handleSave = () => {
    const cleanedTodo = {
      ...editedTodo,
      relatedSites: editedTodo.relatedSites
        ? editedTodo.relatedSites.filter(site => site.trim() !== '')
        : undefined,
      links: editedTodo.links
        ? editedTodo.links.filter(link => link.trim() !== '')
        : undefined
    };
    onSave(cleanedTodo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              value={editedTodo.text}
              onChange={(e) => setEditedTodo(prev => ({ ...prev, text: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editedTodo.description || ''}
              onChange={(e) => setEditedTodo(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 p-2 rounded-lg min-h-[100px]"
              placeholder="Add a detailed description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Sites (comma-separated)</label>
            <input
              type="text"
              value={editedTodo.relatedSites?.join(', ') || ''}
              onChange={(e) => setEditedTodo(prev => ({
                ...prev,
                relatedSites: e.target.value.split(',').map(site => site.trim())
              }))}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="https://example.com, https://another.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Links (comma-separated)</label>
            <input
              type="text"
              value={editedTodo.links?.join(', ') || ''}
              onChange={(e) => setEditedTodo(prev => ({
                ...prev,
                links: e.target.value.split(',').map(link => link.trim())
              }))}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="https://link1.com, https://link2.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <input
              type="text"
              value={new Date(editedTodo.createdAt).toLocaleString()}
              disabled
              className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SortableItem = ({
  todo,
  onToggle,
  onRemove,
  onEdit
}: {
  todo: TodoItem,
  onToggle: () => void,
  onRemove: () => void,
  onEdit: () => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-3 rounded-lg border transition-all ${todo.completed
        ? 'bg-gray-100 border-gray-200 text-gray-400'
        : 'bg-white border-blue-200'
        }`}
    >
      <button {...attributes} {...listeners} className="mr-3 cursor-move">
        <GripVertical className="text-gray-400 hover:text-gray-600" />
      </button>

      <button
        onClick={onToggle}
        className="mr-3"
      >
        {todo.completed ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-400" />}
      </button>

      <span
        className={`flex-1 ${todo.completed ? 'line-through' : ''}`}
      >
        {todo.text}
      </span>
      <button
        onClick={onEdit}
        className="mr-3 text-blue-400 hover:text-blue-600 transition"
      >
        <Edit />
      </button>

      <button
        onClick={onRemove}
        className="text-red-400 hover:text-red-600 transition"
      >
        <X />
      </button>
    </li>
  );
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const storedTodos = localStorage.getItem('chromeExtensionTodos');
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch (error) {
      console.error('Error reading todos from localStorage:', error);
      return [];
    }
  });

  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

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
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-sm px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`text-sm px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`text-sm px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Completed
          </button>
        </div>
      </div>

      <form onSubmit={addTodo} className="flex mb-6 shadow-md">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
          className="flex-1 border border-gray-300 p-3 rounded-l-lg focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-3 rounded-r-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-6 h-6" />
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

      {todos.some(todo => todo.completed) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearCompleted}
            className="text-sm text-red-500 hover:text-red-700 flex items-center"
          >
            <RefreshCcw className="mr-2 w-4 h-4" />
            Clear Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;