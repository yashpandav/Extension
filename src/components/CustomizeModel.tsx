import React, { Dispatch, SetStateAction, useState } from "react";

const backgroundOptions = [
    { id: "nature", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },
    { id: "abstract", url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8" },
    { id: "minimal", url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b" },
    { id: "space", url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa" },
    { id: "beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { id: "desert", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    { id: "pattern", url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b" },
    { id: "retro", url: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5" },
    { id: "tech", url: "https://images.unsplash.com/photo-1518770660439-4636190af475" },
    { id: "blue_light", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
    { id: "coding_screen", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" },
    { id: "cybersecurity", url: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87" },
    { id: "tech_workspace", url: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f" },
    { id: "iot_devices", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" },
    { id: "custom", url: "" },
];

const colorOptions = [
    { id: "light", className: "bg-white/30", label: "Light" },
    { id: "dark", className: "bg-black/30", label: "Dark" },
    { id: "blue", className: "bg-blue-400/30", label: "Blue" },
    { id: "red", className: "bg-red-400/30", label: "Red" },
    { id: "green", className: "bg-green-400/30", label: "Green" },
    { id: "purple", className: "bg-purple-400/30", label: "Purple" },
    { id: "yellow", className: "bg-yellow-400/30", label: "Yellow" },
    { id: "pink", className: "bg-pink-400/30", label: "Pink" },
];

interface CustomizeModelProps {
    setBackground: Dispatch<SetStateAction<string>>;
    setColor: Dispatch<SetStateAction<string>>;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    color: string;
    background: string;
}

export const CustomizeModel = ({
    setBackground,
    setColor,
    setIsModalOpen,
    color,
    background,
}: CustomizeModelProps) => {
    const [selectedBackground, setSelectedBackground] = useState(background);
    const [selectedColor, setSelectedColor] = useState(color);
    const [customBackgroundUrl, setCustomBackgroundUrl] = useState("");
    const [activeSection, setActiveSection] = useState<"background" | "color">("background");

    const handleSaveChanges = () => {
        setBackground(selectedBackground);
        setColor(selectedColor);
        setIsModalOpen(false);
    };

    const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedBackground(reader.result as string);
                setCustomBackgroundUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-black/80 flex items-center justify-center h-auto">
            <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-[1000px] max-w-full">
                <div className="flex space-x-8 relative">
                    {/* Navigation Sidebar */}
                    <div className="w-1/5 pr-6 border-r border-gray-200">
                        <div className="space-y-4">
                            <button
                                className={`w-full text-left text-lg font-medium py-3 px-4 rounded-lg transition-all duration-300 ${activeSection === "background"
                                    ? "bg-blue-100 text-blue-700"
                                    : "hover:bg-gray-100"}`}
                                onClick={() => setActiveSection("background")}
                            >
                                Background Image
                            </button>
                            <button
                                className={`w-full text-left text-lg font-medium py-3 px-4 rounded-lg transition-all duration-300 ${activeSection === "color"
                                    ? "bg-blue-100 text-blue-700"
                                    : "hover:bg-gray-100"}`}
                                onClick={() => setActiveSection("color")}
                            >
                                Overlay Color
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="w-auto h-auto pl-6">
                        {activeSection === "background" && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Background</h2>
                                <div className="grid grid-cols-5 gap-6">
                                    {backgroundOptions.map((bg) => (
                                        <div
                                            key={bg.id}
                                            className={`relative group rounded-xl shadow-md transition-all duration-300 ${selectedBackground === bg.url || (bg.id === 'custom' && customBackgroundUrl)
                                                ? "ring-4 ring-blue-500 scale-105"
                                                : "hover:scale-105"}`}
                                        >
                                            {bg.id === "custom" ? (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        onChange={handleCustomImageUpload}
                                                    />
                                                    <div className="h-max bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="text-blue-800">Upload Custom Image</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={bg.url}
                                                    alt={`Background ${bg.id}`}
                                                    className="w-max h-max"
                                                    onClick={() => {
                                                        setSelectedBackground(bg.url);
                                                        setCustomBackgroundUrl("");
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === "color" && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Overlay Color</h2>
                                <div className="grid grid-cols-4 gap-6">
                                    {colorOptions.map((colorOption) => (
                                        <button
                                            key={colorOption.id}
                                            className={`w-full p-6 rounded-lg transition-all duration-300 ${selectedColor === colorOption.className
                                                ? "border-4 border-blue-500"
                                                : "hover:scale-105"}`}
                                            style={{ backgroundColor: colorOption.className }}
                                            onClick={() => setSelectedColor(colorOption.className)}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-between">
                            <button
                                className="bg-gray-300 px-6 py-2 rounded-lg text-gray-800 hover:bg-gray-400 transition duration-300"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 px-6 py-2 rounded-lg text-white hover:bg-blue-600 transition duration-300"
                                onClick={handleSaveChanges}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
