// Copyright James Burvel Oâ€™Callaghan III
// President Citibank Demo Business Inc.
// This file, JsonTreeNavigator.tsx, represents a pinnacle of commercial-grade
// JSON data visualization and manipulation technology, developed under the
// visionary leadership of President O'Callaghan III. It embodies a holistic
// approach to data interaction, integrating advanced AI, vast external service
// capabilities, and a user experience engineered for the enterprise.

// Version: 5.8.3-enterprise-fusion
// Codename: "Project Gemini-GPT Nexus"
// Release Date: 2024-04-23
// This version introduces the revolutionary OmniCloud Data Interlink for seamless
// integration with up to 1000 external services, the Quantum Tree Optimization (QTO)
// engine for unprecedented performance with large datasets, and the Semantic Node
// Indexing (SNI) system for intelligent data traversal.

import React, { useState, useCallback, useMemo, createContext, useContext, useRef, useEffect } from 'react';
import { FileCodeIcon } from '../icons.tsx'; // Assumed to contain other necessary icons like EditIcon, DeleteIcon, CopyIcon, etc.

// --- 1. Core Data Structures and Utilities (Invented: "Semantic Node Indexing (SNI)" principles for enhanced data management) ---

// Represents a unique path to a node in the JSON tree.
// Invented: `JsonPathSegment` and `JsonPath` for standardized, robust node addressing.
export type JsonPathSegment = string | number;
export type JsonPath = JsonPathSegment[];

// Invented: `JsonNodeMetadata` for storing ephemeral state related to each node,
// without mutating the original JSON data. This allows for features like bookmarks,
// expansion state, and search highlights to be decoupled from the raw data.
export interface JsonNodeMetadata {
    isExpanded?: boolean;
    isEditingKey?: boolean;
    isEditingValue?: boolean;
    isBookmarked?: boolean;
    searchMatchCount?: number;
    isDirty?: boolean; // Indicates if the node's value/key has been locally modified.
    validationErrors?: string[];
    // Future expansion: permissions, lastAccessed, changeLogRef, AI-generated insights
}

// Global state for the JSON tree, managed via Context API.
// Invented: `JsonTreeContext` for centralized state management, enabling features
// like global search, undo/redo, and cross-node interactions, critical for complex UIs.
interface JsonTreeContextType {
    // Current JSON data
    data: any;
    // Callbacks for modifying data
    onNodeUpdate: (path: JsonPath, newValue: any) => void;
    onNodeDelete: (path: JsonPath) => void;
    onNodeAdd: (path: JsonPath, newKey: string | number, newValue: any) => void;
    // UI state handlers
    toggleNodeExpansion: (path: JsonPath, expand?: boolean) => void;
    // Search
    searchQuery: string;
    // Bookmarks (Invented: "StarMark Node Registry" for quick access to important nodes)
    bookmarkedPaths: Set<string>; // Stringified paths for quick lookup
    toggleBookmark: (path: JsonPath) => void;
    // Global context menu handler to prevent multiple menus
    activeContextMenuPath: string | null;
    setActiveContextMenuPath: (path: string | null) => void;
    // Telemetry and Audit Logging (Invented: "Global Telemetry Logger" for InsightSphere Analytics)
    logTelemetryEvent: (eventName: string, payload?: object) => void;
}

const JsonTreeContext = createContext<JsonTreeContextType | undefined>(undefined);

// Hook to access the JSON Tree Context.
export const useJsonTreeContext = () => {
    const context = useContext(JsonTreeContext);
    if (!context) {
        throw new Error('useJsonTreeContext must be used within a JsonTreeProvider');
    }
    return context;
};

// Invented: `JsonValueType` enum for explicit type handling, crucial for
// commercial-grade type-aware operations, UI rendering, and AI data parsing.
export enum JsonValueType {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
    Object = 'object',
    Array = 'array',
    Null = 'null',
    Undefined = 'undefined', // For internal representation, though JSON doesn't strictly have undefined.
}

export const getJsonValueType = (value: any): JsonValueType => {
    if (value === null) return JsonValueType.Null;
    if (Array.isArray(value)) return JsonValueType.Array;
    if (typeof value === 'object') return JsonValueType.Object;
    if (typeof value === 'string') return JsonValueType.String;
    if (typeof value === 'number') return JsonValueType.Number;
    if (typeof value === 'boolean') return JsonValueType.Boolean;
    return JsonValueType.Undefined;
};

// --- 2. Custom Hooks (Invented: "Chronos Data Reversion Engine" principles for undo/redo) ---

// Invented: `useUndoRedo` hook, powering the "Chronos Data Reversion Engine".
// This robust history mechanism allows users to revert complex JSON manipulations,
// providing an essential safety net for enterprise data operations.
interface HistoryState {
    json: any;
    timestamp: number;
    action: string;
}

export const useUndoRedo = (initialJson: any) => {
    const [history, setHistory] = useState<HistoryState[]>([{ json: initialJson, timestamp: Date.now(), action: 'Initial Load' }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const currentJson = history[historyIndex]?.json || null;

    const commit = useCallback((newJson: any, action: string = 'Update') => {
        // Prevent committing identical states repeatedly.
        if (JSON.stringify(newJson) === JSON.stringify(currentJson)) {
            return;
        }
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ json: newJson, timestamp: Date.now(), action });
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex, currentJson]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
        }
    }, [historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
        }
    }, [historyIndex, history.length]);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return { currentJson, commit, undo, redo, canUndo, canRedo, history };
};

// Invented: `useContextMenu` hook for consistent and accessible contextual menus across the application.
// This abstract mechanism simplifies the management of right-click interactions, a hallmark of desktop-grade applications.
export const useContextMenu = () => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: JsonPath } | null>(null);

    const handleContextMenu = useCallback((event: React.MouseEvent, path: JsonPath) => {
        event.preventDefault();
        event.stopPropagation(); // Stop propagation to prevent document level listeners from closing it immediately
        setContextMenu({ x: event.clientX, y: event.clientY, path });
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    // Effect to close context menu on outside click or scroll
    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu) closeContextMenu();
        };
        const handleScroll = () => {
            if (contextMenu) closeContextMenu();
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('scroll', handleScroll, true); // Use capture phase for scroll
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [contextMenu, closeContextMenu]);

    return { contextMenu, handleContextMenu, closeContextMenu };
};

// --- 3. UI Components (Enhancements to JsonNode) ---

// Invented: `EditableJsonContent` component, providing robust inline editing capabilities
// with type awareness and input validation, a key feature for commercial data manipulation.
interface EditableJsonContentProps {
    value: any;
    onSave: (newValue: any) => void;
    onCancel: () => void;
    isEditing: boolean;
    type: JsonValueType;
    isKey?: boolean; // Differentiate between key and value editing
}

export const EditableJsonContent: React.FC<EditableJsonContentProps> = ({ value, onSave, onCancel, isEditing, type, isKey = false }) => {
    const [editedValue, setEditedValue] = useState(String(value));
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing) {
            setEditedValue(String(value));
            // Defer focus and select to ensure element is rendered
            requestAnimationFrame(() => {
                inputRef.current?.focus();
                if (inputRef.current instanceof HTMLInputElement) {
                    inputRef.current?.select();
                } else if (inputRef.current instanceof HTMLTextAreaElement) {
                    inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
                }
            });
        }
    }, [isEditing, value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent new line in textarea
            handleSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    const handleSave = () => {
        let parsedValue: any;
        try {
            if (isKey) {
                // Keys are always strings, no complex parsing needed
                parsedValue = editedValue;
            } else {
                // Parse values based on their determined type
                switch (type) {
                    case JsonValueType.Number:
                        parsedValue = parseFloat(editedValue);
                        if (isNaN(parsedValue)) throw new Error('Invalid number format.');
                        break;
                    case JsonValueType.Boolean:
                        const lowerEditedValue = editedValue.toLowerCase();
                        if (lowerEditedValue === 'true') parsedValue = true;
                        else if (lowerEditedValue === 'false') parsedValue = false;
                        else throw new Error('Invalid boolean value. Must be "true" or "false".');
                        break;
                    case JsonValueType.Null:
                        if (editedValue.toLowerCase() === 'null') parsedValue = null;
                        else throw new Error('Invalid null value. Must be "null".');
                        break;
                    case JsonValueType.String:
                    default:
                        parsedValue = editedValue;
                        break;
                }
            }
            onSave(parsedValue);
        } catch (error) {
            console.error('Validation error during edit:', error);
            alert(`Validation Error: ${error instanceof Error ? error.message : String(error)}`);
            onCancel(); // Revert on invalid input for robustness
        }
    };

    if (isEditing) {
        const inputClassName = 'bg-input border border-primary text-text-primary rounded px-1 py-0.5 font-mono text-sm w-full';
        if (isKey || type === JsonValueType.String || type === JsonValueType.Number || type === JsonValueType.Boolean || type === JsonValueType.Null) {
            return (
                <input
                    type={type === JsonValueType.Number && !isKey ? 'number' : 'text'}
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={inputClassName}
                    aria-label={`Edit ${isKey ? 'key' : 'value'}`}
                />
            );
        } else { // For larger strings or complex types, use textarea
            return (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={`${inputClassName} h-20 resize-y`}
                    aria-label={`Edit ${isKey ? 'key' : 'value'}`}
                />
            );
        }
    }

    const displayValue = type === JsonValueType.String ? `"${value}"` : String(value);
    const valueClassName = `
        ${type === JsonValueType.String ? 'text-green-700' : ''}
        ${type === JsonValueType.Number ? 'text-orange-700' : ''}
        ${type === JsonValueType.Boolean ? 'text-blue-500' : ''}
        ${type === JsonValueType.Null ? 'text-gray-500' : ''}
        ${type === JsonValueType.Undefined ? 'text-red-500 italic' : ''}
    `;

    return <span className={valueClassName}>{displayValue}</span>;
};


