import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Main: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✖</button>
                {children}
            </div>
        </div>
    );
};

export default Main; 