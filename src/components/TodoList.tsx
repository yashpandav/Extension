import React, { useState, useEffect, FormEvent } from 'react';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  details?: string;
  time?: string;
  links?: string[];
}

const DetailModal = ({ todo, onClose, onSave }: {
  todo: TodoItem;
  onClose: () => void;
  onSave: (updatedTodo: TodoItem) => void;
}) => {
  const [details, setDetails] = useState(todo.details || '');
  const [time, setTime] = useState(todo.time || '');
  const [links, setLinks] = useState<string[]>(todo.links || []);
  const [newLink, setNewLink] = useState('');

  const addLink = () => {
    if (newLink.trim() && !links.includes(newLink)) {
      setLinks([...links, newLink]);
      setNewLink('');
    }
  };

  const saveChanges = () => {
    onSave({ ...todo, details, time, links });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="modal-overlay absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative z-10 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Task Details</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />
          <label className="block text-sm font-medium mb-1">Due Time</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />
          <label className="block text-sm font-medium mb-1">Links</label>
          <div className="flex mb-4">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Add a link"
              className="flex-grow border rounded-l-lg px-3 py-2"
            />
            <button
              onClick={addLink}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <ul>
            {links.map((link, index) => (
              <li key={index} className="flex items-center mb-2">
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex-grow truncate">{link}</a>
                <button
                  onClick={() => setLinks(links.filter((l) => l !== link))}
                  className="text-red-500 ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded-lg">Cancel</button>
          <button onClick={saveChanges} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

const SortableTodo = ({ todo, toggleTodo, removeTodo, setSelectedTodo }: {
  todo: TodoItem;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  setSelectedTodo: (todo: TodoItem) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center mb-2"
    >
      <button onClick={() => toggleTodo(todo.id)}>
        {todo.completed ? <CheckCircle2 /> : <Circle />}
      </button>
      <span
        className="flex-grow ml-4 cursor-pointer"
        onClick={() => setSelectedTodo(todo)}
      >
        {todo.text}
      </span>
      <button onClick={() => removeTodo(todo.id)} className="ml-2 text-red-500"><Trash2 /></button>
    </li>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(savedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodoDetails = (updatedTodo: TodoItem) => {
    setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = todos.findIndex(todo => todo.id === active.id);
      const newIndex = todos.findIndex(todo => todo.id === over.id);
      setTodos(arrayMove(todos, oldIndex, newIndex));
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg">
      <h2 className="text-2xl mb-6">To-Do List</h2>
      <form onSubmit={addTodo} className="flex mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a task"
          className="flex-grow border px-3 py-2 rounded-l-lg"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Add</button>
      </form>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={todos} strategy={verticalListSortingStrategy}>
          <ul>
            {todos.map(todo => (
              <SortableTodo
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                removeTodo={removeTodo}
                setSelectedTodo={setSelectedTodo}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {selectedTodo && (
        <DetailModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onSave={updateTodoDetails}
        />
      )}
    </div>
  );
};

export default TodoList;