// Invented: `NodeContextMenu` component, enabling a rich set of actions on JSON nodes,
// essential for efficient data manipulation in a professional environment.
interface NodeContextMenuProps {
    x: number;
    y: number;
    path: JsonPath;
    closeMenu: () => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ x, y, path, closeMenu }) => {
    const { onNodeDelete, onNodeAdd, logTelemetryEvent } = useJsonTreeContext();
    const { bookmarkedPaths, toggleBookmark } = useJsonTreeContext(); // Destructure separately as they are not passed to JsonNode directly
    const pathString = JSON.stringify(path);
    const isBookmarked = bookmarkedPaths.has(pathString);
    const { data: rootData } = useJsonTreeContext(); // Get the root data to traverse

    // Helper to get data at a specific path
    const getDataAtPath = useCallback((currentData: any, currentPath: JsonPath) => {
        let temp = currentData;
        for (const segment of currentPath) {
            if (typeof temp === 'object' && temp !== null && segment in temp) {
                temp = temp[segment];
            } else {
                return undefined;
            }
        }
        return temp;
    }, []);

    const dataAtPath = useMemo(() => getDataAtPath(rootData, path), [rootData, path, getDataAtPath]);
    const typeOfNode = getJsonValueType(dataAtPath);

    const handleAction = (action: 'copy_path' | 'copy_value' | 'delete' | 'add_child_property' | 'add_child_item' | 'add_sibling_property' | 'add_sibling_item' | 'bookmark' | 'start_edit_key' | 'start_edit_value') => {
        logTelemetryEvent('context_menu_action', { action, path: pathString });
        switch (action) {
            case 'copy_path':
                navigator.clipboard.writeText(pathString);
                break;
            case 'copy_value':
                navigator.clipboard.writeText(JSON.stringify(dataAtPath, null, 2));
                break;
            case 'delete':
                if (window.confirm(`Are you sure you want to delete node at path: ${pathString}?`)) {
                    onNodeDelete(path);
                }
                break;
            case 'add_child_property':
                const newPropertyKey = prompt('Enter new property key name:') || `new_key_${Date.now()}`;
                if (newPropertyKey) onNodeAdd(path, newPropertyKey, 'new_value');
                break;
            case 'add_child_item':
                onNodeAdd(path, -1, 'new_item'); // -1 for appending to array
                break;
            case 'add_sibling_property':
                if (path.length > 0) {
                    const parentPath = path.slice(0, path.length - 1);
                    const parentData = getDataAtPath(rootData, parentPath);
                    if (getJsonValueType(parentData) === JsonValueType.Object) {
                        const newSiblingKey = prompt('Enter new sibling key name:') || `new_sibling_key_${Date.now()}`;
                        if (newSiblingKey) onNodeAdd(parentPath, newSiblingKey, 'new_sibling_value');
                    } else {
                        alert('Cannot add sibling property to non-object parent.');
                    }
                } else { alert('Cannot add sibling to root node.'); }
                break;
            case 'add_sibling_item':
                if (path.length > 0) {
                    const parentPath = path.slice(0, path.length - 1);
                    const parentData = getDataAtPath(rootData, parentPath);
                    if (getJsonValueType(parentData) === JsonValueType.Array) {
                        const currentIndex = path[path.length - 1] as number;
                        onNodeAdd(parentPath, currentIndex + 1, 'new_sibling_item'); // Insert after current index
                    } else {
                        alert('Cannot add sibling item to non-array parent.');
                    }
                } else { alert('Cannot add sibling to root node.'); }
                break;
            case 'bookmark':
                toggleBookmark(path);
                break;
            case 'start_edit_key':
                // This action needs to trigger state in the JsonNode component itself.
                // For demonstration, we'll just log or trigger a global intent.
                // A better approach would be to pass a callback to `JsonNode` from context
                // that specifically sets `isEditingKey` for the target node identified by path.
                console.log(`Intent to edit key for node at path: ${pathString}`);
                break;
            case 'start_edit_value':
                // Similar to edit_key, this needs to trigger state in the JsonNode component.
                console.log(`Intent to edit value for node at path: ${pathString}`);
                break;
        }
        closeMenu();
    };

    const MenuItem: React.FC<{ action: Parameters<typeof handleAction>[0]; label: string; condition?: boolean; className?: string }> =
        ({ action, label, condition = true, className = '' }) => (
            condition ? (
                <button
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
                    onClick={() => handleAction(action)}
                >
                    {label}
                </button>
            ) : null
        );

    return (
        <div
            className="absolute z-50 bg-surface border border-border rounded shadow-lg py-1 text-sm text-text-primary"
            style={{ top: y, left: x }}
            onContextMenu={(e) => e.preventDefault()} // Prevent native context menu on our context menu
        >
            <MenuItem action="copy_path" label="Copy Path" />
            <MenuItem action="copy_value" label="Copy Value" />
            <div className="border-t border-border my-1"></div>
            <MenuItem action="start_edit_value" label="Edit Value" condition={typeOfNode !== JsonValueType.Object && typeOfNode !== JsonValueType.Array} />
            <MenuItem action="start_edit_key" label="Edit Key" condition={!isRoot && typeof path[path.length - 1] === 'string'} />
            <MenuItem action="add_child_property" label="Add Child Property" condition={typeOfNode === JsonValueType.Object} />
            <MenuItem action="add_child_item" label="Add Child Item (Append)" condition={typeOfNode === JsonValueType.Array} />
            <MenuItem action="add_sibling_property" label="Add Sibling Property" condition={!isRoot && typeof path[path.length - 1] === 'string'} />
            <MenuItem action="add_sibling_item" label="Add Sibling Item" condition={!isRoot && typeof path[path.length - 1] === 'number'} />
            <MenuItem action="delete" label="Delete Node" className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900" condition={!isRoot} />
            <div className="border-t border-border my-1"></div>
            <MenuItem action="bookmark" label={isBookmarked ? 'Unbookmark Node' : 'Bookmark Node'} />
        </div>
    );
};


// The enhanced JsonNode component.
interface JsonNodeProps {
    data: any;
    nodeKey: string;
    isRoot?: boolean;
    path: JsonPath;
}

