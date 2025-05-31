import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card.jsx'; // FIXED: Added .jsx extension and relative path
import Button from '../components/ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../store/store.js'; // FIXED: Added .js extension and relative path


// =======================================================================
// --- File: src/pages/DashboardPage.jsx ---
// =======================================================================
/**
 * Dashboard page component displaying overview cards.
 */
function DashboardPage() {
    const projectCount = useStore((state) => state.projects?.length) ?? 0; // Example: Get count from state if available
    return ( <div className="space-y-6"> <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1> <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's a quick overview of your activities.</p> <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> <Card> <CardHeader> <CardTitle>My Projects</CardTitle> <CardDescription>View and manage your AI projects.</CardDescription> </CardHeader> <CardContent> <p>You have {projectCount} active project{projectCount !== 1 ? 's' : ''}.</p> </CardContent> <CardFooter> <Button size="sm" onClick={() => useStore.setState({ currentPage: 'projects' })}>View Projects</Button> </CardFooter> </Card> <Card> <CardHeader> <CardTitle>Explore Models</CardTitle> <CardDescription>Discover pre-trained models.</CardDescription> </CardHeader> <CardContent> <p>Browse hundreds of open-source models.</p> </CardContent> <CardFooter> <Button size="sm" onClick={() => useStore.setState({ currentPage: 'models' })}>Explore Models</Button> </CardFooter> </Card> <Card> <CardHeader> <CardTitle>Learn AI</CardTitle> <CardDescription>Access tutorials and guides.</CardDescription> </CardHeader> <CardContent> <p>Start with our beginner's guide.</p> </CardContent> <CardFooter> <Button size="sm" onClick={() => useStore.setState({ currentPage: 'learn' })}>Start Learning</Button> </CardFooter> </Card> </div> </div> );
  }
  export default DashboardPage; // In real file