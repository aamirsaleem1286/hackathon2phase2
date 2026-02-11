'use client';

import { useState, useEffect } from 'react';
import { FiLoader, FiRefreshCw, FiFilter, FiSearch,FiCheckSquare } from 'react-icons/fi';
import TaskItem from './TaskItem';
import { Task } from '../types/task';
import { getTasks } from '../lib/api';

interface TaskListProps {
  onTaskUpdate?: () => void;
  onTaskDeleted?: (message: string) => void;
  onTaskError?: (message: string) => void;
  refreshTrigger?: number; // Add a trigger to force refresh
}

export default function TaskList({ onTaskUpdate, onTaskDeleted, onTaskError, refreshTrigger }: TaskListProps = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Provide default implementations for optional props
  const handleTaskUpdate = onTaskUpdate || (() => {});
  const handleTaskDeleted = onTaskDeleted || ((message: string) => {});
  const handleTaskError = onTaskError || ((message: string) => {});

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]); // Add refreshTrigger to the dependency array

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data.tasks);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch tasks';
      setError(errorMessage);

      handleTaskError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = () => {
    fetchTasks();
  };

  // Filter tasks based on selected filter and search term
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all'
      || (filter === 'active' && !task.completed)
      || (filter === 'completed' && task.completed);

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
      || task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <FiLoader className="animate-spin h-10 w-10 text-blue-500" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-ping opacity-20"></div>
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading your tasks...</p>
        <p className="text-sm text-slate-500">Just a moment while we gather your information</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-5 border border-red-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiX className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-red-800">Error loading tasks</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <button
              onClick={refreshTasks}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 pr-4 py-3"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
              filter === 'active'
                ? 'bg-amber-100 text-amber-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
              filter === 'completed'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="flex justify-between text-sm text-slate-600">
        <span>
          Showing <span className="font-medium text-slate-800">{filteredTasks.length}</span> of{' '}
          <span className="font-medium text-slate-800">{tasks.length}</span> tasks
        </span>
        <span>
          {tasks.filter(t => t.completed).length} completed
        </span>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
            <FiCheckSquare className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-800">No tasks found</h3>
          <p className="mt-2 text-slate-600 max-w-md mx-auto">
            {searchTerm || filter !== 'all'
              ? 'No tasks match your search or filter criteria. Try adjusting your filters.'
              : 'Get started by creating your first task!'}
          </p>
          {(!searchTerm && filter === 'all') && (
            <div className="mt-8">
              <button
                onClick={refreshTasks}
                className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                <FiRefreshCw className="mr-2 h-5 w-5" />
                Refresh Tasks
              </button>
            </div>
          )}
        </div>
      ) : (
        <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredTasks.map((task) => (
            <li key={task.id} className="transition-all duration-200 hover:scale-[1.005]">
              <TaskItem
                task={task}
                onTaskUpdate={refreshTasks}
                onTaskDeleted={handleTaskDeleted}
                onTaskError={handleTaskError}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}