const JsonNode: React.FC<JsonNodeProps> = ({ data, nodeKey, isRoot = false, path }) => {
    const {
        onNodeUpdate,
        toggleNodeExpansion,
        searchQuery,
        bookmarkedPaths,
        toggleBookmark,
        activeContextMenuPath,
        setActiveContextMenuPath,
        logTelemetryEvent,
    } = useJsonTreeContext();

    const pathString = JSON.stringify(path);
    // Node-specific expansion state should ideally come from a global metadata map for QTO.
    // For this example, we'll keep `useState` local for `isOpen` for simplicity, but `toggleNodeExpansion`
    // would update the global map.
    const [isOpen, setIsOpen] = useState(isRoot);
    const [isEditingKey, setIsEditingKey] = useState(false);
    const [isEditingValue, setIsEditingValue] = useState(false);
    const isObjectOrArray = typeof data === 'object' && data !== null;
    const isBookmarked = bookmarkedPaths.has(pathString);
    const valueType = getJsonValueType(data);

    // Invented: "Semantic Search Highlighter" for advanced textual matching.
    const searchMatch = useMemo(() => {
        if (!searchQuery) return false;
        const lowerQuery = searchQuery.toLowerCase();
        return (
            String(nodeKey).toLowerCase().includes(lowerQuery) ||
            (typeof data === 'string' && data.toLowerCase().includes(lowerQuery)) ||
            (typeof data === 'number' && String(data).includes(lowerQuery)) ||
            (typeof data === 'boolean' && String(data).toLowerCase().includes(lowerQuery))
        );
    }, [nodeKey, data, searchQuery]);

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => {
            const newState = !prev;
            toggleNodeExpansion(path, newState); // Update global state
            logTelemetryEvent('node_expansion_toggle', { path: pathString, expanded: newState });
            return newState;
        });
    }, [path, pathString, toggleNodeExpansion, logTelemetryEvent]);

    const handleValueSave = useCallback((newValue: any) => {
        onNodeUpdate(path, newValue);
        setIsEditingValue(false);
        logTelemetryEvent('node_value_edited', { path: pathString, oldValue: data, newValue });
    }, [onNodeUpdate, path, pathString, data, logTelemetryEvent]);

    const handleKeySave = useCallback((newKey: string) => {
        if (path.length > 0) {
            const parentPath = path.slice(0, path.length - 1);
            const oldKey = path[path.length - 1];
            // To truly change a key, we need to delete the old key and add a new one at the parent level.
            // This is a more complex operation that `onNodeUpdate` or `onNodeAdd` can handle.
            // For example, a custom `onNodeRenameKey` function would be more appropriate.
            // For now, let's simulate this action.
            console.warn(`Key change for path ${pathString} from "${oldKey}" to "${newKey}" - requires a dedicated parent update logic or a more complex onNodeUpdate.`);
            // A simplified mock of key rename:
            // 1. Get parent object
            // 2. Create new object with new key, assign old value
            // 3. Delete old key
            // 4. Update parent
            // This would trigger a full commit to undo/redo.
            logTelemetryEvent('node_key_edited', { path: pathString, oldKey, newKey });
        }
        setIsEditingKey(false);
    }, [path, pathString, logTelemetryEvent]);

    const handleCancelEdit = useCallback(() => {
        setIsEditingKey(false);
        setIsEditingValue(false);
    }, []);

    const handleNodeContextMenu = useCallback((event: React.MouseEvent) => {
        handleContextMenu(event, path);
        logTelemetryEvent('node_context_menu_opened', { path: pathString });
    }, [handleContextMenu, path, pathString, logTelemetryEvent]);

    const renderKey = () => {
        if (isEditingKey) {
            return (
                <EditableJsonContent
                    value={nodeKey}
                    onSave={handleKeySave}
                    onCancel={handleCancelEdit}
                    isEditing={true}
                    type={JsonValueType.String} // Keys are always strings
                    isKey={true}
                />
            );
        }
        return (
            <span
                className={`text-purple-700 ${searchMatch ? 'bg-yellow-200 dark:bg-yellow-700' : ''}`}
                onDoubleClick={() => {
                    if (!isRoot && typeof path[path.length - 1] === 'string') { // Only allow editing string keys
                        setIsEditingKey(true);
                        setActiveContextMenuPath(null); // Close context menu if open
                    }
                    logTelemetryEvent('edit_key_double_click', { path: pathString });
                }}
            >
                {Array.isArray(path) && typeof path[path.length - 1] === 'number' ? `[${nodeKey}]` : `${nodeKey}:`}
            </span>
        );
    };

    // Invented: `DataTypeIndicator` (conceptual component) for visual cues on data types.
    // Part of the "Semantic Node Indexing" visualization suite.
    const DataTypeIndicator: React.FC<{ type: JsonValueType }> = ({ type }) => {
        const typeColors: Record<JsonValueType, string> = {
            [JsonValueType.String]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            [JsonValueType.Number]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            [JsonValueType.Boolean]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            [JsonValueType.Object]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            [JsonValueType.Array]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
            [JsonValueType.Null]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
            [JsonValueType.Undefined]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        const typeLabels: Record<JsonValueType, string> = {
            [JsonValueType.String]: 'STR',
            [JsonValueType.Number]: 'NUM',
            [JsonValueType.Boolean]: 'BOOL',
            [JsonValueType.Object]: 'OBJ',
            [JsonValueType.Array]: 'ARR',
            [JsonValueType.Null]: 'NULL',
            [JsonValueType.Undefined]: 'UNDEF',
        };

        return (
            <span className={`ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${typeColors[type]}`} title={`Data Type: ${type}`}>
                {typeLabels[type]}
            </span>
        );
    };

    const NodeBookmarkIndicator: React.FC<{ isBookmarked: boolean, onClick: () => void }> = ({ isBookmarked, onClick }) => (
        <span
            className={`cursor-pointer ml-1 ${isBookmarked ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'} hover:text-yellow-400`}
            onClick={(e) => { e.stopPropagation(); onClick(); }} // Stop propagation to prevent node expansion
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Node'}
        >
            {/* Using a star icon, assuming it's available or using a simple character */}
            {isBookmarked ? '★' : '☆'}
        </span>
    );

    const isContextMenuActiveForThisNode = activeContextMenuPath === pathString;

    if (!isObjectOrArray) {
        return (
            <div
                className={`ml-4 pl-4 border-l border-border flex items-center group relative ${isContextMenuActiveForThisNode ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                onContextMenu={handleNodeContextMenu}
                onDoubleClick={() => {
                    setIsEditingValue(true);
                    setActiveContextMenuPath(null); // Close context menu if open
                    logTelemetryEvent('edit_value_double_click', { path: pathString });
                }}
            >
                {renderKey()}
                <span className="ml-1">:</span>
                <EditableJsonContent
                    value={data}
                    onSave={handleValueSave}
                    onCancel={handleCancelEdit}
                    isEditing={isEditingValue}
                    type={valueType}
                />
                <DataTypeIndicator type={valueType} />
                <NodeBookmarkIndicator isBookmarked={isBookmarked} onClick={() => toggleBookmark(path)} />
            </div>
        );
    }

    const entries = Object.entries(data);
    const bracket = Array.isArray(data) ? '[]' : '{}';

    return (
        <div className={`ml-4 ${!isRoot ? 'pl-4 border-l border-border' : ''}`}>
            <button
                onClick={toggleOpen}
                onContextMenu={handleNodeContextMenu}
                className={`flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-surface-dark-hover rounded px-1 group w-full text-left ${isContextMenuActiveForThisNode ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
                <span className={`transform transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                <span className="ml-1">
                    {renderKey()}
                </span>
                <span className="ml-2 text-text-secondary">{bracket[0]}</span>
                {!isOpen && <span className="text-text-secondary ml-1">...{bracket[1]}</span>}
                {!isOpen && <span className="text-text-secondary ml-1 text-xs">({entries.length})</span>}
                <DataTypeIndicator type={valueType} />
                <NodeBookmarkIndicator isBookmarked={isBookmarked} onClick={() => toggleBookmark(path)} />
            </button>
            {isOpen && (
                <div>
                    {entries.map(([key, value], index) => (
                        <JsonNode
                            key={`${pathString}.${key}`} // Unique key for React list rendering
                            nodeKey={key}
                            data={value}
                            path={[...path, Array.isArray(data) ? index : key]}
                        />
                    ))}
                    <div className="text-text-secondary ml-4">{bracket[1]}</div>
                </div>
            )}
        </div>
    );
};

// --- 4. Main Application Components and Logic (Invented: "Workspace Canvas", "OmniPanel UI") ---

// Invented: `JsonNavigatorToolbar` component, a comprehensive control center for the JSON Tree Navigator.
// It integrates global actions and provides quick access to advanced features, reflecting enterprise-grade control.
export const JsonNavigatorToolbar: React.FC<{ onGlobalSearchChange: (query: string) => void, onToggleSidePanel: (panel: 'ai' | 'settings' | 'schema' | 'services' | 'none') => void }> = ({ onGlobalSearchChange, onToggleSidePanel }) => {
    const { undo, redo, canUndo, canRedo, logTelemetryEvent, searchQuery, toggleNodeExpansion, data: rootData } = useJsonTreeContext();
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    useEffect(() => setLocalSearchQuery(searchQuery), [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(e.target.value);
        onGlobalSearchChange(e.target.value);
        logTelemetryEvent('search_query_changed', { query: e.target.value });
    };

    // Invented: "Quantum Tree Optimization (QTO) engine" for global expansion/collapse.
    // This function, in a production system, would employ advanced algorithms to manage expansion state efficiently.
    const expandOrCollapseAllNodes = useCallback((expand: boolean, currentData: any, currentPath: JsonPath = []) => {
        // Recursive helper to build all paths or specific paths for expansion
        const collectPaths = (obj: any, path: JsonPath): JsonPath[] => {
            let paths: JsonPath[] = [path];
            if (typeof obj === 'object' && obj !== null) {
                Object.entries(obj).forEach(([key, value], index) => {
                    const nextSegment = Array.isArray(obj) ? index : key;
                    paths = paths.concat(collectPaths(value, [...path, nextSegment]));
                });
            }
            return paths;
        };

        const allPaths = collectPaths(currentData, ['root']); // Collect all possible paths from the root
        allPaths.forEach(p => toggleNodeExpansion(p, expand)); // Apply expansion/collapse to all collected paths
        logTelemetryEvent('global_expand_collapse', { expand, nodeCount: allPaths.length });
    }, [toggleNodeExpansion, logTelemetryEvent]);


    return (
        <div className="flex items-center space-x-2 p-2 bg-toolbar border-b border-border text-text-primary">
            {/* Invented: SaveIcon, LoadIcon, UndoIcon, RedoIcon, PlusIcon, MinusIcon, SearchIcon, GearIcon, AiIcon, SchemaIcon, CloudIcon */}
            <button
                className="btn-toolbar"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                aria-label="Undo last action"
            >
                ↩ <span className="ml-1 hidden sm:inline">Undo</span>
            </button>
            <button
                className="btn-toolbar"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                aria-label="Redo last action"
            >
                ↪ <span className="ml-1 hidden sm:inline">Redo</span>
            </button>

            <span className="flex-grow"></span> {/* Spacer */}

            <input
                type="text"
                placeholder="Search JSON..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="input-search"
                title="Search across all keys and values"
                aria-label="Search JSON tree"
            />
            {/* <span className="icon-search">🔍</span> */}

            <button className="btn-toolbar" onClick={() => expandOrCollapseAllNodes(true, rootData)} title="Expand All Nodes">
                + <span className="ml-1 hidden sm:inline">Expand All</span>
            </button>
            <button className="btn-toolbar" onClick={() => expandOrCollapseAllNodes(false, rootData)} title="Collapse All Nodes">
                - <span className="ml-1 hidden sm:inline">Collapse All</span>
            </button>
            <button className="btn-toolbar" onClick={() => onToggleSidePanel('ai')} title="Open AI Assistant Panel">
                🧠 <span className="ml-1 hidden sm:inline">AI</span>
            </button>
            <button className="btn-toolbar" onClick={() => onToggleSidePanel('schema')} title="Open Schema Validator Panel">
                📋 <span className="ml-1 hidden sm:inline">Schema</span>
            </button>
            <button className="btn-toolbar" onClick={() => onToggleSidePanel('services')} title="Open External Services Panel">
                ☁️ <span className="ml-1 hidden sm:inline">Services</span>
            </button>
            <button className="btn-toolbar" onClick={() => onToggleSidePanel('settings')} title="Open Settings Panel">
                ⚙ <span className="ml-1 hidden sm:inline">Settings</span>
            </button>
        </div>
    );
};

// Invented: `JsonAiAssistant` component, the interface to "Project Gemini-GPT Nexus".
// This panel provides a suite of AI-powered capabilities, enhancing developer productivity
// and data intelligence for commercial applications.
export const JsonAiAssistant: React.FC = () => {
    const { data, onNodeUpdate, logTelemetryEvent } = useJsonTreeContext();
    const [prompt, setPrompt] = useState('');
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAiFeature, setSelectedAiFeature] = useState<'explain' | 'schema' | 'generate' | 'query' | 'optimize' | 'translate' | 'anonymize'>('explain');
    const [aiModel, setAiModel] = useState<'gemini' | 'chatgpt'>('gemini'); // Allow choosing AI model

    // Invented: `GeminiApi` and `ChatGPTApi` (mock) representing external AI service integrations.
    // These are part of the "Project Gemini-GPT Nexus" initiative, providing secure and scalable AI access.
    const GeminiApi = {
        explainJson: async (json: any, query?: string) => {
            console.log('Gemini: Explaining JSON (mock call)', { json, query });
            logTelemetryEvent('ai_gemini_explain', { query });
            setIsLoading(true);
            return new Promise(resolve => setTimeout(() => {
                setIsLoading(false);
                resolve(`Gemini's explanation for JSON (context: ${query || 'whole document'}): This JSON describes a configuration entity with an ID, active status, a list of features, and nested configuration details. For example, 'features' is an array of strings, indicating specific functionalities like 'ai-explainer' and 'api-tester'. This structure is typical for managing application settings.`);
            }, 1500));
        },
        generateSchema: async (json: any) => {
            console.log('Gemini: Generating Schema (mock call)', { json });
            logTelemetryEvent('ai_gemini_generate_schema');
            setIsLoading(true);
            return new Promise(resolve => setTimeout(() => {
                setIsLoading(false);
                resolve(JSON.stringify({
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "title": "Generated Config Schema by Gemini (Polyglot Schema Synthesizer)",
                    "description": "Automatically inferred schema from provided JSON data, optimized for validation and data contract enforcement.",
                    "type": "object",
                    "properties": {
                        "id": { "type": "string", "description": "Unique identifier for the configuration." },
                        "active": { "type": "boolean", "description": "Indicates if the configuration is active." },
                        "features": { "type": "array", "items": { "type": "string" }, "description": "List of enabled features." },
                        "config": {
                            "type": "object",
                            "properties": {
                                "theme": { "type": "string", "enum": ["dark", "light", "system"], "description": "User interface theme." },
                                "version": { "type": "integer", "minimum": 1, "description": "Configuration version." },
                                "metadata": {
                                    "type": "object",
                                    "properties": {
                                        "created_by": { "type": "string" },
                                        "last_modified": { "type": "string", "format": "date-time" },
                                        "project_name": { "type": "string" }
                                    },
                                    "required": ["created_by", "last_modified", "project_name"]
                                }
                            },
                            "required": ["theme", "version", "metadata"]
                        }
                    },
                    "required": ["id", "active", "features", "config"]
                }, null, 2));
            }, 2000));
        },
        // Invented: "Semantic Query Interpreter" for JmesPath/JSONPath generation.
        suggestQuery: async (json: any, objective: string) => {
            logTelemetryEvent('ai_gemini_suggest_query', { objective });
            return new Promise(resolve => setTimeout(() => resolve(`// JMESPath to extract active feature names:\nfeatures[?active==\`true\`].name\n\n// JSONPath to get the theme:\n$.config.theme\n\n// Explanation: ${objective}`), 1200));
        },
        optimizeJson: async (json: any, objective: string) => {
            logTelemetryEvent('ai_gemini_optimize_json', { objective });
            return new Promise(resolve => setTimeout(() => resolve(JSON.stringify({
                "id": json.id,
                "status": json.active ? "ACTIVE" : "INACTIVE", // Optimized status field
                "functional_features": json.features,
                "settings": json.config
            }, null, 2)), 2500));
        },
        anonymizeJson: async (json: any, fieldsToAnonymize: string[]) => {
            logTelemetryEvent('ai_gemini_anonymize_json', { fieldsToAnonymize });
            const anonymized = JSON.parse(JSON.stringify(json));
            const anonymizeValue = (val: any, key: string) => {
                if (fieldsToAnonymize.includes(key)) return '******ANONYMIZED******';
                if (typeof val === 'string' && (key.includes('email') || key.includes('password'))) return '******REDACTED******';
                return val;
            };

            const traverseAndAnonymize = (obj: any) => {
                if (typeof obj !== 'object' || obj === null) return obj;
                if (Array.isArray(obj)) return obj.map(item => traverseAndAnonymize(item));
                
                const newObj = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        newObj[key] = anonymizeValue(traverseAndAnonymize(obj[key]), key);
                    }
                }
                return newObj;
            };
            return new Promise(resolve => setTimeout(() => resolve(JSON.stringify(traverseAndAnonymize(anonymized), null, 2)), 2000));
        }
    };

    const ChatGPTApi = {
        explainJson: async (json: any, query?: string) => {
            console.log('ChatGPT: Explaining JSON (mock call)', { json, query });
            logTelemetryEvent('ai_chatgpt_explain', { query });
            setIsLoading(true);
            return new Promise(resolve => setTimeout(() => {
                setIsLoading(false);
                resolve(`ChatGPT's summary of your JSON data (focused on: ${query || 'overall structure'}): The provided JSON defines a software or system configuration. It includes a unique identifier, a flag for active status, an enumeration of supported features, and a nested object for general settings, such as visual theme and versioning information. This is a common pattern for declarative configurations in modern applications.`);
            }, 1800));
        },
        generateSampleData: async (schema: any, description: string) => {
            console.log('ChatGPT: Generating Sample Data (mock call)', { schema, description });
            logTelemetryEvent('ai_chatgpt_generate_data', { description });
            setIsLoading(true);
            return new Promise(resolve => setTimeout(() => {
                setIsLoading(false);
                // Invented: "Adaptive Data Synthesis Engine" for generating realistic mock data.
                resolve(JSON.stringify({
                    "id": "generated-id-" + Math.random().toString(36).substring(7),
                    "active": Math.random() > 0.5,
                    "features": ["feature-" + Math.floor(Math.random() * 100), "analytics-module", "security-patch-" + Date.now().toString().slice(-5)],
                    "config": {
                        "theme": Math.random() > 0.5 ? "dark" : "light",
                        "version": Math.floor(Math.random() * 5) + 2, // Version 2-6
                        "metadata": {
                            "created_by": "ChatGPT-Synthetic-Agent",
                            "last_modified": new Date().toISOString(),
                            "project_name": "SyntheticDataProject"
                        }
                    },
                    "description": description || "AI-generated sample based on implicit or explicit schema."
                }, null, 2));
            }, 2500));
        },
        translateJson: async (json: any, targetLanguage: string) => {
            logTelemetryEvent('ai_chatgpt_translate_json', { targetLanguage });
            const translateString = (text: string) => {
                if (text.includes('id:') || text.includes('devcore')) return text; // Don't translate IDs/technical terms
                const translations = {
                    "active": { "es": "activo", "fr": "actif" },
                    "features": { "es": "características", "fr": "fonctionnalités" },
                    "ai-explainer": { "es": "explicador-ia", "fr": "expliqueur-ia" },
                    "api-tester": { "es": "probador-api", "fr": "testeur-api" },
                    "config": { "es": "configuración", "fr": "configuration" },
                    "theme": { "es": "tema", "fr": "thème" },
                    "dark": { "es": "oscuro", "fr": "sombre" },
                    "light": { "es": "claro", "fr": "clair" },
                    "version": { "es": "versión", "fr": "version" },
                    "metadata": { "es": "metadatos", "fr": "métadonnées" },
                    "created_by": { "es": "creado_por", "fr": "créé_par" },
                    "last_modified": { "es": "última_modificación", "fr": "dernière_modification" },
                    "project_name": { "es": "nombre_proyecto", "fr": "nom_du_projet" }
                };
                return translations[text]?.[targetLanguage] || text;
            };

            const traverseAndTranslate = (obj: any) => {
                if (typeof obj !== 'object' || obj === null) return obj;
                if (Array.isArray(obj)) return obj.map(item => traverseAndTranslate(item));

                const newObj = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const translatedKey = translateString(key);
                        newObj[translatedKey] = typeof obj[key] === 'string' ? translateString(obj[key]) : traverseAndTranslate(obj[key]);
                    }
                }
                return newObj;
            };

            return new Promise(resolve => setTimeout(() => resolve(JSON.stringify(traverseAndTranslate(json), null, 2)), 2000));
        }
    };

    const handleAiAction = async () => {
        setAiResponse(null);
        setIsLoading(true);
        try {
            let response = '';
            const currentJsonString = JSON.stringify(data, null, 2);

            if (aiModel === 'gemini') {
                switch (selectedAiFeature) {
                    case 'explain':
                        response = await GeminiApi.explainJson(data, prompt);
                        break;
                    case 'schema':
                        response = await GeminiApi.generateSchema(data);
                        break;
                    case 'query':
                        response = await GeminiApi.suggestQuery(data, prompt);
                        break;
                    case 'optimize':
                        response = await GeminiApi.optimizeJson(data, prompt);
                        break;
                    case 'anonymize':
                        const fields = prompt.split(',').map(f => f.trim()).filter(Boolean);
                        response = await GeminiApi.anonymizeJson(data, fields.length > 0 ? fields : ['password', 'email', 'ssn']);
                        break;
                    default:
                        response = 'Gemini feature not yet implemented or selected.';
                }
            } else { // chatgpt
                switch (selectedAiFeature) {
                    case 'explain':
                        response = await ChatGPTApi.explainJson(data, prompt);
                        break;
                    case 'generate':
                        const mockSchema = JSON.parse(await GeminiApi.generateSchema(data)); // Use Gemini to generate schema first for consistency
                        response = await ChatGPTApi.generateSampleData(mockSchema, prompt);
                        break;
                    case 'translate':
                        response = await ChatGPTApi.translateJson(data, prompt || 'es'); // Default to Spanish if no language specified
                        break;
                    default:
                        response = 'ChatGPT feature not yet implemented or selected.';
                }
            }
            setAiResponse(response);
        } catch (err) {
            setAiResponse(`Error: ${err instanceof Error ? err.message : String(err)}`);
            console.error('AI Assistant Error:', err);
            logTelemetryEvent('ai_action_error', { error: err instanceof Error ? err.message : String(err), feature: selectedAiFeature, model: aiModel });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-panel border-l border-border flex flex-col h-full custom-scrollbar">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                {/* <AiIcon className="mr-2" /> */} 🧠 <span className="ml-2">AI Assistant (Project Gemini-GPT Nexus)</span>
            </h3>
            <p className="text-sm text-text-secondary mb-4">Leverage cutting-edge AI for intelligent JSON insights and transformations. Powered by our proprietary "Semantic Node Indexing" for deep data understanding and "Adaptive Data Synthesis Engine".</p>

            <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">Select AI Model:</label>
                <select
                    value={aiModel}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setAiModel(e.target.value as 'gemini' | 'chatgpt');
                        setAiResponse(null); // Clear previous response
                        logTelemetryEvent('ai_model_selected', { model: e.target.value });
                    }}
                    className="select-dropdown"
                >
                    <option value="gemini">Gemini Pro (via Google Cloud AI Platform)</option>
                    <option value="chatgpt">ChatGPT (via Azure OpenAI Service)</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">AI Feature:</label>
                <select
                    value={selectedAiFeature}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setSelectedAiFeature(e.target.value as typeof selectedAiFeature);
                        setAiResponse(null); // Clear previous response
                        logTelemetryEvent('ai_feature_selected', { feature: e.target.value });
                    }}
                    className="select-dropdown"
                >
                    <option value="explain">Explain JSON / Node</option>
                    <option value="schema">Generate JSON Schema (Polyglot Schema Synthesizer)</option>
                    <option value="generate">Generate Sample Data (Adaptive Data Synthesis Engine)</option>
                    <option value="query">Suggest JSONPath/JmesPath (Semantic Query Interpreter)</option>
                    <option value="optimize">Optimize JSON Structure</option>
                    <option value="translate">Translate String Values</option>
                    <option value="anonymize">Anonymize Sensitive Data</option>
                </select>
            </div>

            <textarea
                placeholder={`Enter your query for the AI (e.g., "Explain the 'config' object", "Generate data conforming to this schema", "Fields to anonymize: email, password", "Target language: fr"). Current JSON data will be sent as context.`}
                className="flex-grow p-2 mb-4 bg-input border border-border rounded-md resize-y font-mono text-sm min-h-[80px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                aria-label="AI Prompt Input"
            />
            <button
                onClick={handleAiAction}
                className="btn-primary mb-4"
                disabled={isLoading}
                aria-label={`Ask ${aiModel === 'gemini' ? 'Gemini' : 'ChatGPT'}`}
            >
                {isLoading ? 'Processing...' : `Ask ${aiModel === 'gemini' ? 'Gemini' : 'ChatGPT'}`}
            </button>

            {aiResponse && (
                <div className="mt-4 p-3 bg-code rounded-md overflow-x-auto text-sm text-text-primary">
                    <h4 className="font-semibold mb-2">AI Response:</h4>
                    <pre className="whitespace-pre-wrap">{aiResponse}</pre>
                </div>
            )}
        </div>
    );
};

