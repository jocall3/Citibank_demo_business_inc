// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import React from 'react';
import { signInWithGoogle } from '../services/googleAuthService.ts';

export const LoginView: React.FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-background">
            <div className="text-center bg-surface p-8 rounded-lg border border-border max-w-md shadow-lg animate-pop-in">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary mx-auto mb-4">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-2xl font-bold text-text-primary">Welcome to DevCore AI</h1>
                <p className="text-text-secondary my-4">
                    Please sign in with your Google account to securely access your workspace tools and manage API connections.
                </p>
                <button 
                    onClick={signInWithGoogle} 
                    className="btn-primary w-full px-6 py-3 flex items-center justify-center gap-2 mx-auto"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};