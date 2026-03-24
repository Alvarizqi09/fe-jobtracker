import { useState, useEffect } from 'react'

let globalInitialDelayPassed = false;

export function useInitialLoader() {
  const [minDelayPassed, setMinDelayPassed] = useState(globalInitialDelayPassed);

  useEffect(() => {
    if (globalInitialDelayPassed) return;
    const timer = setTimeout(() => {
      globalInitialDelayPassed = true;
      setMinDelayPassed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return minDelayPassed;
}
