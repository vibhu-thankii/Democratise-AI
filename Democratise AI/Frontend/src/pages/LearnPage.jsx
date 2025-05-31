import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc, BookOpen, Lightbulb, Video } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card.jsx'; // FIXED: Added .jsx extension and relative path
import Button  from '../components/ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../store/store.js';

// =======================================================================
// --- File: src/pages/LearnPage.jsx ---
// =======================================================================
/**
 * Learn page component (Placeholder).
 * TODO: Populate with actual learning resources.
 */
function LearnPage() {
  const addNotification = useStore((state) => state.addNotification);

  // Expanded mock data with categories
  const allLearnResources = useMemo(() => [
      { id: 1, title: "Introduction to Machine Learning", type: "Guide", category: "Getting Started", description: "Understand the basic concepts, terminology, and types of ML.", icon: BookOpen },
      { id: 5, title: "Setting Up Your Environment", type: "Guide", category: "Getting Started", description: "How to install necessary tools and libraries for local development.", icon: BookOpen },
      { id: 2, title: "Fine-tuning Explained", type: "Tutorial", category: "Tutorials", description: "Learn how to adapt pre-trained models like BERT or ResNet for specific tasks.", icon: Video },
      { id: 4, title: "Data Preparation Techniques", type: "Tutorial", category: "Tutorials", description: "Essential steps for cleaning, transforming, and preparing your data for training.", icon: Video },
      { id: 6, title: "Building a Simple Classifier", type: "Tutorial", category: "Tutorials", description: "Step-by-step guide to training your first image classification model.", icon: Video },
      { id: 3, title: "Understanding Neural Networks", type: "Concepts", category: "Concepts", description: "A deeper dive into the architecture, layers, and activation functions of neural nets.", icon: Lightbulb },
      { id: 7, title: "What is Overfitting?", type: "Concepts", category: "Concepts", description: "Learn about overfitting, underfitting, and techniques like regularization.", icon: Lightbulb },
      { id: 8, title: "Evaluation Metrics", type: "Concepts", category: "Concepts", description: "Understanding accuracy, precision, recall, F1-score, AUC, and when to use them.", icon: Lightbulb },
  ], []); // Stable mock data

  // State for category filter
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'Getting Started', etc.

  // Get unique categories for filter buttons
  const categories = useMemo(() => {
      const cats = new Set(allLearnResources.map(res => res.category));
      return ['all', ...Array.from(cats).sort()]; // Add 'all' option
  }, [allLearnResources]);

  // Filtering Logic
  const filteredResources = useMemo(() => {
    if (categoryFilter === 'all') {
      return allLearnResources;
    }
    return allLearnResources.filter(res => res.category === categoryFilter);
  }, [allLearnResources, categoryFilter]); // Re-filter when data or filter changes

  // Handler for clicking a resource (simulated)
  const handleLearnClick = (title) => {
      addNotification({ message: `Loading "${title}"... (Not Implemented)`, type: 'info' });
  }

  // Map resource types to icons (optional, could also use category icons)
  const typeIconMap = {
      'Guide': BookOpen,
      'Tutorial': Video,
      'Concepts': Lightbulb,
      // Add more as needed
  };

  return (
     <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Learn AI</h1>
       <p className="text-slate-600 dark:text-slate-400">Tutorials, guides, and resources to help you get started on your AI journey.</p>

       {/* Category Filter Buttons */}
       <div className="flex flex-wrap gap-2">
           <span className="text-sm font-medium mr-2 self-center text-slate-600 dark:text-slate-400">Filter by Category:</span>
           {categories.map(category => (
               <Button
                   key={category}
                   variant={categoryFilter === category ? 'default' : 'outline'}
                   size="sm"
                   onClick={() => setCategoryFilter(category)}
               >
                   {category === 'all' ? 'All' : category}
               </Button>
           ))}
       </div>

       {/* Render filtered resources */}
       {filteredResources.length > 0 ? (
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {filteredResources.map(resource => {
                 const Icon = typeIconMap[resource.type] || GraduationCap; // Fallback icon
                 return (
                     <Card key={resource.id} className="flex flex-col"> {/* Ensure cards have equal height potential */}
                       <CardHeader>
                           <div className="flex items-center justify-between">
                               <CardTitle>{resource.title}</CardTitle>
                               <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                           </div>
                           <CardDescription>{resource.category} - {resource.type}</CardDescription>
                       </CardHeader>
                       <CardContent className="flex-grow"> {/* Allow content to grow */}
                           <p className="text-sm text-slate-600 dark:text-slate-300">{resource.description}</p>
                       </CardContent>
                       <CardFooter>
                           <Button size="sm" onClick={() => handleLearnClick(resource.title)}>
                               {resource.type === 'Tutorial' ? 'Start Tutorial' : 'Read Guide'}
                           </Button>
                       </CardFooter>
                     </Card>
                 );
             })}
           </div>
       ) : (
            // Message when no resources match filter
            <div className="text-center py-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                <Filter className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-50">No resources match filter "{categoryFilter}"</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try selecting a different category or "All".</p>
                <div className="mt-6">
                    <Button variant="outline" onClick={() => setCategoryFilter('all')}>
                        Show All Resources
                    </Button>
                </div>
            </div>
       )}
    </div>
  );
}
export default LearnPage; // In real file
