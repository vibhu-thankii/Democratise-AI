import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import cn from '../../utils/cn.js'; // FIXED: Added .js extension and relative path


// =======================================================================
// --- File: src/components/ui/Label.jsx ---
// (Basic Label component)
// =======================================================================
/**
 * A basic styled label component, often used with Input.
 */
const Label = React.forwardRef(({ className, ...props }, ref) => ( <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} /> ))
Label.displayName = "Label"
export  {Label} // In real file