'use client';

import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function DarkModeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    const isDark = getInitialDark();
    if (isDark) document.documentElement.classList.add('dark');
    return isDark;
  });

  const toggle = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Mode clair' : 'Mode nuit'}
      className="flex h-8 w-8 items-center justify-center rounded border border-epct-green/30 text-epct-ink/60 transition hover:border-epct-green hover:text-epct-green dark:border-epct-lime/20 dark:text-epct-dark-text/60 dark:hover:text-epct-lime"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
