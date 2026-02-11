'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiCheckSquare, FiUser, FiUserPlus, FiArrowRight, FiTrendingUp, FiCalendar, FiBell } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left fade-in">
                <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                  <span className="block">Streamline Your Tasks With</span>
                  <span className="block text-blue-600 mt-2">Smart Todo App</span>
                </h1>
                <p className="mt-3 text-base text-slate-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Manage your daily tasks efficiently with our intuitive and secure todo application.
                  Stay organized, boost productivity, and achieve your goals.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                  {!isAuthenticated ? (
                    <div className="w-full sm:w-auto">
                      <Link href="/login">
                        <button
                          type="button"
                          className="w-full btn-primary flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg md:py-4 md:text-lg md:px-10"
                        >
                          <FiUser className="mr-2 h-5 w-5" />
                          Sign In
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="w-full sm:w-auto">
                      <Link href="/dashboard">
                        <button
                          type="button"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 md:py-4 md:text-lg md:px-10 transition duration-300 transform hover:scale-[1.02] shadow-lg"
                        >
                          <FiArrowRight className="mr-2 h-5 w-5" />
                          Go to Dashboard
                        </button>
                      </Link>
                    </div>
                  )}

                  {!isAuthenticated && (
                    <div className="w-full sm:w-auto">
                      <Link href="/register">
                        <button
                          type="button"
                          className="w-full btn-secondary flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg md:py-4 md:text-lg md:px-10"
                        >
                          <FiUserPlus className="mr-2 h-5 w-5" />
                          Register
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-blue-500 to-indigo-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="p-8 max-w-md w-full">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FiCheckSquare className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-slate-900">Today's Tasks</h3>
                      <p className="text-sm text-slate-500">Stay productive</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <input type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label className="font-medium text-slate-700">Review project proposal</label>
                        <p className="text-slate-500">Due tomorrow</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <input type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded" defaultChecked />
                      </div>
                      <div className="ml-3 text-sm">
                        <label className="font-medium text-slate-700 line-through text-slate-500">Team meeting</label>
                        <p className="text-slate-500">Completed</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <input type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label className="font-medium text-slate-700">Prepare presentation</label>
                        <p className="text-slate-500">Due in 3 days</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-medium text-blue-600">67%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to stay organized
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 lg:mx-auto">
              Our todo app comes with powerful features designed to help you manage your tasks efficiently.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FiTrendingUp className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-slate-900">Track Progress</h4>
                  <p className="mt-2 text-base text-slate-500">
                    Monitor your productivity and see how much you've accomplished over time.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FiCalendar className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-slate-900">Schedule Tasks</h4>
                  <p className="mt-2 text-base text-slate-500">
                    Set due dates and reminders to ensure nothing slips through the cracks.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FiBell className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-slate-900">Smart Notifications</h4>
                  <p className="mt-2 text-base text-slate-500">
                    Get timely reminders and notifications to stay on top of your tasks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}