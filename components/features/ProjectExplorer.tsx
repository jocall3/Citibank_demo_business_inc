// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import React, { useState, useEffect, useCallback } from 'react';
import { useGlobalState } from '../../contexts/GlobalStateContext.tsx';
import { useNotification } from '../../contexts/NotificationContext.tsx';
import { useOctokit } from '../../contexts/OctokitContext.tsx';
import { getRepos, getRepoTree, getFileContent, commitFiles } from '../../services/githubService.ts';
import { generateCommitMessageStream } from '../../services/index.ts';
import type { Repo, FileNode } from '../../types.ts';
import { FolderIcon, DocumentIcon } from '../icons.tsx';
import { LoadingSpinner } from '../shared/index.tsx';
import * as Diff from 'diff';

const FileTree: React.FC<{ node: FileNode, onFileSelect: (path: string, name: string) => void, activePath: string | null }> = ({ node, onFileSelect, activePath }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (node.type === 'file') {
        const isActive = activePath === node.path;
        return (
            <div
                className={`flex items-center space-x-2 pl-4 py-1 cursor-pointer rounded ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                onClick={() => onFileSelect(node.path, node.name)}
            >
                <DocumentIcon />
                <span>{node.name}</span>
            </div>
        );
    }

    return (
        <div>
            <div
                className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</div>
                <FolderIcon />
                <span className="font-semibold">{node.name}</span>
            </div>
            {isOpen && node.children && (
                <div className="pl-4 border-l border-border ml-3">
                    {node.children.map(child => <FileTree key={child.path} node={child} onFileSelect={onFileSelect} activePath={activePath} />)}
                </div>
            )}
        </div>
    );
};

export const ProjectExplorer: React.FC = () => {
    const { state, dispatch } = useGlobalState();
    const { user, githubUser, selectedRepo, projectFiles } = state;
    const { addNotification } = useNotification();
    const { octokit, reinitialize } = useOctokit();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [isLoading, setIsLoading] = useState<'repos' | 'tree' | 'file' | 'commit' | null>(null);
    const [error, setError] = useState('');
    const [activeFile, setActiveFile] = useState<{ path: string; name: string; originalContent: string; editedContent: string} | null>(null);
    
    const handleApiError = useCallback((err: any) => {
        if (err.status === 401) {
            dispatch({ type: 'SET_GITHUB_USER', payload: null });
            addNotification('GitHub token is invalid or expired. Please update it in the Connections Hub.', 'error');
            setError('GitHub authentication failed. Please update your token.');
        } else {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        }
    }, [dispatch, addNotification]);
    
    useEffect(() => {
        if (!octokit && githubUser) {
            reinitialize();
        }
    }, [octokit, githubUser, reinitialize]);

    useEffect(() => {
        const loadRepos = async () => {
            if (user && githubUser && octokit) {
                setIsLoading('repos');
                setError('');
                try {
                    const userRepos = await getRepos(octokit);
                    setRepos(userRepos);
                } catch (err) {
                    handleApiError(err);
                } finally {
                    setIsLoading(null);
                }
            } else {
                setRepos([]);
            }
        };
        loadRepos();
    }, [user, githubUser, octokit, handleApiError]);

    const loadTree = useCallback(async (repoToLoad: { owner: { login: string }, name: string, full_name: string }) => {
        if (user && githubUser && octokit) {
            setIsLoading('tree');
            setError('');
            setActiveFile(null);
            try {
                const tree = await getRepoTree(octokit, repoToLoad.owner.login, repoToLoad.name);
                dispatch({ type: 'LOAD_PROJECT_FILES', payload: tree });
            } catch (err) {
                handleApiError(err);
            } finally {
                setIsLoading(null);
            }
        }
    }, [user, githubUser, octokit, dispatch, handleApiError]);

    // Re-fetches the tree if a repo is selected from a previous session
    useEffect(() => {
        if (selectedRepo && octokit && (!projectFiles || projectFiles.name !== selectedRepo.repo)) {
             loadTree({
                name: selectedRepo.repo,
                full_name: selectedRepo.full_name,
                owner: { login: selectedRepo.owner }
            });
        }
    }, [selectedRepo, projectFiles, octokit, loadTree]);

    const handleFileSelect = async (path: string, name: string) => {
        if (!selectedRepo || !octokit) return;
        setIsLoading('file');
        try {
            const content = await getFileContent(octokit, selectedRepo.owner, selectedRepo.repo, path);
            setActiveFile({ path, name, originalContent: content, editedContent: content });
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(null);
        }
    };

    const handleCommit = async () => {
        if (!activeFile || !selectedRepo || !octokit || activeFile.originalContent === activeFile.editedContent) return;

        setIsLoading('commit');
        setError('');
        try {
            const diff = Diff.createPatch(activeFile.path, activeFile.originalContent, activeFile.editedContent);
            
            const stream = generateCommitMessageStream(diff);
            let commitMessage = '';
            for await (const chunk of stream) { commitMessage += chunk; }
            
            const finalMessage = window.prompt("Confirm or edit commit message:", commitMessage);
            if (!finalMessage) {
                setIsLoading(null);
                return;
            }

            await commitFiles(
                octokit,
                selectedRepo.owner,
                selectedRepo.repo,
                [{ path: activeFile.path, content: activeFile.editedContent }],
                finalMessage
            );
            
            addNotification(`Successfully committed to ${selectedRepo.repo}`, 'success');
            setActiveFile(prev => prev ? { ...prev, originalContent: prev.editedContent } : null);

        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(null);
        }
    };
    
    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary p-4">
                <FolderIcon />
                <h2 className="text-lg font-semibold mt-2">Please Sign In</h2>
                <p>Sign in to explore your repositories.</p>
            </div>
        );
    }
    
    if (!githubUser) {
         return (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary p-4">
                <FolderIcon />
                <h2 className="text-lg font-semibold mt-2">Connect to GitHub</h2>
                <p>Please go to the "Connections" tab and provide a Personal Access Token to explore your repositories.</p>
            </div>
        );
    }

    const hasChanges = activeFile ? activeFile.originalContent !== activeFile.editedContent : false;

    return (
        <div className="h-full flex flex-col text-text-primary">
            <header className="p-4 border-b border-border flex-shrink-0">
                <h1 className="text-xl font-bold flex items-center"><FolderIcon /><span className="ml-3">Project Explorer</span></h1>
                <div className="mt-2">
                    <select
                        value={selectedRepo?.full_name ?? ''}
                        onChange={e => {
                            const repo = repos.find(r => r.full_name === e.target.value);
                            if (repo) {
                                dispatch({ type: 'SET_SELECTED_REPO', payload: { owner: repo.owner.login, repo: repo.name, full_name: repo.full_name, name: repo.name } });
                            }
                        }}
                        className="w-full p-2 bg-surface border border-border rounded-md text-sm"
                    >
                        <option value="" disabled>{isLoading === 'repos' ? 'Loading...' : 'Select a repository'}</option>
                        {repos.map(r => <option key={r.id} value={r.full_name}>{r.full_name}</option>)}
                    </select>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </header>
            <div className="flex-grow flex min-h-0">
                <aside className="w-1/3 bg-background border-r border-border p-4 overflow-y-auto">
                    {isLoading === 'tree' && <div className="flex justify-center"><LoadingSpinner /></div>}
                    {projectFiles && <FileTree node={projectFiles} onFileSelect={handleFileSelect} activePath={activeFile?.path ?? null} />}
                </aside>
                <main className="flex-1 bg-surface flex flex-col">
                     <div className="flex justify-between items-center p-2 border-b border-border bg-gray-50 dark:bg-slate-800">
                        <span className="text-sm font-semibold">{activeFile?.name || 'No file selected'}</span>
                        <button onClick={handleCommit} disabled={!hasChanges || isLoading === 'commit'} className="btn-primary px-4 py-1 text-sm flex items-center justify-center min-w-[100px]">
                           {isLoading === 'commit' ? <LoadingSpinner/> : 'Commit'}
                        </button>
                     </div>
                     {isLoading === 'file' ? <div className="flex items-center justify-center h-full"><LoadingSpinner /></div> :
                        <textarea 
                            value={activeFile?.editedContent ?? 'Select a file to view its content.'}
                            onChange={e => setActiveFile(prev => prev ? { ...prev, editedContent: e.target.value } : null)}
                            disabled={!activeFile}
                            className="w-full h-full p-4 text-sm font-mono bg-transparent resize-none focus:outline-none"
                        />
                    }
                </main>
            </div>
        </div>
    );
};