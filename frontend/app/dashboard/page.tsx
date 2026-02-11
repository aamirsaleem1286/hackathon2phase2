'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiHome,
  FiPlus,
  FiLogOut,
  FiCheckSquare,
  FiCalendar,
  FiBarChart2,
  FiAlertCircle,
  FiCheck,
  FiUser,
  FiX,
} from 'react-icons/fi';

import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { getTasks } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state
  const [tasks, setTasks] = useState<any[]>([]); // Add tasks state for stats
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  // Fetch tasks for stats calculation
  useEffect(() => {
    const fetchTasksForStats = async () => {
      try {
        const response = await getTasks();
        setTasks(response.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks for stats:', error);
      }
    };

    fetchTasksForStats();
  }, [refreshTrigger]); // Fetch when refreshTrigger changes

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 4000);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50">
          <div
            className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg ${
              toast.type === 'success'
                ? 'border-l-4 border-green-500'
                : 'border-l-4 border-red-500'
            }`}
          >
            {toast.type === 'success' ? (
              <FiCheck className="text-green-500 mt-1" />
            ) : (
              <FiAlertCircle className="text-red-500 mt-1" />
            )}
            <p className="text-sm text-slate-700">{toast.message}</p>
            <button onClick={() => setToast(t => ({ ...t, show: false }))}>
              <FiX className="text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transform transition md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col border-r border-slate-800">
          <div className="flex h-16 items-center justify-center border-b border-slate-800">
            <h1 className="text-lg font-semibold text-white">Todo Dashboard</h1>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {[
              { label: 'Dashboard', icon: FiHome, active: true },
              { label: 'Calendar', icon: FiCalendar },
              { label: 'Analytics', icon: FiBarChart2 },
              { label: 'My Tasks', icon: FiCheckSquare },
              { label: 'Profile', icon: FiUser },
            ].map(item => (
              <a
                key={item.label}
                href="#"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  item.active
                    ? 'bg-slate-800 text-white'
                    : 'hover:bg-slate-800/60'
                }`}
              >
                <item.icon />
                {item.label}
              </a>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="font-medium">Dashboard</span>
          <div />
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">
                My Tasks
              </h2>
              <p className="text-sm text-slate-500">
                Manage your daily work efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Tasks */}
              <div className="xl:col-span-3 space-y-6">
                {/* Create Task */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiPlus className="text-blue-600" />
                    <h3 className="font-medium text-slate-800">
                      Create New Task
                    </h3>
                  </div>
                  <TaskForm
                    onTaskCreated={msg =>
                      msg?.includes('Error')
                        ? showToast(msg, 'error')
                        : (showToast(msg || 'Task created!', 'success'), setRefreshTrigger(prev => prev + 1))
                    }
                  />
                </div>

                {/* Task List */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-slate-800">My Tasks</h3>

                    <div className="inline-flex rounded-xl border bg-slate-100 p-1">
                      {['All', 'Active', 'Completed'].map(label => (
                        <button
                          key={label}
                          className="px-3 py-1 rounded-lg text-sm text-slate-600 hover:bg-white"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TaskList
                    onTaskUpdate={() => {}}
                    onTaskDeleted={msg => showToast(msg, 'success')}
                    onTaskError={msg => showToast(msg, 'error')}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="xl:col-span-2">
                <div className="card p-6 sticky top-6 space-y-4">
                  <h3 className="font-medium text-slate-800">Quick Stats</h3>

                  {[
                    { label: 'Total Tasks', value: tasks.length },
                    { label: 'Completed', value: tasks.filter((task: any) => task.completed).length },
                    { label: 'Pending', value: tasks.filter((task: any) => !task.completed).length },
                    { label: 'Overdue', value: tasks.filter((task: any) => {
                      // Assuming tasks have a due_date property
                      if (!task.due_date || task.completed) return false;
                      return new Date(task.due_date) < new Date();
                    }).length },
                  ].map(stat => (
                    <div
                      key={stat.label}
                      className="flex justify-between rounded-xl border p-4"
                    >
                      <span className="text-sm text-slate-500">
                        {stat.label}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {stat.value}
                      </span>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Completion Rate</span>
                      <span className="font-medium text-slate-800">
                        {tasks.length > 0 
                          ? `${Math.round((tasks.filter((task: any) => task.completed).length / tasks.length) * 100)}%` 
                          : '0%'}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div 
                        className="h-2 bg-blue-600 rounded-full" 
                        style={{ width: tasks.length > 0 
                          ? `${(tasks.filter((task: any) => task.completed).length / tasks.length) * 100}%` 
                          : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .card {
          background: white;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  );
}
