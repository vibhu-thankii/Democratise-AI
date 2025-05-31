import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import Button  from '../ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card.jsx'; // FIXED: Added .jsx extension and relative path
import { Input } from '../ui/Input.jsx'; // FIXED: Added .jsx extension and relative path
import { Label }  from '../ui/Label.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../../store/store.js'

// =======================================================================
// --- File: src/components/modals/CreateProjectModal.jsx ---
// =======================================================================
/**
 * Modal dialog component for creating a new project.
 * Takes isOpen, onClose, and onCreate functions as props.
 */
function CreateProjectModal({ isOpen, onClose, onCreate }) {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status
    const addNotification = useStore((state) => state.addNotification);
  
    useEffect(() => {
        if (isOpen) {
            // Reset form and submission state when modal opens
            setProjectName('');
            setDescription('');
            setIsSubmitting(false);
        }
    }, [isOpen]);
  
    if (!isOpen) { return null; }
  
    const handleSubmit = async (e) => { // Make handler async
      e.preventDefault();
      if (!projectName.trim()) {
        addNotification({ message: 'Project name is required.', type: 'error' });
        return;
      }
      setIsSubmitting(true); // Indicate submission start
  
      // Call the onCreate prop, which now handles the async logic
      try {
          await onCreate({ name: projectName.trim(), description: description.trim() });
          // onCreate should handle closing the modal on success
      } catch (error) {
           // onCreate should handle error notification if needed
           console.error("Create project failed in modal:", error);
      } finally {
          setIsSubmitting(false); // Reset submission state regardless of outcome
      }
    };
  
    const handleOverlayClick = (e) => { if (e.target === e.currentTarget && !isSubmitting) { onClose(); } }
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleOverlayClick} >
          <Card className="w-full max-w-md">
              <CardHeader>
                  <div className="flex justify-between items-center">
                      <CardTitle>Create New Project</CardTitle>
                      <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting} className="h-8 w-8">
                          <X className="h-4 w-4" /> <span className="sr-only">Close</span>
                      </Button>
                  </div>
                  <CardDescription>Enter the details for your new AI project.</CardDescription>
              </CardHeader>
              {/* Disable form elements while submitting */}
              <fieldset disabled={isSubmitting}>
                  <form onSubmit={handleSubmit}>
                      <CardContent className="space-y-4">
                          <div className="space-y-2">
                              <Label htmlFor="projectName">Project Name</Label>
                              <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g., My Image Classifier" required autoFocus />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="description">Description (Optional)</Label>
                              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., A model to classify cats vs dogs" />
                          </div>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2">
                          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}> Cancel </Button>
                          <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {/* Show loader */}
                              {isSubmitting ? 'Creating...' : 'Create Project'}
                          </Button>
                      </CardFooter>
                  </form>
              </fieldset>
          </Card>
      </div>
    );
  }
  export default CreateProjectModal; // In real file
  
// =======================================================================
// --- File: src/components/layout/Sidebar.jsx ---
// =======================================================================