import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import cn from '../../utils/cn.js'; // FIXED: Added .js extension and relative path

// =======================================================================
// --- File: src/components/ui/Button.jsx ---
// (Inspired by shadcn/ui - defined here for simplicity)
// =======================================================================
/**
 * A customizable button component with variants and sizes.
 */
const Button = React.forwardRef(({ className, variant = 'default', size = 'default', asChild = false, disabled, ...props }, ref) => { // Added disabled prop
  const variants = { default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200", destructive: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900", outline: "border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800", secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-50 dark:hover:bg-slate-600", ghost: "hover:bg-slate-100 dark:hover:bg-slate-800", link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50", };
  const sizes = { default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3", lg: "h-11 rounded-md px-8", icon: "h-10 w-10", };
  const Comp = asChild ? 'span' : 'button';
  return ( <Comp className={cn( "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none dark:focus-visible:ring-slate-500 dark:ring-offset-slate-900", variants[variant], sizes[size], className )} ref={ref} disabled={disabled} {...props} /> ); // Pass disabled prop
});
Button.displayName = "Button";
export default Button; // In real file