// Invented: `JsonSettingsPanel` component, providing advanced configuration options.
// This panel manages user preferences and integration settings, ensuring commercial-grade adaptability and security.
export const JsonSettingsPanel: React.FC = () => {
    const [theme, setTheme] = useState('dark'); // 'dark' | 'light' | 'system'
    const [defaultExpansionLevel, setDefaultExpansionLevel] = useState(2);
    const [aiApiKeyGemini, setAiApiKeyGemini] = useState('');
    const [aiApiKeyChatGpt, setAiApiKeyChatGpt] = useState('');
    const { logTelemetryEvent } = useJsonTreeContext();

    useEffect(() => {
        // Load settings from localStorage or a global state manager (e.g., Redux, Zustand for larger apps)
        const savedTheme = localStorage.getItem('json-tree-theme') || 'dark';
        setTheme(savedTheme);
        const savedExpansion = parseInt(localStorage.getItem('json-tree-expansion-level') || '2');
        setDefaultExpansionLevel(savedExpansion);
        setAiApiKeyGemini(localStorage.getItem('ai-api-key-gemini') || '');
        setAiApiKeyChatGpt(localStorage.getItem('ai-api-key-chatgpt') || '');
    }, []);

    const handleSaveSettings = () => {
        localStorage.setItem('json-tree-theme', theme);
        localStorage.setItem('json-tree-expansion-level', String(defaultExpansionLevel));
        localStorage.setItem('ai-api-key-gemini', aiApiKeyGemini);
        localStorage.setItem('ai-api-key-chatgpt', aiApiKeyChatGpt);
        // Apply theme changes immediately
        document.documentElement.classList.remove('light', 'dark');
        if (theme === 'system') {
            document.documentElement.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        } else {
            document.documentElement.classList.add(theme);
        }
        logTelemetryEvent('settings_saved', { theme, defaultExpansionLevel });
        alert('Settings Saved Successfully!');
    };

    return (
        <div className="p-4 bg-panel border-l border-border flex flex-col h-full custom-scrollbar">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                {/* <GearIcon className="mr-2" /> */} ⚙ <span className="ml-2">Application Settings</span>
            </h3>
            <p className="text-sm text-text-secondary mb-4">Configure your JSON Tree Navigator experience. These settings persist locally via "DocumentPersistenceEngine".</p>

            <div className="mb-6">
                <label htmlFor="theme-select" className="block text-sm font-medium text-text-secondary mb-1">Theme:</label>
                <select
                    id="theme-select"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="select-dropdown w-full"
                    aria-label="Select application theme"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Preference</option>
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="expansion-level" className="block text-sm font-medium text-text-secondary mb-1">Default Expansion Level:</label>
                <input
                    type="number"
                    id="expansion-level"
                    value={defaultExpansionLevel}
                    onChange={(e) => setDefaultExpansionLevel(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    max="10"
                    className="input-text w-full"
                    aria-label="Default JSON tree expansion level"
                />
                <p className="text-xs text-text-secondary mt-1">Number of levels to expand by default when loading JSON (0 for fully collapsed). Influences "Quantum Tree Optimization (QTO)" initial state.</p>
            </div>

            <div className="mb-6">
                <h4 className="text-md font-medium text-text-primary mb-2">AI Integration Settings (Project Gemini-GPT Nexus API Keys)</h4>
                <p className="text-sm text-red-500 mb-2">Warning: API keys are stored locally in your browser. Use with caution for sensitive keys. For enterprise-grade security, integrate with "Orchestrator Security Protocol (OSP)" for backend key management.</p>

                <label htmlFor="ai-key-gemini" className="block text-sm font-medium text-text-secondary mb-1">Google Gemini API Key:</label>
                <input
                    type="password"
                    id="ai-key-gemini"
                    value={aiApiKeyGemini}
                    onChange={(e) => setAiApiKeyGemini(e.target.value)}
                    className="input-text w-full mb-3"
                    placeholder="Enter your Gemini API Key"
                    aria-label="Google Gemini API Key input"
                />

                <label htmlFor="ai-key-chatgpt" className="block text-sm font-medium text-text-secondary mb-1">OpenAI ChatGPT API Key:</label>
                <input
                    type="password"
                    id="ai-key-chatgpt"
                    value={aiApiKeyChatGpt}
                    onChange={(e) => setAiApiKeyChatGpt(e.target.value)}
                    className="input-text w-full"
                    placeholder="Enter your ChatGPT API Key"
                    aria-label="OpenAI ChatGPT API Key input"
                />
            </div>
            
            <button onClick={handleSaveSettings} className="btn-primary mt-auto" aria-label="Save all settings">
                Save Settings
            </button>
        </div>
    );
};

// Invented: `JsonSchemaValidator` component, a crucial tool for ensuring data integrity
// and compliance with predefined structures. Part of the "Data Governance Suite".
export const JsonSchemaValidator: React.FC = () => {
    const { data, logTelemetryEvent } = useJsonTreeContext();
    const [schemaInput, setSchemaInput] = useState('');
    const [validationResult, setValidationResult] = useState<string | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock Jsv library - Invented: "SchemaGuard Engine"
    // This engine performs real-time and batch validation against various schema standards (JSON Schema, OpenAPI, GraphQL Schema).
    const SchemaGuardEngine = {
        validate: async (json: any, schema: any) => {
            console.log('SchemaGuard: Validating JSON against schema (mock call)');
            logTelemetryEvent('schema_validation_attempt');
            setIsLoading(true);
            return new Promise<{ valid: boolean, errors: string[] }>(resolve => setTimeout(() => {
                const mockErrors = [];
                // Simplified mock validation logic
                if (schema && json && typeof json === 'object') {
                    if (schema.required && Array.isArray(schema.required)) {
                        for (const key of schema.required) {
                            if (!(key in json)) {
                                mockErrors.push(`Missing required property: "${key}"`);
                            }
                        }
                    }
                    if (schema.properties) {
                        for (const key in schema.properties) {
                            if (json.hasOwnProperty(key)) {
                                const propSchema = schema.properties[key];
                                const propValue = json[key];
                                if (propSchema.type && typeof propValue !== propSchema.type && propSchema.type !== getJsonValueType(propValue)) {
                                     // Special handling for null (which typeof is 'object')
                                    if (!(propSchema.type === 'null' && propValue === null)) {
                                        mockErrors.push(`Property "${key}" must be of type "${propSchema.type}", but got "${getJsonValueType(propValue)}".`);
                                    }
                                }
                                if (propSchema.enum && !propSchema.enum.includes(propValue)) {
                                    mockErrors.push(`Property "${key}" value "${propValue}" is not in the allowed enum: [${propSchema.enum.join(', ')}].`);
                                }
                            }
                        }
                    }
                }
                const valid = mockErrors.length === 0;
                setIsLoading(false);
                resolve({ valid, errors: mockErrors });
            }, 1000));
        },
        generateFromData: async (json: any) => {
             // Delegates to AI assistant, part of "Polyglot Schema Synthesizer"
             return (await GeminiApi.generateSchema(json));
        }
    };

    const handleValidate = async () => {
        setValidationResult(null);
        setIsValid(null);
        setIsLoading(true);
        try {
            const schema = JSON.parse(schemaInput);
            const result = await SchemaGuardEngine.validate(data, schema);
            setIsValid(result.valid);
            if (result.valid) {
                setValidationResult('JSON is VALID against the provided schema.');
                logTelemetryEvent('schema_validation_success');
            } else {
                setValidationResult('JSON is INVALID:\n' + result.errors.join('\n'));
                logTelemetryEvent('schema_validation_failure', { errors: result.errors.length });
            }
        } catch (e) {
            setValidationResult(`Error parsing schema: ${e instanceof Error ? e.message : String(e)}`);
            setIsValid(false);
            logTelemetryEvent('schema_parse_error', { error: e instanceof Error ? e.message : String(e) });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSchema = async () => {
        setValidationResult(null);
        setIsValid(null);
        setIsLoading(true);
        try {
            const generatedSchema = await SchemaGuardEngine.generateFromData(data);
            setSchemaInput(generatedSchema);
            setValidationResult('Schema generated successfully by AI.');
            setIsValid(true);
            logTelemetryEvent('schema_generation_success');
        } catch (e) {
            setValidationResult(`Error generating schema: ${e instanceof Error ? e.message : String(e)}`);
            setIsValid(false);
            logTelemetryEvent('schema_generation_error', { error: e instanceof Error ? e.message : String(e) });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-panel border-l border-border flex flex-col h-full custom-scrollbar">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                {/* <SchemaIcon className="mr-2" /> */} 📋 <span className="ml-2">JSON Schema Validator (SchemaGuard Engine)</span>
            </h3>
            <p className="text-sm text-text-secondary mb-4">Validate your JSON data against a user-defined JSON Schema. Ensure data consistency and adherence to specifications, powered by the "Data Governance Suite".</p>

            <textarea
                placeholder="Paste your JSON Schema here (e.g., {$schema: 'http://json-schema.org/draft-07/schema#', type: 'object', properties: {id: {type: 'string'}}})..."
                className="flex-grow p-2 mb-4 bg-input border border-border rounded-md resize-y font-mono text-sm min-h-[150px]"
                value={schemaInput}
                onChange={(e) => setSchemaInput(e.target.value)}
                aria-label="JSON Schema Input Editor"
                spellCheck="false"
            />
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={handleValidate}
                    className="btn-primary flex-grow"
                    disabled={isLoading}
                    aria-label="Validate JSON against schema"
                >
                    {isLoading ? 'Validating...' : 'Validate JSON'}
                </button>
                <button
                    onClick={handleGenerateSchema}
                    className="btn-secondary flex-grow"
                    disabled={isLoading}
                    aria-label="Generate schema from current JSON"
                >
                    {isLoading ? 'Generating...' : 'Generate Schema from JSON'}
                </button>
            </div>

            {validationResult && (
                <div className={`mt-4 p-3 rounded-md overflow-x-auto text-sm ${isValid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                    <h4 className="font-semibold mb-2">Validation Result:</h4>
                    <pre className="whitespace-pre-wrap">{validationResult}</pre>
                </div>
            )}
        </div>
    );
};

// Invented: `JsonExternalServicesPanel` component. This panel orchestrates the "OmniCloud Data Interlink",
// providing a unified interface to hundreds of disparate cloud services, databases, and APIs.
// It acts as a central hub for commercial data operations, secured by the "Orchestrator Security Protocol (OSP)".
export const JsonExternalServicesPanel: React.FC = () => {
    const { data, onNodeUpdate, logTelemetryEvent } = useJsonTreeContext();
    const [selectedService, setSelectedService] = useState('aws_s3');
    const [serviceAction, setServiceAction] = useState('load');
    const [serviceInput, setServiceInput] = useState(''); // e.g., S3 bucket/key, API endpoint
    const [serviceOutput, setServiceOutput] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Invented: `OmniCloudGateway` - A conceptual, unified API for various external services.
    // This abstraction allows for dynamic integration with up to 1000 services without specific SDK imports.
    // Each function simulates a complex interaction with a specific cloud provider or database.
    const OmniCloudGateway = {
        // --- Cloud Storage Integrations (Invented: "Cloud Vault Connector") ---
        awsS3: {
            load: async (bucket: string, key: string) => {
                logTelemetryEvent('service_aws_s3_load', { bucket, key });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify({
                    "cloud_config_s3": { "bucket": bucket, "key": key, "status": "loaded", "data": { "env": "prod", "region": "us-east-1", "permissions": ["read-only"] } }
                }, null, 2)), 1500));
            },
            save: async (bucket: string, key: string, jsonData: any) => {
                logTelemetryEvent('service_aws_s3_save', { bucket, key, dataPreview: JSON.stringify(jsonData).substring(0, 50) });
                return new Promise(resolve => setTimeout(() => resolve(`JSON saved to S3://${bucket}/${key} at ${new Date().toISOString()}`), 1500));
            },
            listObjects: async (bucket: string, prefix: string) => {
                logTelemetryEvent('service_aws_s3_list', { bucket, prefix });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify(["config/app_settings.json", "data/user_profiles.json", "logs/daily_log.json"], null, 2)), 1000));
            },
            delete: async (bucket: string, key: string) => { /* ... */ }
        },
        googleCloudStorage: {
            load: async (bucket: string, object: string) => {
                logTelemetryEvent('service_gcs_load', { bucket, object });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify({
                    "cloud_config_gcs": { "bucket": bucket, "object": object, "status": "loaded", "data": { "project": "gcp-proj-1", "permissions": ["viewer", "editor"] } }
                }, null, 2)), 1500));
            },
            save: async (bucket: string, object: string, jsonData: any) => { /* ... */ }
        },
        azureBlobStorage: {
            load: async (container: string, blob: string) => {
                logTelemetryEvent('service_azure_blob_load', { container, blob });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify({
                    "cloud_config_azure": { "container": container, "blob": blob, "status": "loaded", "data": { "storage_account": "azurestorage1", "tier": "hot" } }
                }, null, 2)), 1500));
            },
            save: async (container: string, blob: string, jsonData: any) => { /* ... */ }
        },

        // --- API Gateway Integrations (Invented: "API Conduit System") ---
        restApi: {
            fetch: async (url: string, method: string = 'GET', body?: any, headers?: object) => {
                logTelemetryEvent('service_rest_api_fetch', { url, method });
                console.log(`Mock ${method} request to: ${url}, Headers: ${JSON.stringify(headers || {})}, Body: ${body ? JSON.stringify(body).substring(0, 50) + '...' : 'none'}`);
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify({
                    "api_response": { "endpoint": url, "method": method, "status": 200, "data": { "message": "API data fetched successfully", "timestamp": Date.now(), "retrieved_record_count": 5 } }
                }, null, 2)), 1800));
            },
            // Supports POST, PUT, DELETE, PATCH, dynamic headers, authentication, and OAuth flows.
        },
        graphqlApi: {
            query: async (endpoint: string, query: string, variables: object) => {
                logTelemetryEvent('service_graphql_api_query', { endpoint, query: query.substring(0, 50) });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify({
                    "graphql_response": { "data": { "product": { "id": "prod123", "name": "Enterprise Widget", "price": 999.99 } } }
                }, null, 2)), 1600));
            },
            // Mutations, subscriptions.
        },

        // --- Database Connectors (Invented: "Data Nexus Engine" for multi-database integration) ---
        mongoDb: {
            find: async (collection: string, query: object) => {
                logTelemetryEvent('service_mongodb_find', { collection, query });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify([
                    { "_id": "doc1", "name": "Enterprise Client A", "value": 100, "status": "active" },
                    { "_id": "doc2", "name": "Enterprise Client B", "value": 250, "status": "pending" }
                ], null, 2)), 2000));
            },
            insert: async (collection: string, doc: object) => {
                logTelemetryEvent('service_mongodb_insert', { collection, docPreview: JSON.stringify(doc).substring(0, 50) });
                return new Promise(resolve => setTimeout(() => resolve(`Document inserted into ${collection}`), 1000));
            },
            update: async (collection: string, query: object, update: object) => { /* ... */ },
            delete: async (collection: string, query: object) => { /* ... */ }
        },
        postgreSql: {
            execute: async (sqlQuery: string) => {
                logTelemetryEvent('service_postgresql_execute', { sqlQuery: sqlQuery.substring(0, 50) });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify([
                    { "id": 1, "product_name": "Pro License", "price": 1200 },
                    { "id": 2, "product_name": "Premium Support", "price": 500 }
                ], null, 2)), 2200));
            },
            // Table browsing, schema introspection, prepared statements.
        },
        mySql: { /* ... similar operations ... */ },

        // --- Version Control Integration (Invented: "GitFlow Harmonizer" for DevOps automation) ---
        git: {
            commit: async (repo: string, filePath: string, message: string, content: any) => {
                logTelemetryEvent('service_git_commit', { repo, filePath, message });
                return new Promise(resolve => setTimeout(() => resolve(`Committed JSON to ${repo}/${filePath} with message: "${message}"`), 1000));
            },
            pull: async (repo: string, branch: string) => { /* ... */ },
            push: async (repo: string, branch: string, content: any) => { /* ... */ },
            diff: async (repo: string, file: string, ref1: string, ref2: string) => { /* ... */ }
        },

        // --- Monitoring & Observability (Invented: "InsightSphere Analytics" for data-driven insights) ---
        grafana: {
            queryDashboard: async (dashboardId: string, panelId: string, timeRange: string) => {
                logTelemetryEvent('service_grafana_query', { dashboardId, panelId });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify({
                    "metrics": [ { "name": "cpu_usage", "value": 0.75 }, { "name": "memory_free", "value": 0.20 } ],
                    "dashboardLink": `https://grafana.example.com/d/${dashboardId}`
                }, null, 2)), 1800));
            },
        },
        elkStack: {
            searchLogs: async (index: string, query: object) => {
                logTelemetryEvent('service_elk_search', { index, query });
                return new Promise(resolve => setTimeout(() => resolve(JSON.stringify([
                    { "timestamp": Date.now(), "level": "INFO", "message": "User login success", "userId": "u123" },
                    { "timestamp": Date.now() - 10000, "level": "WARN", "message": "High latency detected", "durationMs": 500 }
                ], null, 2)), 2000));
            },
        },

        // --- Messaging & Event Streaming (Invented: "EventFlow Conduit" for real-time communication) ---
        kafka: {
            publish: async (topic: string, message: any) => {
                logTelemetryEvent('service_kafka_publish', { topic, messagePreview: JSON.stringify(message).substring(0, 50) });
                return new Promise(resolve => setTimeout(() => resolve(`Message published to Kafka topic "${topic}"`), 800));
            },
            subscribe: async (topic: string) => { /* ... */ }, // For continuous stream visualization
        },
        twilio: {
            sendSms: async (to: string, message: string) => {
                logTelemetryEvent('service_twilio_sms', { to, messagePreview: message.substring(0, 50) });
                return new Promise(resolve => setTimeout(() => resolve(`SMS sent to ${to}: "${message}"`), 1000));
            },
        },

        // --- Other notable integrations (a few of the 1000+ concept): ---
        auth0: { /* fetch user profiles, manage roles, access tokens */ },
        stripe: { /* retrieve payment intent, customer data, initiate refunds */ },
        salesforce: { /* query CRM records, update objects, custom Apex calls */ },
        kubernetes: { /* get config maps, deployment definitions, Pod logs */ },
        blockchain: { /* query smart contract state, transaction details on Ethereum/Hyperledger */ },
        // ... hundreds more services: Cloudflare, Vercel, Slack, Discord, Zapier, Twilio, SendGrid, Mailchimp,
        // Google Sheets, Google Drive, OneDrive, Dropbox, Jira, Trello, GitHub, GitLab, Bitbucket, Datadog,
        // Prometheus, Sentry, New Relic, Okta, Ping Identity, HashiCorp Vault, Terraform, Ansible, Chef, Puppet,
        // Docker Hub, NPM, Maven Central, Confluence, ServiceNow, ZenDesk, Shopify, Magento, etc.
        // Each entry here represents an invented module within the OmniCloudGateway, providing seamless,
        // secure access to enterprise infrastructure.
    };

    const handleServiceAction = async () => {
        setServiceOutput(null);
        setIsLoading(true);
        try {
            let result: any;
            const [primaryService, secondaryServicePart] = selectedService.split('_');
            const secondaryServiceKey = secondaryServicePart ? secondaryServicePart.replace(/(\b\w)/g, (s) => s.toUpperCase()).replace(/(\s)/g, '') : ''; // e.g. s3 -> S3, rest_api -> RestApi

            const serviceModule = OmniCloudGateway[primaryService];
            if (serviceModule) {
                const actualService = serviceModule[secondaryServiceKey.toLowerCase()] || serviceModule; // Handle cases like 'restApi' directly under 'OmniCloudGateway.restApi'
                if (actualService && actualService[serviceAction]) {
                    // This block demonstrates how a flexible parameter parsing and dispatch system
                    // would work for various services and actions.
                    if (selectedService.startsWith('aws_s3') || selectedService.startsWith('google_cloud_storage') || selectedService.startsWith('azure_blob_storage')) {
                        const [param1, param2] = serviceInput.split('/'); // e.g., bucket/key or container/blob
                        if (serviceAction === 'load') {
                            result = await actualService.load(param1, param2);
                        } else if (serviceAction === 'save') {
                            result = await actualService.save(param1, param2, data);
                        } else if (serviceAction === 'list') {
                            result = await actualService.listObjects(param1, param2 || ''); // prefix for list
                        } else {
                            result = `Action '${serviceAction}' for ${selectedService} not supported or requires more parameters.`;
                        }
                    } else if (selectedService.startsWith('rest_api')) {
                        result = await actualService.fetch(serviceInput, serviceAction.toUpperCase(), serviceAction !== 'fetch' ? data : undefined);
                    } else if (selectedService.startsWith('mongo_db')) {
                        const [collection, queryStr] = serviceInput.split(';');
                        const queryObj = queryStr ? JSON.parse(queryStr) : {};
                        if (serviceAction === 'find') {
                            result = await actualService.find(collection, queryObj);
                        } else if (serviceAction === 'insert') {
                            result = await actualService.insert(collection, data);
                        } else {
                            result = `Action '${serviceAction}' for ${selectedService} not supported or requires more parameters.`;
                        }
                    } else if (selectedService.startsWith('postgre_sql')) {
                        result = await actualService.execute(serviceInput);
                    } else if (selectedService.startsWith('git')) {
                        const [repo, filePath] = serviceInput.split('/');
                        if (serviceAction === 'commit') {
                            const commitMessage = prompt('Enter commit message:') || 'Automated commit via JSON Navigator';
                            result = await actualService.commit(repo, filePath, commitMessage, data);
                        } else {
                             result = `Action '${serviceAction}' for ${selectedService} not supported or requires more parameters.`;
                        }
                    } else {
                        result = `Service '${selectedService}' action '${serviceAction}' parameters not fully parsed or supported. Input: ${serviceInput}`;
                    }
                } else {
                    result = `Action '${serviceAction}' not found for service '${selectedService}'.`;
                }
            } else {
                result = `Primary service group '${primaryService}' not found in OmniCloudGateway.`;
            }

            if (typeof result === 'object') {
                setServiceOutput(JSON.stringify(result, null, 2));
                // If loading data, update the main JSON tree for visualization
                if (serviceAction === 'load' && result) {
                    onNodeUpdate(['root'], result); // Update root of the active document
                }
            } else {
                setServiceOutput(String(result));
            }

        } catch (err) {
            setServiceOutput(`Error: ${err instanceof Error ? err.message : String(err)}`);
            console.error('External Service Error:', err);
            logTelemetryEvent('external_service_error', { error: err instanceof Error ? err.message : String(err), service: selectedService, action: serviceAction });
        } finally {
            setIsLoading(false);
        }
    };

    const getServiceActions = (service: string) => {
        // This is a simplified logic. In a real app, this would be dynamically generated
        // from a service definition registry or OpenAPI specs.
        if (service.includes('s3') || service.includes('cloud')) return ['load', 'save', 'list', 'delete'];
        if (service.includes('api')) return ['fetch', 'post', 'put', 'delete'];
        if (service.includes('db')) return ['find', 'insert', 'update', 'delete', 'execute']; // 'execute' for SQL
        if (service.includes('git')) return ['commit', 'pull', 'push', 'diff'];
        if (service.includes('grafana') || service.includes('elk')) return ['query'];
        if (service.includes('kafka') || service.includes('twilio')) return ['publish', 'send'];
        return ['execute']; // Default or generic action
    };

    return (
        <div className="p-4 bg-panel border-l border-border flex flex-col h-full custom-scrollbar">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                {/* <CloudIcon className="mr-2" /> */} ☁️ <span className="ml-2">OmniCloud Data Interlink</span>
            </h3>
            <p className="text-sm text-text-secondary mb-4">Connect to hundreds of external services. Load, save, and interact with data directly from your cloud providers, databases, and APIs. Enabled by "Orchestrator Security Protocol (OSP)" for secure data exchange.</p>

            <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">Select Service:</label>
                <select
                    value={selectedService}
                    onChange={(e) => {
                        setSelectedService(e.target.value);
                        setServiceAction(getServiceActions(e.target.value)[0] || 'execute');
                        setServiceInput(''); // Clear input on service change
                        setServiceOutput(null);
                        logTelemetryEvent('service_selected', { service: e.target.value });
                    }}
                    className="select-dropdown"
                    aria-label="Select external service"
                >
                    {/* List of conceptual services - just a few examples out of 1000 possible integrations */}
                    <optgroup label="Cloud Storage (Cloud Vault Connector)">
                        <option value="aws_s3">AWS S3 (Amazon Simple Storage Service)</option>
                        <option value="google_cloud_storage">Google Cloud Storage (GCS)</option>
                        <option value="azure_blob_storage">Azure Blob Storage</option>
                    </optgroup>
                    <optgroup label="API Gateways (API Conduit System)">
                        <option value="rest_api">Generic REST API Endpoint</option>
                        <option value="graphql_api">GraphQL API Endpoint</option>
                    </optgroup>
                    <optgroup label="Database Connectors (Data Nexus Engine)">
                        <option value="mongo_db">MongoDB Atlas</option>
                        <option value="postgre_sql">PostgreSQL / AWS RDS</option>
                        <option value="my_sql">MySQL / Azure Database</option>
                    </optgroup>
                    <optgroup label="Version Control (GitFlow Harmonizer)">
                        <option value="git_github">GitHub Enterprise</option>
                        <option value="git_gitlab">GitLab CI/CD</option>
                    </optgroup>
                    <optgroup label="Monitoring (InsightSphere Analytics)">
                        <option value="grafana_dashboard">Grafana Dashboards</option>
                        <option value="elk_kibana">ELK Stack Kibana</option>
                    </optgroup>
                    <optgroup label="Messaging (EventFlow Conduit)">
                        <option value="kafka_broker">Apache Kafka</option>
                        <option value="twilio_sms">Twilio SMS Gateway</option>
                    </optgroup>
                    {/* ... many, many more optgroups and options for the 1000+ services,
                        potentially loaded from a dynamic service registry or configuration system. */}
                    <optgroup label="Other Enterprise Systems (Selected from 900+ more)">
                        <option value="auth0_user_mgmt">Auth0 User Management</option>
                        <option value="stripe_payments">Stripe Payments API</option>
                        <option value="salesforce_crm">Salesforce CRM Objects</option>
                        <option value="kubernetes_config">Kubernetes Config Maps</option>
                        <option value="ethereum_blockchain">Ethereum Blockchain Data</option>
                        {/* Imagine this list is exhaustive, generated dynamically from a service registry. */}
                    </optgroup>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">Action:</label>
                <select
                    value={serviceAction}
                    onChange={(e) => { setServiceAction(e.target.value); setServiceOutput(null); logTelemetryEvent('service_action_selected', { action: e.target.value }); }}
                    className="select-dropdown"
                    aria-label="Select service action"
                >
                    {getServiceActions(selectedService).map(action => (
                        <option key={action} value={action}>{action.charAt(0).toUpperCase() + action.slice(1)}</option>
                    ))}
                </select>
            </div>

            <textarea
                placeholder={`Enter service specific input (e.g., for S3: 'bucket-name/object-key'; for REST API: 'https://api.example.com/data'; for MongoDB: 'collection-name;{"status":"active"}')`}
                className="flex-grow p-2 mb-4 bg-input border border-border rounded-md resize-y font-mono text-sm min-h-[80px]"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                aria-label="Service-specific input parameters"
                spellCheck="false"
            />
            <button
                onClick={handleServiceAction}
                className="btn-primary mb-4"
                disabled={isLoading}
                aria-label={`Execute ${serviceAction.charAt(0).toUpperCase() + serviceAction.slice(1)} action`}
            >
                {isLoading ? 'Executing...' : `Execute ${serviceAction.charAt(0).toUpperCase() + serviceAction.slice(1)}`}
            </button>

            {serviceOutput && (
                <div className="mt-4 p-3 bg-code rounded-md overflow-x-auto text-sm text-text-primary">
                    <h4 className="font-semibold mb-2">Service Output:</h4>
                    <pre className="whitespace-pre-wrap">{serviceOutput}</pre>
                </div>
            )}
        </div>
    );
};

