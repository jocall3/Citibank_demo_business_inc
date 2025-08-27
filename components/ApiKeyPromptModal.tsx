import React, { useState } from 'react';
import { useGlobalState } from '../contexts/GlobalStateContext.tsx';
import { useVaultModal } from '../contexts/VaultModalContext.tsx';
import { saveCredential } from '../services/vaultService.ts';
import { initializeAiClient } from '../services/aiService.ts';
import { LoadingSpinner } from './shared/LoadingSpinner.tsx';
import { useNotification } from '../contexts/NotificationContext.tsx';

export const ApiKeyPromptModal: React.FC = () => {
    const { dispatch } = useGlobalState();
    const { requestUnlock } = useVaultModal();
    const { addNotification } = useNotification();
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim()) {
            addNotification('Please enter an API key.', 'error');
            return;
        }

        setIsLoading(true);

        try {
            // Ensure the vault is unlocked before saving
            const unlocked = await requestUnlock();
            if (!unlocked) {
                addNotification('Vault must be unlocked to save the API key.', 'error');
                setIsLoading(false);
                return;
            }

            // Save the key and re-initialize the AI client
            await saveCredential('gemini_api_key', apiKey);
            await initializeAiClient();

            addNotification('API Key saved successfully!', 'success');
            dispatch({ type: 'SET_API_KEY_MISSING', payload: false });

        } catch (error) {
            addNotification(error instanceof Error ? error.message : 'An unknown error occurred.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center fade-in">
            <div className="bg-surface border border-border rounded-lg shadow-2xl w-full max-w-md m-4 p-6 animate-pop-in">
                <h2 className="text-xl font-bold mb-2">Enter Gemini API Key</h2>
                <p className="text-sm text-text-secondary mb-4">
                    Your Gemini API key is required to power the AI features. It will be stored securely and encrypted in your browser's local storage.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="api-key-input" className="block text-sm font-medium">API Key</label>
                        <input
                            id="api-key-input"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full mt-1 p-2 bg-background border border-border rounded-md"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="submit" disabled={isLoading} className="btn-primary px-4 py-2 min-w-[100px] flex justify-center">
                            {isLoading ? <LoadingSpinner /> : 'Save & Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};