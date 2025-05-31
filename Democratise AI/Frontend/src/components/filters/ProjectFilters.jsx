// src/components/filters/ProjectFilters.jsx
import React from 'react';
import { Input } from '../ui/Input.jsx';
import { Label } from '../ui/Label.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import cn from '../../utils/cn.js';

/**
 * A comprehensive filter component for projects
 * Provides search, status filtering, and sorting options
 */
const ProjectFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  isLoading,
  hasFiltersApplied,
  onClearFilters,
}) => {
  // Toggle sort direction when the same field is selected
  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc'); // Default to ascending for new field
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium flex items-center">
          <Filter className="mr-2 h-4 w-4 text-slate-500" /> 
          Filter Projects
        </h2>
        {hasFiltersApplied && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="mr-1 h-3 w-3" /> Clear Filters
          </Button>
        )}
      </div>

      {/* Main Filters Area */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search Input */}
        <div className="relative">
          <Label htmlFor="project-search" className="sr-only">Search Projects</Label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            id="project-search"
            type="search"
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Label htmlFor="status-filter" className="text-xs mb-1 block">Status</Label>
          <Select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={isLoading}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </Select>
        </div>

        {/* Sort Field */}
        <div>
          <Label htmlFor="sort-field" className="text-xs mb-1 block">Sort By</Label>
          <Select
            id="sort-field"
            value={sortField}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={isLoading}
          >
            <option value="name">Name</option>
            <option value="created_at">Date Created</option>
            <option value="updated_at">Last Updated</option>
          </Select>
        </div>

        {/* Sort Direction - Button Group */}
        <div>
          <Label className="text-xs mb-1 block">Direction</Label>
          <div className="flex rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "flex-1 rounded-none border-0 h-10",
                sortDirection === 'asc' ? 'bg-slate-100 dark:bg-slate-800' : ''
              )}
              onClick={() => setSortDirection('asc')}
              disabled={isLoading}
            >
              <SortAsc className="h-4 w-4 mr-1" /> Asc
            </Button>
            <div className="w-px bg-slate-300 dark:bg-slate-700"></div>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "flex-1 rounded-none border-0 h-10",
                sortDirection === 'desc' ? 'bg-slate-100 dark:bg-slate-800' : ''
              )}
              onClick={() => setSortDirection('desc')}
              disabled={isLoading}
            >
              <SortDesc className="h-4 w-4 mr-1" /> Desc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;