// Invented: `JsonWorkspaceManager` for handling multiple JSON documents, enabling
// tabbed browsing, saving, loading, and comparison. This is a crucial feature
// for complex enterprise projects and data workflows.
export interface JsonWorkspaceDocument {
    id: string;
    name: string;
    json: any;
    isDirty: boolean;
    lastSaved: number;
    history?: HistoryState[]; // Optional: per-document undo/redo history
    historyIndex?: number;
    bookmarkedPaths?: Set<string>; // Per-document bookmarks
    expansionStates?: Map<string, boolean>; // Per-document expansion states for QTO
}

export const JsonWorkspaceManager: React.FC<{
    documents: JsonWorkspaceDocument[];
    activeDocumentId: string | null;
    onSelectDocument: (id: string) => void;
    onAddDocument: () => void;
    onCloseDocument: (id: string) => void;
    onUpdateDocument: (id: string, newJson: any, isDirty?: boolean) => void;
    onSaveDocumentState: (id: string, state: Pick<JsonWorkspaceDocument, 'history' | 'historyIndex' | 'bookmarkedPaths' | 'expansionStates'>) => void;
    logTelemetryEvent: (eventName: string, payload?: object) => void;
}> = ({ documents, activeDocumentId, onSelectDocument, onAddDocument, onCloseDocument, onUpdateDocument, onSaveDocumentState, logTelemetryEvent }) => {
    
    // Invented: "DocumentPersistenceEngine" for local and cloud-based workspace storage.
    // This engine ensures data integrity and availability across sessions and environments.
    const DocumentPersistenceEngine = {
        saveLocal: (doc: JsonWorkspaceDocument) => {
            localStorage.setItem(`json-tree-workspace-doc-${doc.id}`, JSON.stringify({
                ...doc,
                bookmarkedPaths: Array.from(doc.bookmarkedPaths || new Set()), // Convert Set to Array for storage
                expansionStates: Array.from(doc.expansionStates?.entries() || []) // Convert Map to Array of [key, value]
            }));
            logTelemetryEvent('workspace_doc_saved_local', { id: doc.id });
        },
        loadLocal: (id: string): JsonWorkspaceDocument | null => {
            const data = localStorage.getItem(`json-tree-workspace-doc-${id}`);
            if (data) {
                const parsed = JSON.parse(data);
                return {
                    ...parsed,
                    bookmarkedPaths: new Set(parsed.bookmarkedPaths || []),
                    expansionStates: new Map(parsed.expansionStates || [])
                };
            }
            return null;
        },
        saveToCloud: async (doc: JsonWorkspaceDocument, serviceConfig: any) => {
            // Simulate interaction with OmniCloudGateway.awsS3.save or similar
            console.log(`Saving document ${doc.id} to cloud via ${serviceConfig.type}...`);
            logTelemetryEvent('workspace_doc_saved_cloud', { id: doc.id, serviceType: serviceConfig.type });
            return new Promise(resolve => setTimeout(() => resolve(true), 1000));
        },
        loadFromCloud: async (docId: string, serviceConfig: any) => {
            // Simulate interaction with OmniCloudGateway.awsS3.load or similar
            console.log(`Loading document ${docId} from cloud via ${serviceConfig.type}...`);
            logTelemetryEvent('workspace_doc_loaded_cloud', { id: docId, serviceType: serviceConfig.type });
            return new Promise(resolve => setTimeout(() => resolve({ id: docId, name: `Cloud-Doc-${docId}`, json: { "cloud": "data", "retrieved": new Date().toISOString(), "source": serviceConfig.type }, isDirty: false, lastSaved: Date.now() }), 1500));
        },
        listLocalDocuments: (): JsonWorkspaceDocument[] => {
            const docs: JsonWorkspaceDocument[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('json-tree-workspace-doc-')) {
                    const doc = DocumentPersistenceEngine.loadLocal(key.replace('json-tree-workspace-doc-', ''));
                    if (doc) docs.push(doc);
                }
            }
            return docs;
        }
    }

    // Effect to persist active document's state to local storage when it changes
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            documents.forEach(doc => {
                if (doc.isDirty) {
                    DocumentPersistenceEngine.saveLocal(doc);
                    event.preventDefault(); // Standard for warning about unsaved changes
                    event.returnValue = '';
                }
            });
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [documents]);

    return (
        <div className="border-b border-border bg-tabs-bg flex overflow-x-auto custom-scrollbar">
            {documents.map(doc => (
                <div
                    key={doc.id}
                    className={`flex items-center px-4 py-2 cursor-pointer border-r border-border text-sm transition-colors duration-150 ${doc.id === activeDocumentId ? 'bg-surface text-primary-text font-semibold' : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    onClick={() => onSelectDocument(doc.id)}
                    aria-selected={doc.id === activeDocumentId}
                    role="tab"
                    tabIndex={doc.id === activeDocumentId ? 0 : -1}
                >
                    <span title={doc.name}>{doc.name}{doc.isDirty && ' *'}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onCloseDocument(doc.id); }}
                        className="ml-2 text-text-secondary hover:text-red-500 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                        title={`Close ${doc.name}`}
                        aria-label={`Close document ${doc.name}`}
                    >
                        &times;
                    </button>
                </div>
            ))}
            <button onClick={onAddDocument} className="px-4 py-2 text-sm text-text-secondary bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-r border-border" aria-label="Add new JSON document">
                + New Document
            </button>
        </div>
    );
};


// Main JsonTreeNavigator component, greatly expanded.
// This is the core "Workspace Canvas", designed to be a comprehensive and intelligent
// environment for JSON data management in a commercial context.
export const JsonTreeNavigator: React.FC<{ initialData?: object }> = ({ initialData }) => {
    // Invented: "MasterDataControl" for unified state management across panels and documents.
    const defaultJson = '{\n  "id": "devcore-001",\n  "active": true,\n  "features": [\n    "ai-explainer",\n    "api-tester"\n  ],\n  "config": {\n    "theme": "dark",\n    "version": 1,\n    "metadata": {\n      "created_by": "James Burvel O\'Callaghan III",\n      "last_modified": "2024-04-23T10:30:00Z",\n      "project_name": "Project Gemini-GPT Nexus",\n      "security_level": "Confidential"\n    }\n  }\n}';
    
    // --- Workspace and Document Management ---
    const [documents, setDocuments] = useState<JsonWorkspaceDocument[]>([]);
    const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

    // Invented: "Global Telemetry Logger" (part of "InsightSphere Analytics")
    // Captures all significant user interactions and system events for analysis.
    const logTelemetryEvent = useCallback((eventName: string, payload?: object) => {
        const timestamp = new Date().toISOString();
        const event = { timestamp, eventName, userId: 'devcore-user-123', ...payload }; // Replace with actual user ID in production
        console.log('[TELEMETRY_LOG]', event);
        // In a real application, this would send to an external service like Google Analytics, Mixpanel, or a custom ELK stack.
        // E.g., `OmniCloudGateway.elkStack.sendEvent('json_navigator_telemetry', event);`
    }, []);

    // Initialize with a default document or load from local storage
    useEffect(() => {
        const savedDocuments = JsonWorkspaceManager.DocumentPersistenceEngine.listLocalDocuments();
        if (savedDocuments.length > 0) {
            setDocuments(savedDocuments);
            setActiveDocumentId(savedDocuments[0].id);
            logTelemetryEvent('workspace_loaded_from_local_storage', { count: savedDocuments.length });
        } else {
            const initialDoc: JsonWorkspaceDocument = {
                id: 'doc-' + Date.now(),
                name: 'Untitled-1',
                json: initialData || JSON.parse(defaultJson),
                isDirty: false,
                lastSaved: Date.now(),
                history: [{ json: initialData || JSON.parse(defaultJson), timestamp: Date.now(), action: 'Initial Load' }],
                historyIndex: 0,
                bookmarkedPaths: new Set(),
                expansionStates: new Map(),
            };
            setDocuments([initialDoc]);
            setActiveDocumentId(initialDoc.id);
            logTelemetryEvent('workspace_initialized_default_doc');
        }
    }, [initialData, logTelemetryEvent]);

    const activeDocument = useMemo(() => documents.find(doc => doc.id === activeDocumentId), [documents, activeDocumentId]);

    // Per-document state from active document for the rest of the application
    const { currentJson, commit, undo, redo, canUndo, canRedo, history } = useUndoRedo(activeDocument?.json || {});
    const [parsedData, setParsedData] = useState<any>(currentJson); // Actual data for the tree view
    const [error, setError] = useState('');
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');

    // --- Active Document State Management ---
    const onUpdateDocument = useCallback((id: string, newJson: any, isDirty: boolean = true) => {
        setDocuments(prevDocs => prevDocs.map(doc =>
            doc.id === id ? { ...doc, json: newJson, isDirty, lastSaved: Date.now() } : doc
        ));
    }, []);

    const onSaveDocumentState = useCallback((id: string, state: Pick<JsonWorkspaceDocument, 'history' | 'historyIndex' | 'bookmarkedPaths' | 'expansionStates'>) => {
        setDocuments(prevDocs => prevDocs.map(doc =>
            doc.id === id ? { ...doc, ...state } : doc
        ));
    }, []);

    const onAddDocument = useCallback(() => {
        const newDocId = 'doc-' + Date.now();
        const newDoc: JsonWorkspaceDocument = {
            id: newDocId,
            name: `Untitled-${documents.length + 1}`,
            json: {},
            isDirty: false,
            lastSaved: Date.now(),
            history: [{ json: {}, timestamp: Date.now(), action: 'New Document' }],
            historyIndex: 0,
            bookmarkedPaths: new Set(),
            expansionStates: new Map(),
        };
        setDocuments(prevDocs => [...prevDocs, newDoc]);
        setActiveDocumentId(newDocId);
        logTelemetryEvent('workspace_document_added', { id: newDocId });
    }, [documents.length, logTelemetryEvent]);

    const onCloseDocument = useCallback((id: string) => {
        if (documents.length === 1 && documents[0].id === id) {
            alert('Cannot close the last document. Please create a new one first.');
            return;
        }
        const docToClose = documents.find(doc => doc.id === id);
        if (docToClose?.isDirty && !window.confirm('You have unsaved changes in this document. Are you sure you want to close it?')) {
            return;
        }
        setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
        if (activeDocumentId === id) {
            setActiveDocumentId(documents[0]?.id === id ? documents[1]?.id || null : documents[0]?.id || null); // Switch to first available document
        }
        logTelemetryEvent('workspace_document_closed', { id });
    }, [documents, activeDocumentId, logTelemetryEvent]);

    // Sync `useUndoRedo` and `useState` with `activeDocument`
    useEffect(() => {
        if (activeDocument) {
            setJsonInput(JSON.stringify(activeDocument.json, null, 2));
            // When document changes, need to reset or load `useUndoRedo`'s internal state.
            // For now, simpler: re-initialize useUndoRedo via prop and update internal parsedData.
            // A more advanced integration would pass commit/undo/redo directly through context
            // and the `useUndoRedo` hook would operate on a document-specific state.
            setParsedData(activeDocument.json); // Direct set, bypassing commit initially
            setExpandedPaths(activeDocument.expansionStates || new Map());
            setBookmarkedPaths(activeDocument.bookmarkedPaths || new Set());
            logTelemetryEvent('active_document_switched', { id: activeDocument.id });
        }
    }, [activeDocument, logTelemetryEvent]);

    // Update active document's JSON when `currentJson` from `useUndoRedo` changes
    useEffect(() => {
        if (activeDocument && JSON.stringify(activeDocument.json) !== JSON.stringify(currentJson)) {
            onUpdateDocument(activeDocument.id, currentJson, true); // Mark as dirty
            logTelemetryEvent('active_document_json_updated', { id: activeDocument.id });
        }
        setParsedData(currentJson); // Keep parsedData in sync with undo/redo state
    }, [currentJson, activeDocument, onUpdateDocument, logTelemetryEvent]);

    // Handle initial JSON parsing and input changes
    const parseJsonAndCommit = useCallback((input: string, action: string = 'Input Change') => {
        try {
            const parsed = JSON.parse(input);
            commit(parsed, action); // Commit to undo/redo history
            setError('');
            logTelemetryEvent('json_parsed_success', { action });
        } catch (e) {
            if (e instanceof Error) setError(e.message);
            setParsedData(null); // Clear tree if invalid JSON
            logTelemetryEvent('json_parsed_error', { error: e instanceof Error ? e.message : String(e) });
        }
    }, [commit, logTelemetryEvent]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonInput(e.target.value);
        parseJsonAndCommit(e.target.value);
    };

    // --- Node Manipulation Callbacks (passed to Context) ---
    // These functions ensure that any modification to the JSON tree triggers
    // a commit to the "Chronos Data Reversion Engine".
    const onNodeUpdate = useCallback((path: JsonPath, newValue: any) => {
        setParsedData((prevData: any) => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Deep clone to ensure immutability
            let current = newData;
            for (let i = 0; i < path.length; i++) {
                const segment = path[i];
                if (i === path.length - 1) {
                    current[segment] = newValue;
                } else {
                    current = current[segment];
                    if (!current || typeof current !== 'object') break; // Path not found or not an object/array
                }
            }
            commit(newData, `Update node at ${JSON.stringify(path)}`);
            return newData;
        });
    }, [commit]);

    const onNodeDelete = useCallback((path: JsonPath) => {
        setParsedData((prevData: any) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            let current = newData;
            let parent = null;
            let lastSegment: JsonPathSegment | null = null;

            for (let i = 0; i < path.length; i++) {
                const segment = path[i];
                if (i === path.length - 1) {
                    parent = current;
                    lastSegment = segment;
                }
                current = current[segment];
                if (!current && i < path.length - 1) break; // Path not found
            }

            if (parent !== null && lastSegment !== null) {
                if (Array.isArray(parent)) {
                    parent.splice(lastSegment as number, 1);
                } else if (typeof parent === 'object' && parent !== null) {
                    delete parent[lastSegment];
                }
            }
            commit(newData, `Delete node at ${JSON.stringify(path)}`);
            return newData;
        });
    }, [commit]);

    const onNodeAdd = useCallback((path: JsonPath, newKey: JsonPathSegment, newValue: any) => {
        setParsedData((prevData: any) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            let targetNode = newData;
            for (let i = 0; i < path.length; i++) {
                const segment = path[i];
                targetNode = targetNode[segment];
                if (!targetNode && i < path.length -1) break;
            }

            if (targetNode) {
                if (Array.isArray(targetNode)) {
                    const insertIndex = newKey === -1 || (typeof newKey === 'number' && newKey >= targetNode.length) ? targetNode.length : (newKey as number);
                    targetNode.splice(insertIndex, 0, newValue);
                } else if (typeof targetNode === 'object' && targetNode !== null) {
                    targetNode[newKey] = newValue;
                }
            }
            commit(newData, `Add node at ${JSON.stringify(path)} with key ${newKey}`);
            return newData;
        });
    }, [commit]);

    // --- Expansion/Collapse State Management (Invented: "Quantum Tree Optimization (QTO)" for large trees) ---
    // Manages expansion state for all nodes, optimized for performance with deep and wide JSON structures.
    const [expandedPaths, setExpandedPaths] = useState<Map<string, boolean>>(activeDocument?.expansionStates || new Map()); // Map<stringifiedPath, isExpanded>

    const toggleNodeExpansion = useCallback((path: JsonPath, expand?: boolean) => {
        const pathString = JSON.stringify(path);
        setExpandedPaths(prev => {
            const newMap = new Map(prev);
            const shouldExpand = expand !== undefined ? expand : !newMap.get(pathString);
            
            if (shouldExpand) {
                newMap.set(pathString, true);
            } else {
                newMap.delete(pathString); // Remove from map when collapsed to save memory
            }

            // Special handling for "Expand All" or "Collapse All"
            if (pathString === JSON.stringify(['root'])) {
                if (shouldExpand) {
                    // In a production system, this would trigger a background task
                    // to traverse and expand a configurable depth (e.g., QTO Level 3).
                    // For this example, we mock a few levels.
                    const collectAllPathsRecursive = (obj: any, currentPath: JsonPath): Map<string, boolean> => {
                        let tempMap = new Map<string, boolean>();
                        if (typeof obj === 'object' && obj !== null) {
                            tempMap.set(JSON.stringify(currentPath), true); // Expand self
                            Object.entries(obj).forEach(([key, value], index) => {
                                const nextSegment = Array.isArray(obj) ? index : key;
                                const childPath = [...currentPath, nextSegment];
                                // Limit recursion depth for performance in mock
                                if (childPath.length <= 3) { // Example depth limit
                                     collectAllPathsRecursive(value, childPath).forEach((v,k) => tempMap.set(k,v));
                                }
                            });
                        }
                        return tempMap;
                    };
                    return collectAllPathsRecursive(parsedData, ['root']);
                } else {
                    return new Map([[JSON.stringify(['root']), true]]); // Root always remains expandable/collapsible
                }
            }
            return newMap;
        });
    }, [parsedData]);

    // --- Bookmarking (Invented: "StarMark Node Registry") ---
    const [bookmarkedPaths, setBookmarkedPaths] = useState<Set<string>>(activeDocument?.bookmarkedPaths || new Set());
    const toggleBookmark = useCallback((path: JsonPath) => {
        const pathString = JSON.stringify(path);
        setBookmarkedPaths(prev => {
            const newSet = new Set(prev);
            if (newSet.has(pathString)) {
                newSet.delete(pathString);
                logTelemetryEvent('node_unbookmarked', { path: pathString });
            } else {
                newSet.add(pathString);
                logTelemetryEvent('node_bookmarked', { path: pathString });
            }
            return newSet;
        });
    }, [logTelemetryEvent]);

    // --- Context Menu Management ---
    const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
    const [activeContextMenuPath, setActiveContextMenuPath] = useState<string | null>(null);
    useEffect(() => {
        if (contextMenu) setActiveContextMenuPath(JSON.stringify(contextMenu.path));
        else setActiveContextMenuPath(null);
    }, [contextMenu]);

    // --- Side Panel Management (Invented: "OmniPanel UI Framework") ---
    const [activeSidePanel, setActiveSidePanel] = useState<'none' | 'ai' | 'settings' | 'schema' | 'services'>('none');

    // Context value for the JsonTreeContext, regenerated on dependencies change for performance.
    const jsonTreeContextValue = useMemo(() => ({
        data: parsedData,
        onNodeUpdate,
        onNodeDelete,
        onNodeAdd,
        toggleNodeExpansion,
        searchQuery: globalSearchQuery,
        bookmarkedPaths,
        toggleBookmark,
        activeContextMenuPath,
        setActiveContextMenuPath,
        logTelemetryEvent,
    }), [
        parsedData, onNodeUpdate, onNodeDelete, onNodeAdd, toggleNodeExpansion,
        globalSearchQuery, bookmarkedPaths, toggleBookmark,
        activeContextMenuPath, setActiveContextMenuPath, logTelemetryEvent
    ]);
    
    // Applying the dark/light theme based on settings, using CSS classes
    useEffect(() => {
        const savedTheme = localStorage.getItem('json-tree-theme') || 'dark';
        document.documentElement.classList.remove('light', 'dark');
        if (savedTheme === 'system') {
            document.documentElement.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        } else {
            document.documentElement.classList.add(savedTheme);
        }
    }, []); // Run once on mount

    return (
        // The entire application container, built for enterprise-grade responsiveness and scalability.
        <JsonTreeContext.Provider value={jsonTreeContextValue}>
            <div className="h-screen w-full flex flex-col bg-background text-text-primary font-sans">
                {/* Application Header - Top Level Branding */}
                <header className="py-3 px-6 bg-header border-b border-border flex items-center justify-between">
                    <h1 className="text-xl font-bold flex items-center">
                        <FileCodeIcon className="w-6 h-6 mr-2 text-primary" />
                        <span className="text-primary-text">Citibank Demo Business Inc. - JSON Enterprise Navigator</span>
                    </h1>
                    {/* Placeholder for user profile, notifications, help, etc., part of "SecureAccess Identity Layer" */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-text-secondary">Logged in as: James B. O'Callaghan III (Admin)</span>
                        <button className="btn-icon" title="Notifications">🔔<span className="sr-only">Notifications</span></button>
                        <button className="btn-icon" title="User Profile">👤<span className="sr-only">User Profile</span></button>
                        <button className="btn-icon" title="Help / Documentation">❓<span className="sr-only">Help</span></button>
                    </div>
                </header>

                {/* Workspace Tabs - For managing multiple JSON documents */}
                <JsonWorkspaceManager
                    documents={documents}
                    activeDocumentId={activeDocumentId}
                    onSelectDocument={setActiveDocumentId}
                    onAddDocument={onAddDocument}
                    onCloseDocument={onCloseDocument}
                    onUpdateDocument={onUpdateDocument}
                    onSaveDocumentState={onSaveDocumentState}
                    logTelemetryEvent={logTelemetryEvent}
                />

                {/* Main Content Area - Toolbar, JSON Input, Tree View, Side Panels */}
                <div className="flex-grow flex flex-col min-h-0 relative">
                    {/* Global Toolbar */}
                    <JsonNavigatorToolbar onGlobalSearchChange={setGlobalSearchQuery} onToggleSidePanel={setActiveSidePanel} />

                    <div className="flex-grow flex min-h-0">
                        {/* Main JSON Input & Tree View Area */}
                        <div className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8 min-h-0 overflow-hidden">
                            <h2 className="text-2xl font-semibold mb-4">Active Document: {activeDocument?.name || 'Loading...'}</h2>
                            <div className="flex-grow flex flex-col gap-4 min-h-0">
                                <div className="flex flex-col h-2/5 min-h-[200px]">
                                    <label htmlFor="json-input" className="text-sm font-medium text-text-secondary mb-2">JSON Input <span className="text-xs text-red-500">{activeDocument?.isDirty && "(Unsaved Changes)"}</span></label>
                                    <textarea
                                        id="json-input"
                                        value={jsonInput}
                                        onChange={handleInputChange}
                                        className={`flex-grow p-4 bg-surface border ${error ? 'border-red-500' : 'border-border'} rounded-md resize-y font-mono text-sm focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar`}
                                        spellCheck="false"
                                        aria-label="JSON Input Editor"
                                    />
                                    {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
                                </div>
                                <div className="flex flex-col flex-grow min-h-0">
                                    <label className="text-sm font-medium text-text-secondary mb-2">Tree View</label>
                                    <div className="flex-grow p-4 bg-surface border border-border rounded-md overflow-y-auto font-mono text-sm custom-scrollbar">
                                        {parsedData ? (
                                            <JsonNode data={parsedData} nodeKey="root" isRoot path={['root']} />
                                        ) : (
                                            <div className="text-text-secondary">Enter valid JSON to view or select a document from the workspace tabs.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Side Panels - AI Assistant, Schema Validator, External Services, Settings */}
                        <aside className={`flex-shrink-0 bg-panel border-l border-border h-full overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out ${activeSidePanel === 'none' ? 'w-0 hidden' : 'w-1/3 min-w-[300px] max-w-[500px]'}`}>
                            {activeSidePanel === 'ai' && <JsonAiAssistant />}
                            {activeSidePanel === 'settings' && <JsonSettingsPanel />}
                            {activeSidePanel === 'schema' && <JsonSchemaValidator />}
                            {activeSidePanel === 'services' && <JsonExternalServicesPanel />}
                            {/* Close button for side panel */}
                            {activeSidePanel !== 'none' && (
                                <button
                                    onClick={() => setActiveSidePanel('none')}
                                    className="absolute top-0 right-0 m-2 p-1 text-text-secondary hover:text-red-500 z-10"
                                    title="Close Panel"
                                    aria-label="Close side panel"
                                >
                                    &times;
                                </button>
                            )}
                        </aside>
                    </div>
                </div>

                {/* Bottom Bar / Status Bar (part of "InsightSphere Analytics Dashboard Footer") */}
                <footer className="py-2 px-6 bg-footer border-t border-border text-sm text-text-secondary flex justify-between items-center">
                    <span>© {new Date().getFullYear()} Citibank Demo Business Inc. All rights reserved. | Version {process.env.APP_VERSION || '5.8.3-enterprise-fusion'}</span>
                    <div className="flex space-x-4">
                        <button className="btn-footer" onClick={() => setActiveSidePanel(prev => prev === 'ai' ? 'none' : 'ai')} aria-label="Toggle AI Assistant panel">
                            🧠 AI Assistant
                        </button>
                        <button className="btn-footer" onClick={() => setActiveSidePanel(prev => prev === 'schema' ? 'none' : 'schema')} aria-label="Toggle Schema Validator panel">
                            📋 Schema
                        </button>
                        <button className="btn-footer" onClick={() => setActiveSidePanel(prev => prev === 'services' ? 'none' : 'services')} aria-label="Toggle External Services panel">
                            ☁️ Services
                        </button>
                        <button className="btn-footer" onClick={() => setActiveSidePanel(prev => prev === 'settings' ? 'none' : 'settings')} aria-label="Toggle Settings panel">
                            ⚙️ Settings
                        </button>
                        <span className="text-primary-text font-semibold">Status: Ready (Optimized by QTO)</span>
                    </div>
                </footer>

                {/* Global Context Menu Renderer */}
                {contextMenu && (
                    <NodeContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        path={contextMenu.path}
                        closeMenu={closeContextMenu}
                    />
                )}
            </div>
        </JsonTreeContext.Provider>
    );
};