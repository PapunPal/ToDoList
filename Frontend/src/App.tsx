import React from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthForm } from './components/AuthForm';
import { TodoView } from './components/TodoView';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 text-sm">
            Initializing application...
          </div>
        ) : !isAuthenticated ? (
          <AuthForm />
        ) : (
          <TodoView />
        )}
      </main>
    </div>
  );
};

export default App;
