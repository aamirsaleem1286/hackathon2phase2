import { useState } from 'react';
import { FiPlus, FiLoader, FiX, FiCheck } from 'react-icons/fi';
import { TaskCreate } from '../types/task';
import { createTask } from '../lib/api';

interface TaskFormProps {
  onTaskCreated?: (message?: string) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps = {}) {
  const [formData, setFormData] = useState<TaskCreate>({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createTask(formData);
      setFormData({ title: '', description: '' });
      setIsExpanded(false); // Collapse after successful submission

      if (onTaskCreated) {
        onTaskCreated('Task created successfully!');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create task';
      setError(errorMessage);

      // Call onTaskCreated with error to show toast in parent
      if (onTaskCreated) {
        onTaskCreated(`Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className={`${isExpanded ? 'block' : 'hidden'}`}>
        {error && (
          <div className="rounded-lg bg-red-50 p-3 mb-3 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="What needs to be done?"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="input-field"
            placeholder="Add details, due date, priority..."
          />
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex justify-center items-center"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              <>
                <FiCheck className="mr-2 h-4 w-4" />
                Add Task
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setFormData({ title: '', description: '' });
              setError(null);
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      {!isExpanded && (
        <div className="flex items-center">
          <button
            onClick={handleExpand}
            className="flex-1 flex items-center justify-center py-4 px-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            <span>Add a new task</span>
          </button>
        </div>
      )}
    </div>
  );
}