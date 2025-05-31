import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc, Search, Puzzle as PuzzleIcon } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card.jsx'; // FIXED: Added .jsx extension and relative path
import Button  from '../components/ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../store/store.js';
import { Label } from '../components/ui/Label.jsx';
import { Input } from '../components/ui/Input.jsx'; // FIXED: Added .jsx extension and relative path
import Select  from '../components/ui/Select.jsx'; // FIXED: Added .jsx extension and relative path
import { api } from '../lib/api.js'; // Correct path assumed


// =======================================================================
// --- File: src/pages/ModelsPage.jsx ---
// =======================================================================
/**
 * Models Hub page component (Placeholder).
 * TODO: Implement fetching and displaying models.
 */
function ModelsPage() {
    const addNotification = useStore((state) => state.addNotification);

    // State for models fetched from API
    const [models, setModels] = useState([]);
    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for client-side filtering/searching
    const [searchTerm, setSearchTerm] = useState('');
    const [modelTaskTypeFilter, setModelTaskTypeFilter] = useState('all'); // Filter by task_type

    // Fetch models from the backend when the component mounts
    useEffect(() => {
        const fetchModels = async () => {
            setIsLoading(true);
            setError(null);
            console.log("Fetching models from backend...");

            // Use api.get to fetch models (adjust limit as needed)
            const result = await api.get('/api/v1/models', { params: { skip: 0, limit: 200 } });

            if (result.success) {
                setModels(Array.isArray(result.data) ? result.data : []);
                console.log("Fetched models:", result.data);
            } else {
                console.error("Failed to fetch models:", result.error);
                const errorMsg = `Failed to load models: ${result.error}`;
                setError(errorMsg);
                addNotification({ message: errorMsg, type: 'error' });
            }
            setIsLoading(false);
        };

        fetchModels();
        // Run only once on mount
    }, [addNotification]); // Include addNotification in deps if used inside effect directly (though it's stable)

    // Client-side filtering logic based on fetched models
    const filteredModels = useMemo(() => {
        if (!Array.isArray(models)) return []; // Ensure models is an array

        let tempModels = models;

        // Filter by task type (using task_type field from backend model)
        if (modelTaskTypeFilter !== 'all') {
            tempModels = tempModels.filter(model => model.task_type === modelTaskTypeFilter);
        }

        // Filter by search term
        if (searchTerm.trim() !== '') {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            tempModels = tempModels.filter(model =>
                (model.name?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
                (model.description?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
                (model.task_type?.toLowerCase() || '').includes(lowerCaseSearchTerm) || // Also search task type
                (model.framework?.toLowerCase() || '').includes(lowerCaseSearchTerm) // Also search framework
            );
        }
        return tempModels;
    }, [models, searchTerm, modelTaskTypeFilter]);

    // Derive available task types from the fetched models for the filter dropdown
    const modelTaskTypes = useMemo(() => {
        if (!Array.isArray(models)) return ['all'];
        // Get unique, non-null task types
        const types = new Set(models.map(model => model.task_type).filter(Boolean));
        return ['all', ...Array.from(types).sort()];
    }, [models]);

    // Placeholder action when user clicks "Use Model"
    const handleUseModel = (modelId, modelName) => {
        addNotification({ message: `Selected model: ${modelName} (ID: ${modelId}). Integration Pending.`, type: 'info' });
        // In a real scenario, this might navigate somewhere or set state
    }

    // --- Render Logic ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500 dark:text-slate-400" />
                    <span className="ml-2 text-slate-500 dark:text-slate-400">Loading models...</span>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-40 text-center p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400 mb-2" />
                    <p className="text-red-700 dark:text-red-300 font-medium">Error loading models</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1 max-w-md">{error}</p>
                    {/* Optionally add a retry button */}
                </div>
            );
        }
        if (filteredModels.length === 0) {
            return (
                <div className="text-center py-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <PuzzleIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-50">No models found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Try adjusting your search or filter criteria. No models may be available yet.
                    </p>
                </div>
            );
        }
        // Render model cards using data from the backend
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredModels.map(model => (
                    <Card key={model.id}>
                        <CardHeader>
                            <CardTitle>{model.name}</CardTitle>
                            {/* Display task_type or framework if available */}
                            <CardDescription>
                                {model.task_type || 'N/A'} {model.framework ? `(${model.framework})` : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 h-[60px]">
                                {model.description || "No description available."}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                Source: {model.source_type} ({model.source_identifier})
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button size="sm" onClick={() => handleUseModel(model.id, model.name)}>Use Model</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    };

    // --- Main Component Return ---
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Models Hub</h1>
            <p className="text-slate-600 dark:text-slate-400">Browse and select pre-trained models for your projects.</p>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Label htmlFor="model-search" className="sr-only">Search Models</Label>
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        id="model-search"
                        type="search"
                        placeholder="Search models by name, description, task, framework..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isLoading || !!error}
                    />
                </div>
                <div className="flex-none sm:w-56"> {/* Adjusted width */}
                    <Label htmlFor="model-type-filter" className="sr-only">Filter by Task Type</Label>
                    <Select
                        id="model-type-filter"
                        value={modelTaskTypeFilter}
                        onChange={(e) => setModelTaskTypeFilter(e.target.value)}
                        disabled={isLoading || !!error || modelTaskTypes.length <= 1} // Disable if no types loaded
                    >
                        {modelTaskTypes.map(type => (
                            <option key={type} value={type}>
                                {type === 'all' ? 'All Task Types' : type}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Render Content Area */}
            {renderContent()}
        </div>
    );
}

export default ModelsPage;