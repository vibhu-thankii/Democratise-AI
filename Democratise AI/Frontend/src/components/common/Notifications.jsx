import useStore from '../../store/store.js'; // Example import
import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import cn from '../../utils/cn.js'; // Example import

/**
 * Component to display toast-like notifications from the global store.
 * Positions itself in the top-right corner.
 */
function Notifications() {
    const notifications = useStore((state) => state.notifications);
    const removeNotification = useStore((state) => state.removeNotification);
    if (notifications.length === 0) { return null; }
    const notificationConfig = { success: { Icon: CheckCircle, classes: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200' }, error: { Icon: XCircle, classes: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200' }, info: { Icon: Info, classes: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200' }, };
    return ( <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3"> {notifications.map((notification) => { const config = notificationConfig[notification.type] || notificationConfig.info; const { Icon, classes } = config; return ( <div key={notification.id} className={cn( "relative w-full rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out animate-in slide-in-from-top", "flex items-start space-x-3", classes )} > <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" /> <div className="flex-1 text-sm font-medium">{notification.message}</div> {/* FIX: Use imported X icon directly */} <button onClick={() => removeNotification(notification.id)} className="absolute top-1 right-1 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10" aria-label="Dismiss notification" > <X className="h-4 w-4 opacity-70" /> </button> </div> ); })} </div> );
  }
  export default Notifications; // In real file