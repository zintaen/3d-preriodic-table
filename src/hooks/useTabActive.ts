import { useState, useEffect } from 'react';

export function useTabActive() {
  const [isActive, setIsActive] = useState(typeof document !== 'undefined' ? document.visibilityState === 'visible' : true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isActive;
}
