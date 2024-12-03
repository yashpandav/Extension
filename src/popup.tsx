import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {CustomizeModel} from './components/CustomizeModel';
const Popup: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [background, setBackground] = useState('');
    const [color, setColor] = useState('');

    if (isModalOpen) {
        return (
            <div className='h-auto w-auto flex justify-center item-center'>
                <CustomizeModel
                    setBackground={setBackground}
                    setColor={setColor}
                    setIsModalOpen={setIsModalOpen}
                    background={background}
                    color={color}
                />

            </div>
        )
    }

    return (
        <div className="p-6 rounded-2xl shadow-2xl bg-white">
            <header className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold">Smart Tab</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                >
                    Customize
                </button>
            </header>
        </div>
    );
};

createRoot(document.getElementById('popup-root')!).render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);

export default Popup;