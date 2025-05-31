import React, { useState, useMemo } from 'react';
import Button from '../ui/Button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card.jsx';
import {Input} from '../ui/Input.jsx';
import {Label} from '../ui/Label.jsx';
import { X, Search, Database as DatabaseIcon } from 'lucide-react';
import useStore from '../../store/store.js';
import cn from '../../utils/cn.js';

/**
 * Modal for selecting a dataset to associate with a project.
 */
function SelectDatasetModal({ isOpen, onClose, onDatasetSelect }) {
  // Mock data for available datasets (In real app, fetch this or pass as prop)
  const availableDatasets = useMemo(() => [
       { id: 'imagenet-subset', name: 'ImageNet (Subset)', type: 'Image Dataset', description: 'Large-scale visual recognition dataset for classification tasks.' },
       { id: 'mnist', name: 'MNIST', type: 'Handwritten Digits', description: 'Classic dataset of 70,000 grayscale images for image classification.' },
       { id: 'cifar-10', name: 'CIFAR-10', type: 'Image Dataset', description: 'Dataset of 60,000 32x32 colour images in 10 classes.' },
       { id: 'imdb-reviews', name: 'IMDB Movie Reviews', type: 'Text Dataset', description: 'Large dataset of 50,000 movie reviews for sentiment analysis.' },
       { id: 'librispeech', name: 'LibriSpeech ASR', type: 'Audio Dataset', description: 'Large corpus of read English speech for Automatic Speech Recognition.' },
       { id: 'oxford-pets', name: 'Oxford-IIIT Pet Dataset', type: 'Image Dataset', description: '37 category pet dataset with roughly 200 images for each class.' },
       { id: 'support-tickets', name: 'Internal Support Tickets', type: 'Text Dataset', description: 'Collection of anonymized customer support interactions.' },
       { id: 'archives', name: 'Scanned Archives', type: 'Image Dataset', description: 'Historical document scans for OCR training.' },
   ], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const addNotification = useStore((state) => state.addNotification);

  // Filter datasets based on search term
  const filteredDatasets = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableDatasets;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return availableDatasets.filter(d =>
      d.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      d.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [availableDatasets, searchTerm]);

  // Handle selection confirmation
  const handleSelectClick = () => {
    if (!selectedDatasetId) {
      addNotification({ message: 'Please select a dataset first.', type: 'error' });
      return;
    }
    const selectedDataset = availableDatasets.find(d => d.id === selectedDatasetId);
    if (selectedDataset) {
      onDatasetSelect(selectedDataset); // Pass the whole selected dataset object back
    }
    onClose(); // Close the modal
  };

  // Handle clicking the background overlay
  const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
          onClose();
      }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleOverlayClick}>
      <Card className="w-full max-w-lg h-[70vh] flex flex-col"> {/* Increased height */}
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Select Dataset</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" /> <span className="sr-only">Close</span>
            </Button>
          </div>
          <CardDescription>Choose a dataset to associate with your project.</CardDescription>
          {/* Search Input */}
          <div className="relative pt-2">
             <Label htmlFor="dataset-select-search" className="sr-only">Search Datasets</Label>
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
             <Input
                 id="dataset-select-search"
                 type="search"
                 placeholder="Search available datasets..."
                 className="pl-10"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </CardHeader>
        {/* Dataset List */}
        <CardContent className="flex-grow overflow-y-auto space-y-2 pr-2">
          {filteredDatasets.length > 0 ? (
            filteredDatasets.map(dataset => (
              <button
                key={dataset.id}
                onClick={() => setSelectedDatasetId(dataset.id)}
                className={cn(
                  "w-full text-left p-3 border rounded-md flex items-start gap-3 transition-colors",
                  selectedDatasetId === dataset.id
                    ? "bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
                )}
              >
                <DatabaseIcon className="h-5 w-5 mt-1 text-green-600 dark:text-green-400 flex-shrink-0"/>
                <div>
                    <p className="font-medium text-sm">{dataset.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{dataset.description}</p>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">No datasets match your search.</p>
          )}
        </CardContent>
        {/* Footer Actions */}
        <CardFooter className="flex justify-end space-x-2 border-t pt-4 dark:border-slate-700">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSelectClick} disabled={!selectedDatasetId}>
            Select Dataset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default SelectDatasetModal; // In real file