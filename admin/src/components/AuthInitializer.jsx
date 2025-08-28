import { useEffect, useState } from 'react';
import useAuthStore from '../stores/useAuthStore';

export default function AuthInitializer({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };

    initializeAuth();
  }, [checkAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
 
