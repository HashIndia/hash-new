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
        console.log('[AuthInitializer] Initializing products...');
        await initializeProducts();

        // Only check auth if we have stored authentication state
        if (!isAuthenticated || !user) {
          console.log('[AuthInitializer] No stored auth state, skipping check');
          setIsInitialized(true);
          return;
        }

        console.log('[AuthInitializer] Checking authentication with backend...');
        const response = await authAPI.getCurrentUser();

        if (isMounted && response.data.user) {
          setUser(response.data.user);
          console.log('[AuthInitializer] User authenticated');
          
          // Load user's wishlist
          try {
            const wishlistResponse = await authAPI.getWishlist();
            if (wishlistResponse.data.wishlist) {
              setWishlist(wishlistResponse.data.wishlist);
              console.log('[AuthInitializer] Wishlist loaded');
            }
          } catch (wishlistError) {
            console.log('[AuthInitializer] Failed to load wishlist:', wishlistError.message);
          }

          // Load user's addresses
          try {
            const addressResponse = await authAPI.getAddresses();
            if (addressResponse.data.addresses) {
              setAddresses(addressResponse.data.addresses);
              console.log('[AuthInitializer] Addresses loaded');
            }
          } catch (addressError) {
            console.log('[AuthInitializer] Failed to load addresses:', addressError.message);
          }
        } else if (isMounted) {
          console.log('[AuthInitializer] No user data received');
          logout();
        }
      } catch (error) {
        if (isMounted) {
          console.log('[AuthInitializer] Initialization failed:', error.message);
          // Don't logout on product loading failure, only on auth failure
          if (isAuthenticated) {
            logout();
          }
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
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
