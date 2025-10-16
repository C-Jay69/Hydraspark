
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBackend } from '../../hooks/useBackend';
import Message from './Message';
import TwoTruthsOneLie from '../icebreakers/TwoTruthsOneLie';
import WouldYouRather from '../icebreakers/WouldYouRather';
import QuickQuestions from '../icebreakers/QuickQuestions';

export default function Chat({ recipient }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { call, stream } = useBackend();
    const scrollAreaRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const { messages } = await call('chat.getMessages', { recipientId: recipient.id });
            setMessages(messages);
        };
        fetchMessages();

        const messageStream = stream('chat.messageStream', { recipientId: recipient.id });
        messageStream.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        return () => {
            messageStream.close();
        };
    }, [call, stream, recipient.id]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        await call('chat.sendMessage', {
            recipientId: recipient.id,
            text: newMessage,
        });
        setNewMessage('');
    };

    const handleIcebreakerSelect = async (text) => {
        await call('chat.sendMessage', {
            recipientId: recipient.id,
            text: text,
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <Message key={msg.id} message={msg} isMe={msg.senderId === recipient.id} />
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="p-4 border-t">
                <div className="flex space-x-2">
                    {/* Icebreaker suggestions */}
                </div>
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <Button type="submit">Send</Button>
                </form>
            </div>
        </div>
    );
}
