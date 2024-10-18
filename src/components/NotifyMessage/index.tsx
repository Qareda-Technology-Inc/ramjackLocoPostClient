import React from 'react';
import Toastify from "toastify-js";

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    duration?: number;
}

const Main: React.FC<NotificationProps> = ({ message, type, duration = 3000 }) => {
    const showToast = () => {
        const toastElement = document.createElement('div');
        toastElement.className = `toast ${type}`; // You can style this based on type

        toastElement.innerHTML = `<div class="font-medium">${message}</div>`;

        Toastify({
            node: toastElement,
            duration,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
        }).showToast();
    };

    React.useEffect(() => {
        showToast();
    }, [message]);

    return null; // This component doesn't render anything itself
};

export default Main;
