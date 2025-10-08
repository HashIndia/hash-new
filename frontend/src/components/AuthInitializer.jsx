import { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import useUserStore from '../utils/useUserStore';
import useProductStore from '../stores/useProductStore';
import performanceMonitor from '../utils/performanceMonitor';
import { startBackgroundLoading, endBackgroundLoading } from './BackgroundLoadingIndicator';

export default function AuthInitializer() {
  const { user, isAuthenticated, setUser, setWishlist, setAddresses, logout } = useUserStore();
  const { initialize: initializeProducts } = useProductStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Background initialization - doesn't block UI
    const initializeInBackground = async () => {
      performanceMonitor.startInitialization();
      startBackgroundLoading('initialization');
      
      try {
        
        // Initialize products in background
        startBackgroundLoading('products');
        performanceMonitor.startAPICall('products-init');
        initializeProducts().then(() => {
          performanceMonitor.endAPICall('products-init');
          endBackgroundLoading('products');
        }).catch(error => {
          performanceMonitor.endAPICall('products-init');
          endBackgroundLoading('products');
          console.warn('⚠️ Products initialization failed:', error);
        });

        // Check authentication status on initialization
        startBackgroundLoading('authentication');
        performanceMonitor.startAPICall('auth-check');
        
        try {
          const response = await authAPI.getCurrentUser();
          performanceMonitor.endAPICall('auth-check');
          endBackgroundLoading('authentication');

          if (isMounted && response.data.user) {
            setUser(response.data.user);
            
            // Load user data in parallel in background
            startBackgroundLoading('user-data');
            Promise.allSettled([
              authAPI.getWishlist().then(wishlistResponse => {
                if (wishlistResponse.data.wishlist) {
                  setWishlist(wishlistResponse.data.wishlist);
                }
              }).catch(error => {
                console.warn('⚠️ Wishlist loading failed:', error);
              }),
              authAPI.getAddresses().then(addressResponse => {
                if (addressResponse.data.addresses) {
                  setAddresses(addressResponse.data.addresses);
                }
              }).catch(error => {
                console.warn('⚠️ Addresses loading failed:', error);
              })
            ]).then(() => {
              endBackgroundLoading('user-data');
            }).catch(error => {
              endBackgroundLoading('user-data');
              console.warn('⚠️ Secondary data loading failed:', error);
            });
          } else if (isMounted) {
            // Clear any stale user data but don't redirect
            logout();
          }
        } catch (authError) {
          performanceMonitor.endAPICall('auth-check');
          endBackgroundLoading('authentication');
          
          console.log('Auth check failed:', authError);
          
          // Only logout if we had stored authentication data that's now invalid
          if (isMounted && (isAuthenticated || user)) {
            console.log('Clearing invalid auth state');
            logout();
          }
          
          // Don't redirect here - let the app handle it naturally
        } finally {
          if (isMounted) {
            setAuthChecked(true);
          }
        }
        
      } catch (error) {
        console.warn('⚠️ Background initialization error:', error);
      } finally {
        performanceMonitor.endInitialization();
        endBackgroundLoading('initialization');
      }
    };

    // Start background initialization without blocking
    initializeInBackground();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // No blocking UI - always return null since we initialize in background
  return null;
}
