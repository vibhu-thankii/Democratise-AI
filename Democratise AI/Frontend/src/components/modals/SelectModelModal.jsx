import React, { useState, useMemo, useEffect } from 'react';
import Button from '../ui/Button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card.jsx';
import {Input} from '../ui/Input.jsx';
import {Label} from '../ui/Label.jsx';
import { X, Search, Puzzle, Loader2, AlertTriangle } from 'lucide-react';
import useStore from '../../store/store.js'; // Only needed for addNotification maybe
import cn from '../../utils/cn.js';
import { api } from '../../lib/api.js'; // Adjust path as needed


/**
 * Modal for selecting a model to associate with a project.
 */
function SelectModelModal({ isOpen, onClose, onModelSelect }) {
  // State for fetched models, loading, and errors
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for user interaction
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModelId, setSelectedModelId] = useState(null);

  const addNotification = useStore((state) => state.addNotification);

  // Fetch models when the modal opens
  useEffect(() => {
      // Only fetch if the modal is open and models haven't been loaded yet
      if (isOpen && models.length === 0 && !isLoading) {
          const fetchModels = async () => {
              setIsLoading(true);
              setError(null);
              console.log("SelectModelModal: Fetching models...");

              // Fetch from backend (fetch a reasonable number for a modal)
              const result = await api.get('/api/v1/models', { params: { limit: 200 } });

              if (result.success) {
                  setModels(Array.isArray(result.data) ? result.data : []);
                  console.log("SelectModelModal: Fetched models:", result.data);
              } else {
                  console.error("SelectModelModal: Failed to fetch models:", result.error);
                  const errorMsg = `Failed to load models: ${result.error}`;
                  setError(errorMsg);
                  addNotification({ message: errorMsg, type: 'error' });
              }
              setIsLoading(false);
          };
          fetchModels();
      }

      // Reset search/selection when modal opens/closes
      if (!isOpen) {
          setSearchTerm('');
          setSelectedModelId(null);
          // Optionally clear models list if you want fresh data every time:
          // setModels([]);
          // setError(null);
      }
  }, [isOpen, addNotification]); // Re-run if isOpen changes

  // Client-side filtering based on fetched models
  const filteredModels = useMemo(() => {
      if (!Array.isArray(models)) return [];
      if (!searchTerm.trim()) {
          return models;
      }
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return models.filter(model =>
          (model.name?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
          (model.description?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
          (model.task_type?.toLowerCase() || '').includes(lowerCaseSearchTerm)
      );
  }, [models, searchTerm]);

  // Handler when the main "Select Model" button is clicked
  const handleSelectClick = () => {
      if (!selectedModelId) {
          addNotification({ message: 'Please select a model first.', type: 'error' });
          return;
      }
      // Find the full model object from the fetched list
      const selectedModel = models.find(m => m.id === selectedModelId);
      if (selectedModel) {
          onModelSelect(selectedModel); // Pass the selected model object back
      } else {
          console.error("Selected model ID not found in fetched models:", selectedModelId);
          addNotification({ message: 'Error selecting model. Please try again.', type: 'error' });
      }
      onClose(); // Close the modal
  };

  // Close modal if overlay is clicked
  const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  }

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  // --- Render Content Logic ---
  const renderModalContent = () => {
      if (isLoading) {
          return <div className="flex justify-center items-center p-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;
      }
      if (error) {
          return <div className="flex justify-center items-center p-10 text-red-600 dark:text-red-400"><AlertTriangle className="h-6 w-6 mr-2"/> Error loading models.</div>;
      }
      if (filteredModels.length === 0) {
          return <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">No models match your search criteria.</p>;
      }
      // Render list of selectable models
      return filteredModels.map(model => (
          <button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)} // Set the selected ID
              className={cn(
                  "w-full text-left p-3 border rounded-md flex items-start gap-3 transition-colors",
                  selectedModelId === model.id
                      ? "bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700 ring-2 ring-blue-400" // Highlight selected
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
              )}
          >
              <Puzzle className="h-5 w-5 mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0"/>
              <div>
                  {/* Display data from backend ModelPublic schema */}
                  <p className="font-medium text-sm">{model.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{model.description || "No description"}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Type: {model.task_type || "N/A"}</p>
              </div>
          </button>
      ));
  };

  // --- Main Modal Return ---
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleOverlayClick}>
          <Card className="w-full max-w-lg h-[70vh] flex flex-col">
              <CardHeader>
                  <div className="flex justify-between items-center">
                      <CardTitle>Select Model</CardTitle>
                      <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                          <X className="h-4 w-4" /> <span className="sr-only">Close</span>
                      </Button>
                  </div>
                  <CardDescription>Choose a model to associate with your project.</CardDescription>
                  <div className="relative pt-2">
                      <Label htmlFor="model-select-search" className="sr-only">Search Models</Label>
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                          id="model-select-search"
                          type="search"
                          placeholder="Search available models..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          disabled={isLoading || !!error} // Disable search if loading/error
                      />
                  </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto space-y-2 pr-2">
                  {renderModalContent()}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4 dark:border-slate-700">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                  <Button onClick={handleSelectClick} disabled={!selectedModelId || isLoading}>
                      Select Model
                  </Button>
              </CardFooter>
          </Card>
      </div>
  );
}

export default SelectModelModal;