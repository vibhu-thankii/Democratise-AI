import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc


// =======================================================================
// --- File: src/utils/cn.js ---
// =======================================================================
/**
 * Simple utility to merge Tailwind CSS class names conditionally.
 * In a real project, you might use libraries like `clsx` and `tailwind-merge`.
 * @param {...string} classes - Class names to potentially merge.
 * @returns {string} - The merged class string.
 */
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default cn;