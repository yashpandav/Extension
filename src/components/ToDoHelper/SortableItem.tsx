import React, { useState } from "react";
import { TodoItem } from "../TodoList";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, Circle, CircleMinus, CircleX } from "lucide-react";

const SortableItem = ({
    todo,
    onToggle,
    onRemove,
    onEdit,
}: {
    todo: TodoItem;
    onToggle: () => void;
    onRemove: () => void;
    onEdit: () => void;
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

    const [isHovered, setIsHovered] = useState(false);

    const getPriorityStyles = (priority: "Low" | "Medium" | "High") => {
        switch (priority) {
            case "High":
                return "bg-red-500";
            case "Medium":
                return "bg-yellow-400";
            case "Low":
            default:
                return "bg-green-500";
        }
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`relative flex items-center p-4 mb-3 rounded-lg transition-all shadow-md ${todo.completed
                ? "bg-gray-100 border-gray-200 text-gray-500"
                : "bg-white border-blue-200"
                }`}
        >

            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                title={todo.priority}
                className={`absolute left-0 w-3 h-full rounded-lg cursor-grab active:cursor-grabbing ${getPriorityStyles(todo.priority)}`}
            ></button>

            {/* Completion Toggle */}
            <button
                onClick={onToggle}
                className={`mr-1 p-2 rounded-full ${todo.completed ? "bg-green-100" : "hover:bg-green-100"}`}
            >
                {todo.completed ? (
                    <CheckCircle2 className="text-green-500" />
                ) : (
                    <Circle className="text-gray-400" />
                )}
            </button>

            {/* Task Text */}
            <div
                className="flex-1 flex items-center cursor-pointer"
                onClick={onEdit}
            >
                <span
                    className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                >
                    {todo.text}
                </span>
            </div>

            {/* Remove Button */}
            <button
                onClick={onRemove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="text-gray-500 hover:text-gray-600 transition"
            >
                {isHovered ? <CircleX /> : <CircleMinus />}
            </button>
        </li>
    );
};

export default SortableItem;
