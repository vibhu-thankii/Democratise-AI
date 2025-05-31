// File: src/store/store.js
import { create } from 'zustand';

/**
 * Zustand store for managing global application state.
 */
const useStore = create((set, get) => ({
    // --- State ---
    currentPage: 'dashboard',
    viewingProjectId: null, // Needed for tracking which project detail page to show
    isAuthenticated: false,
    user: null, // Stores user info like { id, name, email } after login
    theme: localStorage.getItem('theme') || 'light',
    notifications: [],

    // --- Actions ---
    setCurrentPage: (page) => set({ currentPage: page, viewingProjectId: null }), // Reset project ID on general page change
    setViewProject: (projectId) => set({ currentPage: 'projectDetail', viewingProjectId: projectId }), // Action to navigate to a specific project

    // Called by Login page after successful API login & fetching /me
    login: (userData) => {
        console.log("Store: Setting authenticated state with user:", userData);
        set({ isAuthenticated: true, user: userData });
    },

    // Called by Header logout button or on auth error
    logout: () => {
        console.log("Store: Logging out, clearing token and state.");
        localStorage.removeItem('authToken'); // <<< IMPORTANT: Remove token from storage
        set({
            isAuthenticated: false,
            user: null,
            currentPage: 'login', // Redirect to login page is common after logout
            viewingProjectId: null // Clear viewing project ID
        });
        // Optional: Add a notification
        get().addNotification({ message: 'You have been logged out.', type: 'info' });
    },

    // Theme toggling
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      return { theme: newTheme };
    }),

    // Notification handling
    addNotification: (notification) => {
      const id = notification.id || Date.now() + Math.random();
      if(notification.id && get().notifications.some(n => n.id === notification.id)) {
        return; // Avoid duplicates if ID provided and exists
      }
      set((state) => ({
        notifications: [...state.notifications, { ...notification, id }],
      }));
      const duration = notification.duration === undefined ? 5000 : notification.duration;
      if (duration !== Infinity) {
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      }
    },
    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    },
}));

export default useStore;