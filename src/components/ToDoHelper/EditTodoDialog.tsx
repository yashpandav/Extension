import React from 'react';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
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
    const [newRelatedSite, setNewRelatedSite] = useState("");
    const [showAddSiteField, setShowAddSiteField] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleSave = () => {
        const cleanedTodo = {
            ...editedTodo,
            relatedSites: editedTodo.relatedSites?.filter((site) => site.trim() !== "") || [],
        };
        onSave(cleanedTodo);
    };

    const handleAddRelatedSite = () => {
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (!urlPattern.test(newRelatedSite)) {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
            return;
        }

        if (newRelatedSite.trim()) {
            setEditedTodo((prev) => ({
                ...prev,
                relatedSites: [...(prev.relatedSites || []), newRelatedSite.trim()],
            }));
            setNewRelatedSite("");
            setShowAddSiteField(false);
        }
    };

    const handleRemoveSite = (index: number) => {
        setEditedTodo((prev) => ({
            ...prev,
            relatedSites: prev.relatedSites?.filter((_, i) => i !== index),
        }));
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
                <div className="flex justify-between items-center mb-6 border-b-2 border-gray-700 pb-3">
                    <h3 className="text-2xl font-semibold text-white">
                        Edit Task
                    </h3>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 text-white font-bold flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors shadow-lg"
                        aria-label="Close"
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
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            {/* Label Section */}
                            <label className="text-md font-medium text-gray-300">
                                Related Sites
                            </label>

                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowAddSiteField(!showAddSiteField)}
                                className="w-10 h-10 text-white font-bold flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors shadow-lg"
                                aria-label={showAddSiteField ? "Close Add Related Site" : "Add Related Site"}
                            >
                                {showAddSiteField ? <X /> : <Plus />}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {editedTodo.relatedSites?.map((site, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-lg"
                                >
                                    {/* Link to redirect */}
                                    <a
                                        href={site}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline truncate hover:text-white/90 transition-colors duration-200"
                                    >
                                        {site}
                                    </a>

                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSite(index)}
                                        className="p-2 text-red-500 text-sm font-medium"
                                    >
                                        Remove
                                    </button>

                                </div>
                            ))}
                        </div>

                        {/* Add Site Input Field */}
                        {showAddSiteField && (
                            <div className="mt-4 flex gap-3 relative group">
                                <div
                                    className={`absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 
                rounded-lg opacity-0 ${isFocusedRelatedLinks ? "opacity-100" : "group-hover:opacity-100"} 
                transition-opacity duration-300 pointer-events-none`}
                                ></div>
                                <input
                                    type="url"
                                    value={newRelatedSite}
                                    onChange={(e) => setNewRelatedSite(e.target.value)}
                                    onFocus={() => setIsFocusedRelatedLinks(true)}
                                    onBlur={() => setIsFocusedRelatedLinks(false)}
                                    placeholder="Enter URL (e.g., https://example.com)"
                                    className={`relative z-10 flex-1 px-4 py-3 bg-gray-800 text-gray-100 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring-2 
                ${showTooltip ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-blue-500"}`}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddRelatedSite}
                                    className="relative z-10 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                                >
                                    Add
                                </button>
                                {showTooltip && (
                                    <div className="absolute top-12 left-0 bg-red-500 text-white text-sm px-4 py-2 rounded shadow-lg">
                                        Please enter a valid URL
                                    </div>
                                )}
                            </div>
                        )}
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
                        <div className="flex gap-6">
                            {["Low", "Medium", "High"].map((level) => (
                                <label
                                    key={level}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={level}
                                        checked={editedTodo.priority === level}
                                        onChange={(e) =>
                                            setEditedTodo((prev) => ({
                                                ...prev,
                                                priority: e.target.value as "Low" | "Medium" | "High",
                                            }))
                                        }
                                        className="hidden peer"
                                    />
                                    <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center peer-checked:border-transparent peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 peer-checked:ring-1 peer-checked:ring-blue-400 transition-all duration-300"></span>
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