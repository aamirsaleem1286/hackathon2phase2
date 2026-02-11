import { useState } from 'react';
import { FiEdit, FiTrash2, FiSave, FiX, FiLoader, FiCheck, FiClock, FiStar } from 'react-icons/fi';
import { Task } from '../types/task';
import { updateTask, deleteTask, toggleTaskComplete } from '../lib/api';

interface TaskItemProps {
  task: Task;
  onTaskUpdate: () => void;
  onTaskDeleted?: (message: string) => void;
  onTaskError?: (message: string) => void;
}

export default function TaskItem({ task, onTaskUpdate, onTaskDeleted, onTaskError }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    try {
      await updateTask(task.id, {
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
      onTaskUpdate();

      // Optionally show success toast for update
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update task';
      console.error('Failed to update task:', error);

      if (onTaskError) {
        onTaskError(errorMessage);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        await deleteTask(task.id);

        if (onTaskDeleted) {
          onTaskDeleted('Task deleted successfully!');
        }
        onTaskUpdate();
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to delete task';
        console.error('Failed to delete task:', error);
        setIsDeleting(false);

        if (onTaskError) {
          onTaskError(errorMessage);
        }
      }
    }
  };

  const handleToggleComplete = async () => {
    try {
      await toggleTaskComplete(task.id);
      onTaskUpdate();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update task';
      console.error('Failed to toggle task completion:', error);

      if (onTaskError) {
        onTaskError(errorMessage);
      }
    }
  };

  return (
    <div className={`card transition-all duration-200 hover:shadow-md scale-on-hover ${
      task.completed
        ? 'bg-green-50 border-green-200'
        : task.priority === 'high'
          ? 'border-red-200'
          : task.priority === 'medium'
            ? 'border-amber-200'
            : 'border-slate-200'
    }`}>
      {isEditing ? (
        <div className="p-5 space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input-field w-full"
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="Task description"
          />
          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isDeleting}
              className="btn-primary flex items-center"
            >
              {isDeleting ? (
                <>
                  <FiLoader className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center"
            >
              <FiX className="mr-2 h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-start">
            <button
              onClick={handleToggleComplete}
              className={`flex-shrink-0 h-6 w-6 mt-0.5 rounded-full border flex items-center justify-center focus:outline-none ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-slate-300 hover:border-blue-500'
              }`}
            >
              {task.completed && <FiCheck className="h-4 w-4" />}
            </button>
            <div className="ml-4 flex-1 min-w-0">
              <h3 className={`text-base font-semibold ${
                task.completed
                  ? 'line-through text-slate-500'
                  : task.priority === 'high'
                    ? 'text-red-600'
                    : task.priority === 'medium'
                      ? 'text-amber-600'
                      : 'text-slate-800'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-2 text-sm ${
                  task.completed ? 'text-slate-400' : 'text-slate-600'
                } break-words`}>
                  {task.description}
                </p>
              )}

              <div className="mt-3 flex items-center text-xs text-slate-500">
                <FiClock className="mr-1.5 h-3.5 w-3.5" />
                <span>
                  Created: {new Date(task.created_at).toLocaleDateString()}
                </span>
                {task.updated_at !== task.created_at && (
                  <span className="ml-3">
                    • Updated: {new Date(task.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {task.priority && (
                <div className={`mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'medium' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-blue-100 text-blue-800'
                }`}>
                  <FiStar className="mr-1.5 h-3 w-3" />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary text-xs flex items-center px-3 py-1.5"
            >
              <FiEdit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-danger text-xs flex items-center px-3 py-1.5"
            >
              {isDeleting ? (
                <>
                  <FiLoader className="animate-spin mr-1.5 h-3.5 w-3.5" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}