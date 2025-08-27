import React, { useState, useEffect } from 'react';
import { TypographyLabIcon } from '../icons.tsx';

const popularFonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Raleway', 'Poppins', 'Nunito', 'Merriweather',
    'Playfair Display', 'Lora', 'Noto Sans', 'Ubuntu', 'PT Sans', 'Slabo 27px', 'Great Vibes', 'EB Garamond'
];

export const FontPreviewPicker: React.FC = () => {
    const [text, setText] = useState('The quick brown fox jumps over the lazy dog.');
    const [fontSize, setFontSize] = useState(24);

    useEffect(() => {
        const fontsToLoad = popularFonts.join('|').replace(/ /g, '+');
        const linkId = 'font-picker-stylesheet';
        let link = document.getElementById(linkId) as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = `https://fonts.googleapis.com/css?family=${fontsToLoad}:400,700&display=swap`;
    }, []);

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <TypographyLabIcon />
                    <span className="ml-3">Font Preview Picker</span>
                </h1>
                <p className="text-text-secondary mt-1">Enter your text and see how it looks with different fonts.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-grow">
                    <label htmlFor="preview-text" className="text-sm font-medium">Preview Text</label>
                    <input
                        id="preview-text"
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="w-full mt-1 p-2 bg-surface border border-border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="font-size" className="text-sm font-medium">Font Size ({fontSize}px)</label>
                    <input
                        id="font-size"
                        type="range"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={e => setFontSize(Number(e.target.value))}
                        className="w-full mt-1"
                    />
                </div>
            </div>

            <div className="flex-grow bg-surface border border-border rounded-lg p-4 overflow-y-auto">
                <div className="space-y-4">
                    {popularFonts.map(font => (
                        <div key={font} className="border-b border-border pb-2">
                            <p className="text-sm text-text-secondary">{font}</p>
                            <p style={{ fontFamily: `'${font}', sans-serif`, fontSize: `${fontSize}px` }}>
                                {text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};