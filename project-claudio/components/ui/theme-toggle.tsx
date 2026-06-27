"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("project-claudio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = stored ? stored === "dark" : prefersDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("project-claudio-theme", next ? "dark" : "light");
  }

  return (
    <Button variant="ghost" className="h-10 w-10 p-0" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
