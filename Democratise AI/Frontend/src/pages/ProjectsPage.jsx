// =======================================================================
// --- File: src/pages/ProjectsPage.jsx --- (UPDATED)
// =======================================================================
import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import CreateProjectModal from '../components/modals/CreateProjectModal.jsx';
import useStore from '../store/store.js';
import cn from '../utils/cn.js'; // Import cn utility
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc, ArrowLeft,ArrowRight, Search } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import Select from '../components/ui/Select.jsx';
import {Label} from '../components/ui/Label.jsx'; // Adjust path if needed
import { api } from '../lib/api'
import { Input } from '../components/ui/Input.jsx'; // Adjust path if needed
import SelectModelModal from '../components/modals/SelectModelModal.jsx';
import SelectDatasetModal from '../components/modals/SelectDatasetModal.jsx';
import ProjectFilters from '../components/filters/ProjectFilters.jsx'; // Import ProjectFilters


/**
 * Projects page component: Fetches and displays user projects.
 */
function ProjectPage({ onSelectProject, onCreateProject }) { // Added onCreateProject prop handler
    // Zustand store state and actions
    const addNotification = useStore((state) => state.addNotification);
  
    // Component state
    const [projects, setProjects] = useState([]); // Use 'useState<ProjectPublic[]>([]') with TypeScript
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // New state for status filter
    const [sortField, setSortField] = useState('updated_at'); // New state for sort field
    const [sortDirection, setSortDirection] = useState('desc'); // New state for sort direction
  
    // Fetch projects from the API when the component mounts
    useEffect(() => {
      const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);
        console.log("Fetching projects from backend...");
  
        // Use the centralized api helper which should handle auth token automatically
        // The API spec indicates pagination is possible, fetching first 200 here.
        const result = await api.get('/api/v1/projects/', { params: { limit: 200, skip: 0 } });
  
        if (result.success) {
          // Ensure the data received is an array
          if (Array.isArray(result.data)) {
            setProjects(result.data);
            console.log("Fetched projects:", result.data);
          } else {
            console.error("API did not return an array for projects:", result.data);
            const errorMsg = "Received invalid data format from server.";
            setError(errorMsg);
            addNotification({ message: errorMsg, type: 'error' });
          }
        } else {
          // Handle API errors (including potential 401 handled by apiFetch)
          console.error("Failed to fetch projects:", result.error);
          const errorMsg = `Failed to load projects: ${result.error}`;
          setError(errorMsg);
          // Use Zustand notification system
          addNotification({ message: errorMsg, type: 'error' });
          // If apiFetch didn't handle logout/redirect on 401, you might need additional logic here
        }
        setIsLoading(false); // Set loading false after fetch attempt
      };
  
      fetchProjects();
      // Dependency array includes addNotification as it's used in the effect
    }, [addNotification]);
  
    // Enhanced filteredProjects with sorting and status filtering
    const filteredProjects = useMemo(() => {
      if (!Array.isArray(projects)) return [];
      
      let tempProjects = [...projects]; // Create a copy to avoid mutating
      
      // Apply status filter
      if (statusFilter !== 'all') {
        tempProjects = tempProjects.filter(p => p.status === statusFilter);
      }
      
      // Apply search term filter
      if (searchTerm.trim() !== '') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        tempProjects = tempProjects.filter(p =>
          (p.name?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
          (p.description?.toLowerCase() || '').includes(lowerCaseSearchTerm)
        );
      }
      
      // Apply sorting
      tempProjects.sort((a, b) => {
        // Handle null or undefined values
        const valueA = a[sortField] || '';
        const valueB = b[sortField] || '';
        
        // String comparison for strings, numeric for dates
        let comparison;
        if (sortField === 'created_at' || sortField === 'updated_at') {
          comparison = new Date(valueA) - new Date(valueB);
        } else {
          comparison = String(valueA).localeCompare(String(valueB));
        }
        
        // Apply sort direction
        return sortDirection === 'asc' ? comparison : -comparison;
      });
      
      return tempProjects;
    }, [projects, searchTerm, statusFilter, sortField, sortDirection]);
  
    // Check if any filters are applied for "Clear Filters" button state
    const hasFiltersApplied = useMemo(() => {
      return searchTerm !== '' || statusFilter !== 'all' || 
             sortField !== 'updated_at' || sortDirection !== 'desc';
    }, [searchTerm, statusFilter, sortField, sortDirection]);
  
    // Handle clearing all filters
    const handleClearFilters = () => {
      setSearchTerm('');
      setStatusFilter('all');
      setSortField('updated_at');
      setSortDirection('desc');
    };
  
    // --- Render Logic ---
    const renderContent = () => {
      // 1. Loading State
      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500 dark:text-slate-400" />
            <span className="ml-2 text-slate-500 dark:text-slate-400">Loading projects...</span>
          </div>
        );
      }
  
      // 2. Error State
      if (error) {
        return (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400 mb-2" />
            <p className="text-red-700 dark:text-red-300 font-medium">Error loading projects</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1 max-w-md">{error}</p>
            {/* Optional: Add a retry button if needed */}
            {/* <Button onClick={fetchProjects} variant="destructive" size="sm" className="mt-3">Retry</Button> */}
          </div>
        );
      }
  
      // 3. No Projects Found (after filtering or initial load)
      if (filteredProjects.length === 0) {
        return (
          <div className="text-center py-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <FolderKanban className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-50">
              {searchTerm ? 'No projects match your search' : 'No projects found'}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {searchTerm ? 'Try adjusting your search term.' : 'Get started by creating a new project.'}
            </p>
            {!searchTerm && onCreateProject && ( // Show create button only if no search term and handler exists
              <Button size="sm" onClick={onCreateProject} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            )}
          </div>
        );
      }
  
      // 4. Render Project Cards
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <Card
               key={project.id} // Use unique project ID
               className="flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                   {/* Use 'name' field from ProjectPublic schema */}
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50 line-clamp-1">{project.name}</CardTitle>
                  {/* Display status using a Badge */}
                  <Badge variant={project.status === 'active' ? 'success' : 'secondary'} className="flex-shrink-0 capitalize">
                    {project.status || 'Unknown'}
                  </Badge>
                </div>
                {/* Use 'description' field */}
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-1 h-[40px] text-sm line-clamp-2"> {/* Fixed height and line clamp */}
                    {project.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                {/* Display other relevant info like update date */}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last Updated: {new Date(project.updated_at).toLocaleDateString()}
                </p>
                {/* Could add counts of models/datasets if available and needed */}
                {/* <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Models: {project.models?.length || 0}</p> */}
              </CardContent>
              <CardFooter className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                {/* Button to navigate to project details */}
                <Button
                  onClick={() => onSelectProject(project.id)} // Pass project ID to handler
                  className="w-full"
                  variant="outline"
                  size="sm" // Smaller button in footer
                >
                  View Details <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    };
  
    // --- Main Component Return ---
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">My Projects</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your machine learning projects.</p>
          </div>
           {/* Conditionally render Create Project button if handler is provided */}
           {onCreateProject && (
              <Button onClick={onCreateProject} disabled={isLoading}>
                  <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
           )}
        </div>
  
        {/* Filters - Only show if there are projects or loading isn't finished yet */}
        {(projects.length > 0 || isLoading) && !error && (
          <ProjectFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            isLoading={isLoading}
            hasFiltersApplied={hasFiltersApplied}
            onClearFilters={handleClearFilters}
          />
        )}
  
        {/* Render Content Area (Loading/Error/Empty/Grid) */}
        {renderContent()}
  
      </div>
    );
  }
  
  export default ProjectPage;