import React, { useState, useEffect } from 'react';
import useStore from './store/store.js'; // Import Zustand store hook

// Layout components
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import Notifications from './components/common/Notifications.jsx'; // Import Notifications

// Page components (ensure paths are correct)
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import ModelsPage from './pages/ModelsPages.jsx'; // Check filename if needed
import DatasetsPage from './pages/DatasetsPage.jsx';
import LearnPage from './pages/LearnPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';

// API Helper
import { api } from './lib/api.js';

// Icons (only Loader2 is used directly here)
import { Loader2 } from 'lucide-react';

function App() {
  // Select state and actions individually from the store
  const currentPage = useStore(state => state.currentPage);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const theme = useStore(state => state.theme);
  const viewingProjectId = useStore(state => state.viewingProjectId);
  const login = useStore(state => state.login);
  const logout = useStore(state => state.logout);
  const setCurrentPage = useStore(state => state.setCurrentPage);
  // ** FIXED: Use the correct action name from the store: setViewProject **
  const setViewProject = useStore(state => state.setViewProject);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Track initial auth check

  // Apply theme class to HTML element
  useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
  }, [theme]);

  // Effect for Initial Authentication Check
  useEffect(() => {
      const checkAuth = async () => {
          const token = localStorage.getItem('authToken');
          console.log("Effect (Mount): Checking initial auth token:", token ? 'Found' : 'Not Found');
          if (token) {
              const result = await api.get('/api/v1/auth/me');
              if (result.success && result.data) {
                  console.log("Effect (Mount): Token valid, logging user in store:", result.data);
                  login(result.data);
              } else {
                  console.log("Effect (Mount): Token invalid or expired, logging out.");
                  logout();
              }
          } else {
              console.log("Effect (Mount): No token found, ensuring logged out state.");
               if (isAuthenticated) { // Check store state directly
                  logout();
               }
          }
          setIsInitializing(false); // Mark initialization complete
      };
      checkAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount

  // Effect for handling redirects
  useEffect(() => {
      if (isInitializing) {
          console.log("Effect (Redirect): Skipping redirect check, still initializing.");
          return;
      }

      console.log(`Effect (Redirect): Checking redirects. Auth: ${isAuthenticated}, Page: ${currentPage}, ProjectID: ${viewingProjectId}`);
      const knownPages = ['dashboard', 'projects', 'models', 'datasets', 'learn', 'settings', 'login', 'signup', 'projectDetail'];
      const publicPages = ['login', 'signup', 'learn'];
      const protectedPages = ['dashboard', 'projects', 'models', 'datasets', 'settings', 'projectDetail'];

      let targetPage = currentPage;
      // Your store's setCurrentPage action already handles clearing viewingProjectId,
      // so we don't need a separate shouldClearProjectId flag as complexly.
      // The setViewProject action sets currentPage to 'projectDetail' and the ID.

      if (!isAuthenticated && protectedPages.includes(currentPage)) {
          console.log(`Effect (Redirect): Redirecting to login from protected page: ${currentPage}`);
          targetPage = 'login';
      } else if (isAuthenticated && (currentPage === 'login' || currentPage === 'signup')) {
          console.log(`Effect (Redirect): Redirecting logged-in user from ${currentPage} page to dashboard.`);
          targetPage = 'dashboard';
      } else if (!knownPages.includes(currentPage)) {
           const defaultPage = isAuthenticated ? 'dashboard' : 'login';
           console.warn(`Effect (Redirect): Unknown page state "${currentPage}", redirecting to ${defaultPage}.`);
           targetPage = defaultPage;
      }

      if (targetPage !== currentPage) {
          console.log(`Effect (Redirect): Setting currentPage: ${targetPage}`);
          setCurrentPage(targetPage); // This action in your store clears viewingProjectId
      }

  // ** FIXED: Dependency array uses the correct action name from the store **
  }, [currentPage, isAuthenticated, viewingProjectId, isInitializing, setCurrentPage, setViewProject]);


  // --- Event Handlers ---
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const handleSelectProject = (projectId) => {
      if (projectId) {
          console.log("App: Selecting project ID:", projectId);
          // ** FIXED: Use the correct action name from the store **
          setViewProject(projectId); // This action sets BOTH viewingProjectId and currentPage to 'projectDetail'
      } else {
          console.error("App: handleSelectProject called with invalid projectId:", projectId);
      }
  };

   const handleBackToProjects = () => {
      // ** FIXED: Use setCurrentPage which implicitly clears the ID in your store **
      setCurrentPage('projects'); // Go back to projects list (store action clears viewingProjectId)
   };

   const handleCreateProject = () => {
       console.log("App: Create Project action triggered.");
       // Example: Open a modal (you would need state for this)
       // setIsCreateModalOpen(true);
       // OR Navigate to a route:
       // setCurrentPage('createProject');
       alert("Create project functionality not yet implemented."); // Placeholder
   };


  // Page Rendering Logic
  const renderPage = () => {
      console.log("Render: Rendering page:", currentPage, "with Project ID:", viewingProjectId);
      switch (currentPage) {
          case 'dashboard': return <DashboardPage />;
          case 'projects': return (
              <ProjectsPage
                  onSelectProject={handleSelectProject}
                  onCreateProject={handleCreateProject}
              />
          );
          case 'models': return <ModelsPage />;
          case 'datasets': return <DatasetsPage />;
          case 'learn': return <LearnPage />;
          case 'settings': return <SettingsPage />;
          case 'login': return <LoginPage />;
          case 'signup': return <SignUpPage />;
          case 'projectDetail':
              // Ensure we have an ID before rendering the detail page
              if (viewingProjectId) {
                  return (
                      <ProjectDetailPage
                          projectId={viewingProjectId}
                          onBack={handleBackToProjects}
                      />
                  );
              } else {
                  // Should not happen if logic is correct, but handle defensively
                  console.error("App: Trying to render ProjectDetailPage without a viewingProjectId! Redirecting to projects.");
                  setCurrentPage('projects'); // Redirect back to projects
                  // It's better to return null or a loading indicator while redirecting
                  return null;
              }
          default:
              console.warn("Render: Reached default case in renderPage, currentPage:", currentPage);
              // Redirect to a sensible default if currentPage is somehow unknown
              setCurrentPage(isAuthenticated ? 'dashboard' : 'login');
              return null; // Return null while redirecting
      }
  };

  // Show loading indicator during initialization
  if (isInitializing) {
      return (
          <div className="flex items-center justify-center min-h-screen w-full bg-slate-100 dark:bg-slate-900">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500"/>
              <span className="ml-3 text-lg text-slate-700 dark:text-slate-300">Initializing...</span>
          </div>
      );
  }

  // Render main application UI once initialization is complete
  return (
      <>
          <div className={`flex min-h-screen w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50`}>
              {/* Render Sidebar only if authenticated */}
              {isAuthenticated && <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />}
              <div className="flex flex-1 flex-col">
                  {/* Render Header only if authenticated */}
                  {isAuthenticated && <Header onToggleSidebar={handleToggleSidebar} />}
                  <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                      {renderPage()}
                  </main>
              </div>
          </div>
          <Notifications />
      </>
  );
}
export default App;
