import React from "react";
import Alert from "./Base/Alert";

interface ShowMessageProps {
    message: string; // Type for message
    isSuccess: boolean; // Type for isSuccess
}

const ShowMessage: React.FC<ShowMessageProps> = ({ message, isSuccess }) => {
    return (
        <Alert variant={isSuccess ? "success" : "danger"} className="mb-2">
            {message}
        </Alert>
    );
};

export default ShowMessage;
