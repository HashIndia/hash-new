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

        // Only check auth if we have stored authentication state
        if (!isAuthenticated || !user) {
          setIsInitialized(true);
          return;
        }

        const response = await authAPI.getCurrentUser();

        if (isMounted && response.data.user) {
          setUser(response.data.user);
          
          // Load user's wishlist
          try {
            const wishlistResponse = await authAPI.getWishlist();
            if (wishlistResponse.data.wishlist) {
              setWishlist(wishlistResponse.data.wishlist);
            }
          } catch (wishlistError) {
            // Wishlist loading failed
          }

          // Load user's addresses
          try {
            const addressResponse = await authAPI.getAddresses();
            if (addressResponse.data.addresses) {
              setAddresses(addressResponse.data.addresses);
            }
          } catch (addressError) {
            // Address loading failed
          }
        } else if (isMounted) {
          logout();
        }
      } catch (error) {
        if (isMounted) {
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
