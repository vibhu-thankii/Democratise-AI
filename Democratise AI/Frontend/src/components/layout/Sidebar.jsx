import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand'; // Needed for store definition
import NavItem from './NavItem.jsx'; // FIXED: Added .jsx extension
import Button  from '../ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../../store/store.js'; // FIXED: Added .js extension and relative path
import cn from '../../utils/cn.js'; // FIXED: Added .js extension and relative path
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc



// =======================================================================
// --- File: src/components/layout/Sidebar.jsx ---
// =======================================================================
/**
 * Sidebar component containing navigation links.
 * Adapts links based on authentication status.
 * Handles mobile view (sliding in/out) and overlay.
 */
function Sidebar({ isOpen, onClose }) {
    const { isAuthenticated } = useStore();
   const commonNavItems = [ { icon: Home, label: "Dashboard", page: "dashboard" }, { icon: GraduationCap, label: "Learn", page: "learn" }, { icon: Settings, label: "Settings", page: "settings" }, ];
    const authenticatedNavItems = [ { icon: FolderKanban, label: "My Projects", page: "projects" }, { icon: Puzzle, label: "Models Hub", page: "models" }, { icon: Database, label: "Datasets Hub", page: "datasets" }, ...commonNavItems, ];
    const guestNavItems = [ ...commonNavItems, ];
    const navItems = isAuthenticated ? authenticatedNavItems : guestNavItems;
   return ( <> {isOpen && ( <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm sm:hidden" onClick={onClose} ></div> )} <aside className={cn( "fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 dark:border-slate-800 dark:bg-slate-950", isOpen ? "translate-x-0" : "-translate-x-full" )} > <div className="flex h-14 items-center border-b border-slate-200 px-6 dark:border-slate-800"> <a href="#" className="flex items-center gap-2 font-semibold"> <Puzzle className="h-6 w-6 text-blue-600" /> <span className="">DemocratizeAI</span> </a> <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={onClose} > <X className="h-5 w-5" /> <span className="sr-only">Close Menu</span> </Button> </div> <nav className="flex-1 overflow-auto py-4 px-4"> <div className="flex flex-col gap-1"> {navItems.map((item) => ( <NavItem key={item.page} {...item} /> ))} </div> </nav> </aside> </> );
 }
 export default Sidebar; // In real file