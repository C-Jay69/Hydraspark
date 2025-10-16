
import React from 'react';

export default function Message({ message, isMe }) {
    const messageClass = isMe ? 'justify-end' : 'justify-start';
    const bubbleClass = isMe ? 'bg-blue-500 text-white' : 'bg-gray-200';

    return (
        <div className={`flex ${messageClass}`}>
            <div className={`rounded-lg px-4 py-2 max-w-xs ${bubbleClass}`}>
                {message.text}
            </div>
        </div>
    );
}
