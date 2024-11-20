import React from 'react';
import { createRoot } from 'react-dom/client';
import { Settings, Moon, Sun, Globe, Bell } from 'lucide-react';
import './popup.css';

function Popup() {
    const [theme, setTheme] = React.useState('light');
    const [notifications, setNotifications] = React.useState(true);

    return (
        <div className="popup-container">
            <header className="popup-header">
                <Settings className="w-5 h-5" />
                <h1>Smart Tab Settings</h1>
            </header>

            <div className="settings-group">
                <div className="setting-item">
                    <div className="setting-label">
                        <Globe className="w-4 h-4" />
                        <span>Background Style</span>
                    </div>
                    <select className="setting-control">
                        <option value="dynamic">Dynamic Time-based</option>
                        <option value="solid">Solid Color</option>
                        <option value="custom">Custom Image</option>
                    </select>
                </div>

                <div className="setting-item">
                    <div className="setting-label">
                        {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span>Theme</span>
                    </div>
                    <button
                        className="theme-toggle"
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    >
                        {theme === 'light' ? 'Light' : 'Dark'}
                    </button>
                </div>

                <div className="setting-item">
                    <div className="setting-label">
                        <Bell className="w-4 h-4" />
                        <span>Notifications</span>
                    </div>
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <footer className="popup-footer">
                <button className="save-button">Save Changes</button>
            </footer>
        </div>
    );
}

createRoot(document.getElementById('popup-root')).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);