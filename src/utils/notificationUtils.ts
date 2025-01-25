import Toastify from "toastify-js";

export const showNotification = (isSuccess: boolean, message: string) => {
    const notificationId = isSuccess ? "#success-notification-content" : "#failed-notification-content";
    const notificationEl = document.querySelector(notificationId)?.cloneNode(true) as HTMLElement;

    if (notificationEl) {
        notificationEl.classList.remove("hidden");
        const messageEl = notificationEl.querySelector('.font-medium');
        if (messageEl) {
            messageEl.textContent = message;
        }

        Toastify({
            node: notificationEl,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
        }).showToast();
    }
}; 