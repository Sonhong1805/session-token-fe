"use client";

import { useEffect } from "react";

interface LazyCSSProps {
  href: string;
}

const LazyCSS = ({ href }: LazyCSSProps) => {
  useEffect(() => {
    // Check if CSS is already loaded
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) return;

    // Load CSS after component mounts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.media = "print";
    link.onload = () => {
      link.media = "all";
    };
    link.onerror = () => {
      console.warn(`Failed to load CSS: ${href}`);
    };

    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount
      try {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      } catch (error) {
        console.warn("Error removing CSS link:", error);
      }
    };
  }, [href]);

  return null;
};

export default LazyCSS;
