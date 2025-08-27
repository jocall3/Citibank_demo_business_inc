import React, { useState } from 'react';
import { PhotoIcon } from '../icons.tsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';

interface MoodboardItem {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
}

const colors = ['bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-pink-200', 'bg-purple-200', 'bg-orange-200'];
const textColors = ['text-yellow-800', 'text-green-800', 'text-blue-800', 'text-pink-800', 'text-purple-800', 'text-orange-800'];

export const ProjectMoodboard: React.FC = () => {
    const [items, setItems] = useLocalStorage<MoodboardItem[]>('devcore_moodboard_items', []);
    const [dragging, setDragging] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);

    const addItem = () => {
        const newItem: MoodboardItem = {
            id: Date.now(),
            text: 'New Idea',
            x: 50,
            y: 50,
            color: colors[items.length % colors.length],
        };
        setItems([...items, newItem]);
    };
    
    const deleteItem = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setItems(items.filter((n) => n.id !== id));
    };

    const updateItem = (id: number, updates: Partial<MoodboardItem>) => {
        setItems(items.map((n) => n.id === id ? { ...n, ...updates } : n));
    };

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
        if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
        const noteElement = e.currentTarget;
        const rect = noteElement.getBoundingClientRect();
        setDragging({ id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dragging) return;
        const boardRect = e.currentTarget.getBoundingClientRect();
        updateItem(dragging.id, {
            x: e.clientX - dragging.offsetX - boardRect.left,
            y: e.clientY - dragging.offsetY - boardRect.top
        });
    };

    const onMouseUp = () => setDragging(null);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6 flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold flex items-center"><PhotoIcon /><span className="ml-3">Project Moodboard</span></h1>
                    <p className="text-text-secondary mt-1">A visual space to gather ideas, images, and notes.</p>
                </div>
                <button onClick={addItem} className="btn-primary px-6 py-2">Add Item</button>
            </header>
            <div
                className="relative flex-grow bg-background border-2 border-dashed border-border rounded-lg overflow-hidden"
                onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`group absolute w-48 h-48 p-2 flex flex-col shadow-lg cursor-grab active:cursor-grabbing rounded-md transition-transform duration-100 border border-black/20 ${item.color} ${textColors[colors.indexOf(item.color)]}`}
                        style={{ top: item.y, left: item.x, transform: dragging?.id === item.id ? 'scale(1.05)' : 'scale(1)' }}
                        onMouseDown={e => onMouseDown(e, item.id)}
                    >
                        <button onClick={(e) => deleteItem(item.id, e)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-700 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all">&times;</button>
                        <textarea
                            value={item.text}
                            onChange={(e) => updateItem(item.id, { text: e.target.value })}
                            className="w-full h-full bg-transparent resize-none focus:outline-none font-medium p-1"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};