import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import Button  from '../ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../../store/store.js'; // FIXED: Added .js extension and relative path
import cn from '../../utils/cn.js'; // FIXED: Added .js extension and relative path
// Icons are passed as props, so no direct lucide import needed here


// =======================================================================
// --- File: src/components/layout/NavItem.jsx ---
// =======================================================================
/**
 * Individual navigation item component used within the Sidebar.
 * Highlights itself if its page matches the current page in the store.
 */
function NavItem({ icon: Icon, label, page }) {
    const { currentPage, setCurrentPage } = useStore();
    const isActive = currentPage === page;
    return ( <Button variant={isActive ? "secondary" : "ghost"} size="default" className={cn( "w-full justify-start text-base", isActive ? "font-semibold" : "font-normal" )} onClick={() => setCurrentPage(page)} > <Icon className={cn("mr-3 h-5 w-5", isActive ? "" : "text-slate-500 dark:text-slate-400")} /> {label} </Button> );
  }
  export default NavItem; // In real file