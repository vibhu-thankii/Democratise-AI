import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import Button from '../ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../../store/store.js'; // FIXED: Added .js extension and relative path


// =======================================================================
// --- File: src/components/layout/Header.jsx ---
// =======================================================================
/**
 * Header component displaying logo, navigation controls, theme toggle, and user actions.
 */
function Header({ onToggleSidebar }) {
    const { isAuthenticated, logout, user, theme, toggleTheme } = useStore();
    return ( <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 dark:border-slate-800 dark:bg-slate-950"> <Button variant="outline" size="icon" className="sm:hidden" onClick={onToggleSidebar} > <Menu className="h-5 w-5" /> <span className="sr-only">Toggle Menu</span> </Button> <div className="flex-1"></div> <Button variant="outline" size="icon" onClick={toggleTheme}> {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} <span className="sr-only">Toggle theme</span> </Button> {isAuthenticated ? ( <div className="flex items-center gap-2"> <span className="text-sm font-medium hidden md:inline">Welcome, {user?.name || 'User'}!</span> <Button variant="outline" size="sm" onClick={logout}> <LogOut className="mr-2 h-4 w-4" /> Logout </Button> </div> ) : ( <Button variant="default" size="sm" onClick={() => useStore.setState({ currentPage: 'login' })}> <LogIn className="mr-2 h-4 w-4" /> Login </Button> )} </header> );
  }
  export default Header; // In real file
// =======================================================================
// --- Notes: ---
// - The Header component is designed to be responsive and adapts to different screen sizes.
// - It includes a mobile menu button, theme toggle, and user authentication actions.
// - The component uses Zustand for state management and Next.js for routing.
// - Icons are imported from lucide-react for a consistent design.