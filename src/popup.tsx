import React, { useState, useEffect } from 'react';
import {
    Settings,
    Moon,
    Sun,
    Globe,
    Bell,
    Github,
    Linkedin,
    Code2,
    ExternalLink,
    Image,
    RotateCcw,
    Download,
    Star,
    Zap,
    Share2
} from 'lucide-react';
import { createRoot } from 'react-dom/client';

interface SocialLink {
    icon: React.ReactNode;
    label: string;
    url: string;
}

interface SettingOption {
    icon: React.ReactNode;
    label: string;
    description: string;
    action: () => void;
}

const Popup: React.FC = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

    useEffect(() => {
        chrome.storage.sync.get(['theme', 'customBackground'], (result) => {
            if (result.theme) setTheme(result.theme);
            if (result.customBackground) setBackgroundPreview(result.customBackground);
        });
    }, []);

    const socialLinks: SocialLink[] = [
        {
            icon: <Github className="w-5 h-5" />,
            label: 'GitHub',
            url: 'https://github.com/yourusername',
        },
        {
            icon: <Linkedin className="w-5 h-5" />,
            label: 'LinkedIn',
            url: 'https://linkedin.com/in/yourusername',
        },
        {
            icon: <Code2 className="w-5 h-5" />,
            label: 'Source',
            url: 'https://github.com/yourusername/smart-tab',
        },
    ];

    const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result as string;
                chrome.storage.sync.set({ customBackground: base64Image });
                setBackgroundPreview(base64Image);
            };
            reader.readAsDataURL(file);
        }
    };

    const settingOptions: SettingOption[] = [
        {
            icon: <Image className="w-5 h-5" />,
            label: 'Custom Background',
            description: 'Upload a local image',
            action: () => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.onchange = handleBackgroundUpload as any;
                fileInput.click();
            },
        },
        {
            icon: theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />,
            label: 'Toggle Theme',
            description: 'Switch between light and dark mode',
            action: () => {
                const newTheme = theme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                chrome.storage.sync.set({ theme: newTheme });
            },
        },
        {
            icon: <RotateCcw className="w-5 h-5" />,
            label: 'Reset Settings',
            description: 'Restore default configuration',
            action: () => {
                if (confirm('Reset all settings to default?')) {
                    chrome.storage.sync.clear();
                    setBackgroundPreview(null);
                    setTheme('light');
                }
            },
        }
    ];

    return (
        <div
            className={`
                w-96 p-6 rounded-2xl shadow-2xl 
                ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}
                transition-all duration-300 ease-in-out
            `}
        >
            <header className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <Globe className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Smart Tab
                    </h1>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`
                        p-2 rounded-full transition-all 
                        ${theme === 'dark'
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'}
                    `}
                >
                    <Settings className="w-6 h-6" />
                </button>
            </header>

            {showSettings ? (
                <div className="space-y-4">
                    {settingOptions.map((option, index) => (
                        <button
                            key={index}
                            onClick={option.action}
                            className={`
                                w-full flex items-center gap-4 p-3 rounded-xl 
                                transition-all duration-200
                                ${theme === 'dark'
                                    ? 'hover:bg-gray-800 text-gray-300'
                                    : 'hover:bg-gray-100 text-gray-700'}
                            `}
                        >
                            <div className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>{option.icon}</div>
                            <div className="text-left flex-1">
                                <div className="font-semibold">{option.label}</div>
                                <div className="text-sm opacity-70">{option.description}</div>
                            </div>
                        </button>
                    ))}
                    {backgroundPreview && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Background Preview</h3>
                            <img
                                src={backgroundPreview}
                                alt="Background Preview"
                                className="w-full h-24 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="mb-6 space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                            <h2 className="text-lg font-semibold">Features</h2>
                        </div>
                        <ul className={`list-disc pl-5 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>Personalized New Tab Experience</li>
                            <li>Weather & Productivity Tools</li>
                            <li>Customizable Interface</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                            <h2 className="text-lg font-semibold">Version</h2>
                        </div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            1.0.0 • Latest Release
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Share2 className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                            <h2 className="text-lg font-semibold">Connect</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                                        flex flex-col items-center p-3 rounded-xl 
                                        transition-all duration-200
                                        ${theme === 'dark'
                                            ? 'hover:bg-gray-800 text-gray-300'
                                            : 'hover:bg-gray-100 text-gray-700'}
                                    `}
                                >
                                    <div className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>{link.icon}</div>
                                    <span className="text-xs mt-1">{link.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

createRoot(document.getElementById('popup-root')!).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);

export default Popup;