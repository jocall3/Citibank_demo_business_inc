import React, { useState, useEffect, useCallback } from 'react';
import { generateMockData } from '../../services/aiService.ts';
import { startMockServer, stopMockServer, setMockRoutes, isMockServerRunning } from '../../services/mocking/mockServer.ts';
import { saveMockCollection, getAllMockCollections } from '../../services/mocking/db.ts';
import { ServerStackIcon, SparklesIcon, PlusIcon } from '../icons.tsx';
import { LoadingSpinner } from '../shared/index.tsx';

interface MockCollection {
    id: string;
    schemaDescription: string;
    data: any[];
}

interface MockRoute {
    id: number;
    path: string;
    method: 'GET' | 'POST';
    collectionId: string;
}

const exampleSchema = "a user with an id, name, email, and a nested address object containing a city and country";

export const ApiMockGenerator: React.FC = () => {
    const [schema, setSchema] = useState(exampleSchema);
    const [count, setCount] = useState(5);
    const [collectionName, setCollectionName] = useState('users');
    const [collections, setCollections] = useState<MockCollection[]>([]);
    const [generatedData, setGeneratedData] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isServerLoading, setIsServerLoading] = useState(false);
    const [error, setError] = useState('');
    const [isServerRunning, setIsServerRunning] = useState(isMockServerRunning());
    const [routes, setRoutes] = useState<MockRoute[]>([{ id: 1, path: '/api/users', method: 'GET', collectionId: 'users' }]);

    useEffect(() => {
        const loadCollections = async () => {
            const storedCollections = await getAllMockCollections();
            setCollections(storedCollections);
        };
        loadCollections();
    }, []);

    const handleGenerate = async () => {
        if (!schema.trim() || !collectionName.trim()) {
            setError('Schema description and collection name are required.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const data = await generateMockData(schema, count);
            setGeneratedData(data);
            const collectionId = collectionName.toLowerCase().replace(/\s/g, '-');
            await saveMockCollection({ id: collectionId, schemaDescription: schema, data });
            setCollections(await getAllMockCollections());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate data.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleServerToggle = async () => {
        setIsServerLoading(true);
        if (isServerRunning) {
            await stopMockServer();
            setIsServerRunning(false);
        } else {
            try {
                await startMockServer();
                setIsServerRunning(true);
                updateRoutesOnServer();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Could not start server.');
            }
        }
        setIsServerLoading(false);
    };

    const updateRoutesOnServer = useCallback(() => {
        const mockRoutes = routes.map(route => {
            const collection = collections.find(c => c.id === route.collectionId);
            return {
                path: route.path,
                method: route.method,
                response: {
                    status: 200,
                    body: collection ? collection.data : { message: `No data found for collection '${route.collectionId}'.` }
                }
            };
        });
        setMockRoutes(mockRoutes as any);
    }, [routes, collections]);


    useEffect(() => {
        if (isServerRunning) {
            updateRoutesOnServer();
        }
    }, [routes, collections, isServerRunning, updateRoutesOnServer]);

    const handleRouteUpdate = (id: number, field: keyof MockRoute, value: string) => {
        setRoutes(routes.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleAddRoute = () => {
        const newRoute: MockRoute = {
            id: Date.now(),
            path: '/api/new-route',
            method: 'GET',
            collectionId: collections.length > 0 ? collections[0].id : ''
        };
        setRoutes([...routes, newRoute]);
    };
    
    const getServerStatusText = () => {
        if (isServerLoading) return 'Starting...';
        return isServerRunning ? 'Server Running' : 'Server Stopped';
    }

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary">
            <header className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold flex items-center"><ServerStackIcon /><span className="ml-3">AI API Mock Server</span></h1>
                    <p className="text-text-secondary mt-1">Generate and serve mock API data locally using a service worker.</p>
                </div>
                <button onClick={handleServerToggle} disabled={isServerLoading} className={`px-4 py-2 rounded-md font-semibold flex items-center gap-2 ${isServerRunning ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    <span className={`w-3 h-3 rounded-full ${isServerRunning ? 'bg-green-500' : 'bg-gray-400'} ${isServerLoading ? 'animate-pulse' : ''}`}></span>
                    {getServerStatusText()}
                </button>
            </header>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="lg:col-span-1 flex flex-col gap-4 bg-surface p-4 border border-border rounded-lg">
                    <h3 className="text-lg font-bold">1. Generate Data</h3>
                    <div><label className="text-sm">Describe the data schema</label><textarea value={schema} onChange={e => setSchema(e.target.value)} className="w-full mt-1 p-2 bg-background border border-border rounded" rows={4}/></div>
                    <div className="flex gap-2">
                        <div className="flex-grow"><label className="text-sm">Collection Name</label><input type="text" value={collectionName} onChange={e => setCollectionName(e.target.value)} className="w-full mt-1 p-2 bg-background border border-border rounded"/></div>
                        <div><label className="text-sm">Count</label><input type="number" value={count} onChange={e => setCount(Number(e.target.value))} className="w-20 mt-1 p-2 bg-background border border-border rounded"/></div>
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="btn-primary py-2 flex items-center justify-center gap-2">{isLoading ? <LoadingSpinner/> : <><SparklesIcon/> Generate & Save</>}</button>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>

                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                   <div className="bg-surface p-4 border border-border rounded-lg flex-grow flex flex-col min-h-0">
                        <h3 className="text-lg font-bold mb-2">2. View Data & Configure Routes</h3>
                        <div className="flex-grow grid grid-cols-2 gap-4 min-h-0">
                            <div className="overflow-y-auto">
                                <h4 className="font-semibold text-sm mb-1">Saved Collections</h4>
                                {collections.map(c => <div key={c.id} className="text-xs p-2 bg-background rounded border border-border mb-1">{c.id} ({c.data.length} items)</div>)}
                                <h4 className="font-semibold text-sm mb-1 mt-2">Last Generated Data</h4>
                                <pre className="text-xs p-2 bg-background rounded border border-border whitespace-pre-wrap">{generatedData ? JSON.stringify(generatedData, null, 2) : 'No data generated yet.'}</pre>
                            </div>
                            <div className="overflow-y-auto">
                                <h4 className="font-semibold text-sm mb-1">Mock Routes</h4>
                                {routes.map((r) => (
                                <div key={r.id} className="grid grid-cols-3 gap-1 items-center mb-1">
                                    <input type="text" value={r.path} onChange={e => handleRouteUpdate(r.id, 'path', e.target.value)} className="col-span-2 p-1 text-xs bg-background border rounded" />
                                    <select value={r.collectionId} onChange={e => handleRouteUpdate(r.id, 'collectionId', e.target.value)} className="p-1 text-xs bg-background border rounded">
                                        <option value="">Select Collection</option>
                                        {collections.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                                    </select>
                                </div>
                                ))}
                                <button onClick={handleAddRoute} className="text-xs mt-2 p-1 bg-gray-100 rounded hover:bg-gray-200"><PlusIcon/></button>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
    );
};