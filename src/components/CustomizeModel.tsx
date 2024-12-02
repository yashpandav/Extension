import React, { Dispatch, SetStateAction, useState } from "react";

const backgroundOptions = [
    { id: "nature", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },  // Nature image
    { id: "city", url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0" },    // City image
    { id: "abstract", url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8" }, // Abstract image
    { id: "minimal", url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b" },  // Minimal image
    { id: "mountain", url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0" },  // Mountain image
    { id: "forest", url: "https://images.unsplash.com/photo-1496265958982-09cd7002f72e" },   // Forest image
    { id: "ocean", url: "https://images.unsplash.com/photo-1531164447027-92291d7d16a5" },    // Ocean image
    { id: "desert", url: "https://images.unsplash.com/photo-1521747116042-c07a13410b27" },   // Desert image
    { id: "skyline", url: "https://images.unsplash.com/photo-1501594907350-45fe557ae674" },  // Skyline image
    { id: "beach", url: "https://images.unsplash.com/photo-1517189286-417cc738eb1d" },       // Beach image
    { id: "snow", url: "https://images.unsplash.com/photo-1496850474522-1e3d9ab9b478" },      // Snow image
    { id: "urban", url: "https://images.unsplash.com/photo-1483431344439-22d6790324ea" },    // Urban image
    { id: "autumn", url: "https://images.unsplash.com/photo-1520501714569-d2068cd388e6" },   // Autumn image
    { id: "countryside", url: "https://images.unsplash.com/photo-1568873600-d95ffb9a3e7b" }, // Countryside image
    { id: "river", url: "https://images.unsplash.com/photo-1492567787665-d2577a79ecad" },    // River image
    { id: "lake", url: "https://images.unsplash.com/photo-1554020912-4410eb0ab80b" },        // Lake image
    { id: "forest_path", url: "https://images.unsplash.com/photo-1524174761801-041cd0e50331" }, // Forest Path image
    { id: "night", url: "https://images.unsplash.com/photo-1454887911039-c5c3eb6a3e4f" },     // Night image
    { id: "morning", url: "https://images.unsplash.com/photo-1464331183032-3e0bda46c7e4" },   // Morning image
    { id: "custom", url: "" }  // Option for custom image upload
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

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-[700px] flex">

                {/* Left Section with Text */}
                <div className="w-1/3 flex flex-col items-start space-y-4">
                    <button
                        className={`text-lg font-semibold ${activeSection === "background" ? "text-blue-500" : "text-black"}`}
                        onClick={() => setActiveSection("background")}
                    >
                        Background Image
                    </button>
                    <button
                        className={`text-lg font-semibold ${activeSection === "color" ? "text-blue-500" : "text-black"}`}
                        onClick={() => setActiveSection("color")}
                    >
                        Overlay Color
                    </button>
                </div>

                {/* Right Section with Content */}
                <div className="w-2/3">
                    {activeSection === "background" && (
                        <div>
                            <label className="block font-medium mb-2">Background Image:</label>
                            <div className="grid grid-cols-4 gap-2">
                                {backgroundOptions.map((bg) => (
                                    <div
                                        key={bg.id}
                                        className={`cursor-pointer rounded overflow-hidden ${selectedBackground === bg.url ? "ring-2 ring-blue-500" : ""
                                            }`}
                                        onClick={() => {
                                            setSelectedBackground(bg.url);
                                            setCustomBackgroundUrl("");
                                        }}
                                    >
                                        {bg.id === "custom" ? (
                                            <input
                                                type="file"
                                                className="h-20 w-full cursor-pointer"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        setSelectedBackground(
                                                            URL.createObjectURL(e.target.files[0])
                                                        );
                                                        setCustomBackgroundUrl(
                                                            URL.createObjectURL(e.target.files[0])
                                                        );
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={bg.url}
                                                alt={`Background ${bg.id}`}
                                                className="w-full h-20 object-cover"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === "color" && (
                        <div>
                            <label className="block font-medium mb-2">Overlay Color:</label>
                            <div className="grid grid-cols-4 gap-2">
                                {colorOptions.map((colorOption) => (
                                    <div
                                        key={colorOption.id}
                                        className={`h-10 rounded cursor-pointer ${colorOption.className} ${selectedColor === colorOption.className ? "ring-2 ring-blue-500" : ""
                                            }`}
                                        onClick={() => setSelectedColor(colorOption.className)}
                                        title={colorOption.label}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Save Changes Button */}
            </div>

            <button
                className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 mt-4"
                onClick={handleSaveChanges}
            >
                Save Changes
            </button>
        </div>
    );
};

export default CustomizeModel;
