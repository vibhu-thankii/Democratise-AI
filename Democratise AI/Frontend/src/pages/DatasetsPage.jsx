import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc, Database as DatabaseIcon, Search } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card.jsx'; // FIXED: Added .jsx extension and relative path
import Button  from '../components/ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../store/store.js';
import { Input } from '../components/ui/Input.jsx'; // FIXED: Added .jsx extension and relative path
import { Label }  from '../components/ui/Label.jsx'; // FIXED: Added .jsx extension and relative path
import Select  from '../components/ui/Select.jsx'; // FIXED: Added .jsx extension and relative path
import { api } from '../lib/api'; // Import API helper
import Badge from '../components/ui/Badge.jsx';

// =======================================================================
// --- File: src/pages/DatasetsPage.jsx ---
// =======================================================================
/**
 * Datasets Hub page component (Placeholder).
 * TODO: Implement fetching, displaying, and uploading datasets.
 */
function DatasetsPage() {
    const addNotification = useStore((state) => state.addNotification);

    // State for datasets fetched from API
    const [datasets, setDatasets] = useState([]);
    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for client-side filtering/searching
    const [searchTerm, setSearchTerm] = useState('');
    // Filter state - Note: Backend model uses storage_type, not a general 'type'
    const [datasetStorageTypeFilter, setDatasetStorageTypeFilter] = useState('all');

    // Fetch datasets from the backend when the component mounts
    useEffect(() => {
        const fetchDatasets = async () => {
            setIsLoading(true);
            setError(null);
            console.log("Fetching datasets from backend...");

            // Use api.get - requires user to be logged in (token sent automatically)
            const result = await api.get('/api/v1/datasets', { params: { skip: 0, limit: 200 } });

            if (result.success) {
                setDatasets(Array.isArray(result.data) ? result.data : []);
                console.log("Fetched datasets:", result.data);
            } else {
                console.error("Failed to fetch datasets:", result.error);
                const errorMsg = `Failed to load datasets: ${result.error}`;
                setError(errorMsg);
                addNotification({ message: errorMsg, type: 'error' });
                // Logout/redirect might happen automatically via apiFetch if 401 occurred
            }
            setIsLoading(false);
        };

        fetchDatasets();
        // Run only once on mount
    }, [addNotification]); // Include addNotification in deps

    // Client-side filtering logic based on fetched datasets
    const filteredDatasets = useMemo(() => {
        if (!Array.isArray(datasets)) return [];

        let tempDatasets = datasets;

        // Filter by storage type
        if (datasetStorageTypeFilter !== 'all') {
            tempDatasets = tempDatasets.filter(d => d.storage_type === datasetStorageTypeFilter);
        }

        // Filter by search term
        if (searchTerm.trim() !== '') {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            tempDatasets = tempDatasets.filter(d =>
                (d.name?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
                (d.description?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
                (d.storage_type?.toLowerCase() || '').includes(lowerCaseSearchTerm)
            );
        }
        return tempDatasets;
    }, [datasets, searchTerm, datasetStorageTypeFilter]);

    // Derive available storage types from the fetched datasets for the filter dropdown
    const datasetStorageTypes = useMemo(() => {
        if (!Array.isArray(datasets)) return ['all'];
        const types = new Set(datasets.map(d => d.storage_type).filter(Boolean)); // Filter out null/empty types
        return ['all', ...Array.from(types).sort()];
    }, [datasets]);

    // Placeholder action when user clicks "Use Dataset"
    const handleUseDataset = (datasetId, datasetName) => {
        addNotification({ message: `Selected dataset: ${datasetName} (ID: ${datasetId}). Integration Pending.`, type: 'info' });
        // In a real scenario, this might associate with a project or navigate
    }

    // Placeholder action for upload button click
    const handleUploadDataset = () => {
        addNotification({ message: "Dataset upload workflow needs to be implemented.", type: 'info' });
        // This should likely open an upload modal/form which then calls POST /api/v1/datasets/upload
    }

    // --- Render Logic ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500 dark:text-slate-400" />
                    <span className="ml-2 text-slate-500 dark:text-slate-400">Loading datasets...</span>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-40 text-center p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400 mb-2" />
                    <p className="text-red-700 dark:text-red-300 font-medium">Error loading datasets</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1 max-w-md">{error}</p>
                    {/* Optionally add a retry button */}
                </div>
            );
        }
        if (filteredDatasets.length === 0) {
            return (
                <div className="text-center py-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <DatabaseIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-50">No datasets found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Try adjusting your search or filter criteria, or upload a new dataset.
                    </p>
                </div>
            );
        }
        // Render dataset cards using data from the backend
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDatasets.map(dataset => (
                    <Card key={dataset.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{dataset.name}</CardTitle>
                                {dataset.is_public && <Badge variant="secondary">Public</Badge>}
                            </div>
                            <CardDescription>
                                Type: {dataset.storage_type || 'N/A'}
                                {dataset.file_size_bytes && ` | Size: ${(dataset.file_size_bytes / (1024*1024)).toFixed(2)} MB`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 h-[60px]">
                                {dataset.description || "No description available."}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button size="sm" onClick={() => handleUseDataset(dataset.id, dataset.name)}>Use Dataset</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    };

    // --- Main Component Return ---
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Datasets Hub</h1>
                <Button onClick={handleUploadDataset} disabled={isLoading}>
                    <Plus className="mr-2 h-4 w-4" /> Upload Dataset
                </Button>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Explore available datasets or upload your own.</p>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Label htmlFor="dataset-search" className="sr-only">Search Datasets</Label>
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        id="dataset-search"
                        type="search"
                        placeholder="Search datasets by name or description..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isLoading || !!error}
                    />
                </div>
                <div className="flex-none sm:w-56"> {/* Adjusted width */}
                    <Label htmlFor="dataset-type-filter" className="sr-only">Filter by Storage Type</Label>
                    <Select
                        id="dataset-type-filter"
                        value={datasetStorageTypeFilter}
                        onChange={(e) => setDatasetStorageTypeFilter(e.target.value)}
                        disabled={isLoading || !!error || datasetStorageTypes.length <= 1}
                    >
                        {datasetStorageTypes.map(type => (
                            <option key={type} value={type}>
                                {type === 'all' ? 'All Storage Types' : type}
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

export default DatasetsPage;