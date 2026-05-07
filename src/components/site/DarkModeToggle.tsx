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
      className={`relative inline-flex h-9 w-[3.35rem] items-center rounded-full border px-1 transition-colors ${
        dark
          ? 'border-epct-lime/35 bg-epct-lime/15'
          : 'border-epct-green/30 bg-epct-bg'
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${
          dark ? 'left-[1.8rem]' : 'left-1'
        }`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-epct-ink shadow-sm dark:bg-epct-dark-bg dark:text-epct-lime">
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </span>
      </span>
    </button>
  );
}
