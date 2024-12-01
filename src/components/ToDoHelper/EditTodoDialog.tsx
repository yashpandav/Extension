import React from 'react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { TodoItem } from '../TodoList';

const EditTodoDialog = ({
    todo,
    onSave,
    onClose,
}: {
    todo: TodoItem;
    onSave: (updatedTodo: TodoItem) => void;
    onClose: () => void;
}) => {
    const [editedTodo, setEditedTodo] = useState<TodoItem>({ ...todo });
    const [isFocusedTaskTitle, setIsFocusedTaskTitle] = useState(false);
    const [isFocusedDescription, setIsFocusedDescription] = useState(false);
    const [isFocusedRelatedLinks, setIsFocusedRelatedLinks] = useState(false);

    const handleSave = () => {
        const cleanedTodo = {
            ...editedTodo,
            relatedSites: editedTodo.relatedSites
                ? editedTodo.relatedSites.filter((site) => site.trim() !== "")
                : undefined,
        };
        onSave(cleanedTodo);
    };

    return (
        <div
            id="backdrop"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 text-gray-200 rounded-xl p-8 w-[32rem] shadow-2xl relative scale-100 transform transition-transform duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-100">Edit Task</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-100 transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    className="space-y-6"
                >
                    {/* Task Title */}
                    <div className="relative group">
                        <label className="block text-md font-medium text-gray-300 mb-2">
                            Task Title
                        </label>
                        <div className="relative">
                            <div
                                className={`absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 
                                rounded-lg opacity-0 ${isFocusedTaskTitle ? "opacity-100" : "group-hover:opacity-100"
                                    } transition-opacity duration-300`}
                            ></div>
                            <input
                                type="text"
                                value={editedTodo.text}
                                onFocus={() => setIsFocusedTaskTitle(true)}
                                onBlur={() => setIsFocusedTaskTitle(false)}
                                onChange={(e) =>
                                    setEditedTodo((prev) => ({ ...prev, text: e.target.value }))
                                }
                                placeholder="Enter the task title"
                                className="relative w-full px-4 py-3 bg-gray-800 text-gray-100 placeholder-gray-400 border border-transparent rounded-lg focus:outline-none focus:placeholder-transparent z-10 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="relative group">
                        <label className="block text-md font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <div className="relative">
                            <div
                                className={`absolute bottom-1 -inset-0.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 
                                    rounded-lg opacity-0 ${isFocusedDescription ? "opacity-100" : "group-hover:opacity-100"
                                    } transition-opacity duration-300`}
                            ></div>
                            <textarea
                                value={editedTodo.description || ""}
                                onFocus={() => setIsFocusedDescription(true)}
                                onBlur={() => setIsFocusedDescription(false)}
                                onChange={(e) =>
                                    setEditedTodo((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Add a detailed description (optional)"
                                className="relative w-full px-4 py-3 bg-gray-800 text-gray-100 placeholder-gray-400 border border-transparent rounded-lg focus:outline-none focus:placeholder-transparent z-10 min-h-[120px] transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Related Sites */}
                    <div className="relative group">
                        <label className="block text-md font-medium text-gray-300 mb-2">
                            Related Sites (comma-separated)
                        </label>
                        <div className="relative">
                            <div
                                className={`absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 
                                    rounded-lg opacity-0 ${isFocusedRelatedLinks ? "opacity-100" : "group-hover:opacity-100"
                                    } transition-opacity duration-300`}
                            ></div>
                            <input
                                type="text"
                                value={editedTodo.relatedSites?.join(", ") || ""}
                                onFocus={() => setIsFocusedRelatedLinks(true)}
                                onBlur={() => setIsFocusedRelatedLinks(false)}
                                onChange={(e) =>
                                    setEditedTodo((prev) => ({
                                        ...prev,
                                        relatedSites: e.target.value.split(",").map((site) => site.trim()),
                                    }))
                                }
                                placeholder="https://example.com, https://another.com"
                                className="relative w-full px-4 py-3 bg-gray-800 text-gray-100 placeholder-gray-400 border border-transparent rounded-lg focus:outline-none focus:placeholder-transparent z-10 transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Created Date */}
                    <div>
                        <label className="block text-md font-medium text-gray-300 mb-2">
                            Created At
                        </label>
                        <input
                            type="text"
                            value={new Date(editedTodo.createdAt).toLocaleString()}
                            disabled
                            className="w-full px-4 py-3 bg-gray-800 text-gray-400 border border-transparent rounded-lg"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-md font-medium text-gray-300 mb-2">
                            Priority
                        </label>
                        <div className="flex gap-4">
                            {["Low", "Medium", "High"].map((level) => (
                                <label key={level} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={level}
                                        checked={editedTodo.priority === level}
                                        onChange={(e) =>
                                            setEditedTodo((prev) => ({
                                                ...prev,
                                                priority: e.target.value as 'Low' | 'Medium' | 'High',
                                            }))
                                        }
                                        className="form-radio text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-300">{level}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-5 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 bg-gradient-to-r from-gray-800 to-gray-600 text-gray-300 rounded-lg hover:brightness-125 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:brightness-110 transition-all duration-300 transform"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTodoDialog;