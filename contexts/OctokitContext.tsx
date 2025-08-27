import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Octokit } from 'octokit';
import { initializeOctokit } from '../services/authService.ts';
import { getDecryptedCredential } from '../services/vaultService.ts';
import { useGlobalState } from './GlobalStateContext.tsx';
import { useVaultModal } from './VaultModalContext.tsx';
import { useNotification } from './NotificationContext.tsx';

interface OctokitContextType {
    octokit: Octokit | null;
    reinitialize: () => Promise<void>;
}

const OctokitContext = createContext<OctokitContextType | undefined>(undefined);

export const useOctokit = (): OctokitContextType => {
    const context = useContext(OctokitContext);
    if (!context) {
        throw new Error('useOctokit must be used within an OctokitProvider');
    }
    return context;
};

export const OctokitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [octokit, setOctokit] = useState<Octokit | null>(null);
    const { state, dispatch } = useGlobalState();
    const { user, vaultState } = state;
    const { requestUnlock } = useVaultModal();
    const { addNotification } = useNotification();
    
    const initialize = useCallback(async () => {
        if (!user) {
            setOctokit(null);
            return;
        }

        let isVaultUnlocked = vaultState.isUnlocked;

        if (!isVaultUnlocked) {
            const unlocked = await requestUnlock();
            if (!unlocked) {
                setOctokit(null);
                return;
            }
        }

        try {
            const token = await getDecryptedCredential('github_pat');
            if (token) {
                const client = initializeOctokit(token);
                setOctokit(client);
            } else {
                setOctokit(null); // No token stored, so no client.
            }
        } catch (e) {
            if (e instanceof Error && e.message.includes('Decryption failed')) {
                 dispatch({ type: 'SET_VAULT_STATE', payload: { isUnlocked: false } });
            }
            addNotification('Failed to initialize GitHub client.', 'error');
            setOctokit(null);
        }

    }, [user, vaultState.isUnlocked, requestUnlock, addNotification, dispatch]);

    useEffect(() => {
        // Initialize when the user logs in or vault state changes to unlocked
        if (user && vaultState.isUnlocked) {
            initialize();
        } else {
            setOctokit(null);
        }
    }, [user, vaultState.isUnlocked, initialize]);

    return (
        <OctokitContext.Provider value={{ octokit, reinitialize: initialize }}>
            {children}
        </OctokitContext.Provider>
    );
};