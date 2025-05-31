import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import cn from '../../utils/cn.js'; // FIXED: Added .js extension and relative path



// =======================================================================
// --- File: src/components/ui/Badge.jsx ---
// (Inspired by shadcn/ui - defined here for simplicity)
// =======================================================================
/**
 * Badge component for displaying status labels or tags with variants.
 */
const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
    const variants = { default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80", secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80", destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80", outline: "text-slate-950 dark:text-slate-50", success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", warning: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", info: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", };
    return ( <div ref={ref} className={cn( "inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300", variants[variant], className )} {...props} /> );
});
Badge.displayName = "Badge";
export default Badge; // In real file