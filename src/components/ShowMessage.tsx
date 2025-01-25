import React from "react";

interface ShowMessageProps {
    message: string; // Type for message
    isSuccess: boolean; // Type for isSuccess
}

const ShowMessage: React.FC<ShowMessageProps> = ({ message, isSuccess }) => {
    return (
        <div className="bg-green-500 text-white p-2 rounded-md">
            {message}
        </div>
    );
};

export default ShowMessage;
