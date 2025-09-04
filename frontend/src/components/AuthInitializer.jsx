import { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import useUserStore from '../stores/useUserStore';
import useProductStore from '../stores/useProductStore';

export default function AuthInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, isAuthenticated, setUser, setWishlist, setAddresses, logout } = useUserStore();
  const { initialize: initializeProducts } = useProductStore();

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        // Initialize products first (doesn't require auth)
        await initializeProducts();

        // Only check auth if we have stored authentication state AND user data
        if (!isAuthenticated || !user) {
          setIsInitialized(true);
          return;
        }

        // Only make auth calls if we believe user is authenticated
        try {
          const response = await authAPI.getCurrentUser();

          if (isMounted && response.data.user) {
            setUser(response.data.user);
            
            // Load user data in parallel but don't block initialization
            Promise.all([
              authAPI.getWishlist().then(wishlistResponse => {
                if (wishlistResponse.data.wishlist) {
                  setWishlist(wishlistResponse.data.wishlist);
                }
              }).catch(() => {}), // Silent fail
              
              authAPI.getAddresses().then(addressResponse => {
                if (addressResponse.data.addresses) {
                  setAddresses(addressResponse.data.addresses);
                }
              }).catch(() => {}) // Silent fail
            ]);
          } else if (isMounted) {
            logout();
          }
        } catch (authError) {
          // If auth fails, logout silently
          if (isMounted) {
            logout();
          }
        }
      } catch (error) {
        // Only logout if this was an auth-related error, not product loading
        if (isMounted && isAuthenticated) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
