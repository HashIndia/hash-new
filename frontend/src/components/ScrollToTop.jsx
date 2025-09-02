import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // If there's a hash in the URL (like #section), scroll to that element
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 0);
    } else {
      // Otherwise, scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
