/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const SERVICE_WORKER_URL = '/mock-service-worker.js';
let registration: ServiceWorkerRegistration | null = null;

export const startMockServer = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        if (!('serviceWorker' in navigator)) {
            return reject(new Error('Service workers are not supported in this browser.'));
        }
        
        try {
            registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);
            
            if (registration.installing) {
                registration.installing.addEventListener('statechange', () => {
                    if (registration.installing?.state === 'installed') {
                        // The new worker is installed, now wait for it to activate
                    }
                });
            }

            if (registration.active) {
                 console.log('Mock Service Worker already active.');
                 return resolve();
            }

            // Wait for the worker to become active
            await navigator.serviceWorker.ready;
            console.log('Mock Service Worker registered and ready with scope:', registration.scope);
            resolve();
            
        } catch (error) {
            console.error('Mock Service Worker registration failed:', error);
            reject(new Error('Could not start mock server.'));
        }
    });
};

export const stopMockServer = async (): Promise<void> => {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
        await reg.unregister();
        registration = null;
        console.log('Mock Service Worker unregistered.');
    }
};

export const isMockServerRunning = (): boolean => {
    // Check registration and controller status to determine if server is active.
    return !!registration && !!navigator.serviceWorker.controller;
};

interface MockRoute {
    path: string; // e.g., /api/users/*
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    response: {
        status: number;
        body: any;
        headers?: Record<string, string>;
    }
}

export const setMockRoutes = (routes: MockRoute[]): void => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SET_ROUTES',
            routes
        });
        console.log('Mock routes sent to service worker:', routes);
    } else {
        console.warn('Mock server is not active. Routes were not set.');
    }
};