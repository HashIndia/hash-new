import { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import useUserStore from '../stores/useUserStore';
import useProductStore from '../stores/useProductStore';
import performanceMonitor from '../utils/performanceMonitor';
import { startBackgroundLoading, endBackgroundLoading } from './BackgroundLoadingIndicator';

export default function AuthInitializer() {
  const { user, isAuthenticated, setUser, setWishlist, setAddresses, logout } = useUserStore();
  const { initialize: initializeProducts } = useProductStore();

  useEffect(() => {
    let isMounted = true;

    // Background initialization - doesn't block UI
    const initializeInBackground = async () => {
      performanceMonitor.startInitialization();
      startBackgroundLoading('initialization');
      
      try {
        console.log('🔄 Starting background initialization...');
        
        // Initialize products in background
        startBackgroundLoading('products');
        performanceMonitor.startAPICall('products-init');
        initializeProducts().then(() => {
          performanceMonitor.endAPICall('products-init');
          endBackgroundLoading('products');
          console.log('✅ Products loaded in background');
        }).catch(error => {
          performanceMonitor.endAPICall('products-init');
          endBackgroundLoading('products');
          console.warn('⚠️ Products initialization failed:', error);
        });

        // Only check auth if we have stored authentication state
        if (!isAuthenticated || !user) {
          console.log('👤 No stored auth state, skipping auth check');
          performanceMonitor.endInitialization();
          endBackgroundLoading('initialization');
          return;
        }

        console.log('🔐 Checking authentication in background...');
        startBackgroundLoading('authentication');
        performanceMonitor.startAPICall('auth-check');
        
        try {
          const response = await authAPI.getCurrentUser();
          performanceMonitor.endAPICall('auth-check');
          endBackgroundLoading('authentication');

          if (isMounted && response.data.user) {
            console.log('✅ Authentication successful');
            setUser(response.data.user);
            
            // Load user data in parallel in background
            startBackgroundLoading('user-data');
            Promise.allSettled([
              authAPI.getWishlist().then(wishlistResponse => {
                if (wishlistResponse.data.wishlist) {
                  setWishlist(wishlistResponse.data.wishlist);
                  console.log('✅ Wishlist loaded in background');
                }
              }),
              authAPI.getAddresses().then(addressResponse => {
                if (addressResponse.data.addresses) {
                  setAddresses(addressResponse.data.addresses);
                  console.log('✅ Addresses loaded in background');
                }
              })
            ]).then(() => {
              endBackgroundLoading('user-data');
            }).catch(error => {
              endBackgroundLoading('user-data');
              console.warn('⚠️ Secondary data loading failed:', error);
            });
          } else if (isMounted) {
            console.log('❌ Authentication failed, logging out');
            logout();
          }
        } catch (authError) {
          performanceMonitor.endAPICall('auth-check');
          endBackgroundLoading('authentication');
          if (isMounted && isAuthenticated) {
            console.log('❌ Auth check failed, logging out');
            logout();
          }
        }
        
      } catch (error) {
        console.warn('⚠️ Background initialization error:', error);
      } finally {
        performanceMonitor.endInitialization();
        endBackgroundLoading('initialization');
        console.log('🏁 Background initialization complete');
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
