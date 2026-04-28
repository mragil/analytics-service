import { createRootRoute, Outlet, Link, useLocation } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') return;
    if (!localStorage.getItem('apiKey')) {
      window.location.href = '/login';
    }
  }, [location.pathname]);

  if (location.pathname === '/login') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-bold text-gray-900">
              Analytics
            </Link>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              Overview
            </Link>
            <Link to="/sites" className="text-sm text-gray-600 hover:text-gray-900">
              Sites
            </Link>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('apiKey');
              window.location.href = '/login';
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
