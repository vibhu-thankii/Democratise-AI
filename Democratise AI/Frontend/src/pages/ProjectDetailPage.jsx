import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.jsx'; // Adjust path if needed
import Button from '../components/ui/Button.jsx'; // Adjust path if needed
import Badge from '../components/ui/Badge.jsx'; // Adjust path if needed
import { ArrowLeft, Loader2, AlertTriangle, Link as LinkIcon, Github } from 'lucide-react'; // Import necessary icons
import useStore from '../store/store.js'; // Import Zustand store hook
import { api } from '../lib/api'; // Import the centralized API helper

// Define the expected structure based on ProjectPublic schema (optional but helpful)
// interface ProjectPublic {
//   id: number;
//   name: string;
//   description?: string | null;
//   user_id: number;
//   status: string;
//   created_at: string; // ISO date string
//   updated_at: string; // ISO date string
//   models?: any[]; // Define more specific types if needed
//   datasets?: any[]; // Define more specific types if needed
//   training_runs?: any[]; // Define more specific types if needed
//   // Add repoUrl and liveUrl if your API actually provides them
//   repoUrl?: string | null;
//   liveUrl?: string | null;
// }

/**
 * ProjectDetailPage Component: Displays details for a specific project fetched from the API.
 */
function ProjectDetailPage({ projectId, onBack }) { // Accepts projectId and onBack function as props
  // Zustand store actions
  const addNotification = useStore((state) => state.addNotification);

  // Component state
  const [project, setProject] = useState(null); // Use 'useState<ProjectPublic | null>(null)' with TypeScript
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch project details when projectId changes or component mounts
  useEffect(() => {
    // Validate projectId prop
    if (!projectId) {
      console.error("ProjectDetailPage: projectId prop is missing or invalid:", projectId);
      setError('No project ID provided.');
      setIsLoading(false);
      // Optionally call onBack() or notify user more formally
      addNotification({ message: 'Cannot load project details without a valid ID.', type: 'error' });
      return; // Stop execution if no valid ID
    }

    const fetchProjectDetails = async () => {
      setIsLoading(true);
      setError(null); // Reset error before new fetch
      console.log(`Fetching details for project ID: ${projectId}...`);

      // Construct the API endpoint URL for the specific project
      const apiUrl = `/api/v1/projects/${projectId}`;

      // Use the centralized api helper
      const result = await api.get(apiUrl);

      if (result.success) {
        // Add validation if needed (e.g., check if result.data has expected fields)
        setProject(result.data); // Set the fetched project data
        console.log("Fetched project details:", result.data);
      } else {
        // Handle API errors
        console.error(`Failed to fetch project ${projectId}:`, result.error);
        const errorMsg = `Failed to load project details: ${result.error}`;
        setError(errorMsg);
        addNotification({ message: errorMsg, type: 'error' });
        // If 404 (Not Found), set a specific message?
        if (result.status === 404) {
             setError(`Project with ID ${projectId} not found.`);
        }
      }
      setIsLoading(false); // Set loading false after fetch attempt
    };

    fetchProjectDetails();

    // Dependency array includes projectId and addNotification
    // Refetch if projectId changes
  }, [projectId, addNotification]);

  // --- Render Logic ---

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500 dark:text-slate-400" />
        <span className="mt-2 text-slate-500 dark:text-slate-400">Loading project details...</span>
        {/* Back button can be shown even while loading */}
        <Button onClick={onBack} variant="outline" size="sm" className="mt-4 rounded-md">
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
         {/* Back Button is important here */}
         <div className="mb-6 text-left">
             <Button onClick={onBack} variant="outline" className="rounded-md">
               <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
             </Button>
         </div>
         {/* Error Display */}
         <div className="flex flex-col items-center justify-center h-40 text-center p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400 mb-2" />
            <p className="text-red-700 dark:text-red-300 font-medium">Error loading project details</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1 max-w-md">{error}</p>
         </div>
      </div>
    );
  }

  // 3. Project Not Found (after successful fetch but no data)
  // This might be redundant if the API error handles 404 correctly, but can be a fallback.
  if (!project) {
     return (
       <div className="container mx-auto px-4 py-8 text-center">
         <div className="mb-6 text-left">
            <Button onClick={onBack} variant="outline" className="rounded-md">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
         </div>
         <p className="text-slate-600 dark:text-slate-400">Project data could not be loaded or the project does not exist.</p>
       </div>
     );
  }

  // 4. Render Project Details
  return (
    <div className="container mx-auto px-0 sm:px-4 py-8 font-sans"> {/* Removed horizontal padding on smallest screens */}
      {/* Back Button */}
       <div className="mb-6">
           <Button onClick={onBack} variant="outline" className="rounded-md">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
           </Button>
       </div>

      {/* Project Details Card */}
      <Card className="w-full max-w-4xl mx-auto rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">{project.name}</CardTitle>
              <Badge variant={project.status === 'active' ? 'success' : 'secondary'} className="capitalize text-sm px-3 py-1">
                  {project.status || 'Unknown'}
              </Badge>
          </div>
          {project.description && (
            <CardDescription className="text-base text-slate-600 dark:text-slate-400 mt-2">
                {project.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* --- Add Sections for Models, Datasets, Training Runs etc. --- */}

          {/* Example: Associated Models (if API provides project.models) */}
          {project.models && project.models.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">Associated Models</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {project.models.map(model => (
                  <li key={model.id}>{model.name} ({model.source_identifier})</li>
                ))}
              </ul>
            </div>
          )}

          {/* Example: Associated Datasets (if API provides project.datasets) */}
           {project.datasets && project.datasets.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">Associated Datasets</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {project.datasets.map(dataset => (
                  <li key={dataset.id}>{dataset.name} {dataset.is_public ? '(Public)' : ''}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Example: Training Runs (if API provides project.training_runs) */}
          {project.training_runs && project.training_runs.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">Training Runs</h3>
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Run ID</th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Model ID</th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Dataset ID</th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Completed</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                          {project.training_runs.map(run => (
                              <tr key={run.id}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{run.id}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm capitalize"><Badge variant={run.status === 'completed' ? 'success' : (run.status === 'failed' ? 'destructive' : 'secondary')}>{run.status}</Badge></td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{run.model_id}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{run.dataset_id}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{run.completed_at ? new Date(run.completed_at).toLocaleString() : 'N/A'}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            </div>
          )}


          {/* Placeholder for Links (if your API adds them later) */}
          { (project.repoUrl || project.liveUrl) && (
              <div>
                <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">Links</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                    >
                      <Github className="mr-2 h-5 w-5" /> View Repository
                    </a>
                  )}
                  {project.liveUrl && (
                     <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                      <LinkIcon className="mr-2 h-5 w-5" /> Live Demo / Link
                    </a>
                  )}
                </div>
              </div>
          )}

          {/* General Info */}
           <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">Details</h3>
               <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="sm:col-span-1">
                      <dt className="font-medium text-slate-500 dark:text-slate-400">Project ID</dt>
                      <dd className="mt-1 text-slate-900 dark:text-slate-100">{project.id}</dd>
                  </div>
                   <div className="sm:col-span-1">
                      <dt className="font-medium text-slate-500 dark:text-slate-400">Owner User ID</dt>
                      <dd className="mt-1 text-slate-900 dark:text-slate-100">{project.user_id}</dd>
                  </div>
                   <div className="sm:col-span-1">
                      <dt className="font-medium text-slate-500 dark:text-slate-400">Created</dt>
                      <dd className="mt-1 text-slate-900 dark:text-slate-100">{new Date(project.created_at).toLocaleString()}</dd>
                  </div>
                   <div className="sm:col-span-1">
                      <dt className="font-medium text-slate-500 dark:text-slate-400">Last Updated</dt>
                      <dd className="mt-1 text-slate-900 dark:text-slate-100">{new Date(project.updated_at).toLocaleString()}</dd>
                  </div>
              </dl>
           </div>

        </CardContent>
        {/* Footer could contain actions like Edit, Delete, Train etc. */}
        {/* <CardFooter className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
             <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
                <Button size="sm">Train Model</Button>
             </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}

export default ProjectDetailPage;
