"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AutoCompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  fetchApi: (q: string) => Promise<any[]>;
  className?:string
}

export default function Autocomplete({
  value = "",
  onChange,
  fetchApi,
  className
}: AutoCompleteProps) {
  const [query, setQuery] = useState(value);
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fetchResultsCallback = useCallback(
    async (q: string) => {
      if (q.trim() === "") {
        setResults([]);
        return;
      }
      setIsLoading(true);
      const results = await fetchApi(q);
      setResults(results);
      setIsLoading(false);
    },
    [fetchApi]
  );

  useEffect(() => {
    if (debouncedQuery && isFocused) {
      fetchResultsCallback(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, fetchResultsCallback, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      const title =
        typeof selected === "object" && selected !== null
          ? (selected as any).title || selected
          : selected;
      setQuery(title);
      onChange?.(title);
      setResults([]);
      setSelectedIndex(-1);
    } else if (e.key === "Escape") {
      setResults([]);
      setSelectedIndex(-1);
    }
  };

  // const handleResultClick = (suggestion: string) => {
  //   setQuery(suggestion);
  //   onChange?.(suggestion);
  //   setResults([]);
  //   setSelectedIndex(-1);
  // };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay hiding Results to allow for click events on Results
    setTimeout(() => {
      setIsFocused(false);
      setResults([]);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className={cn("relative mx-auto w-fit max-w-xs", className)}>
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Bạn tìm gì hôm nay?"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pr-10"
          aria-label="Search input"
          aria-autocomplete="list"
          aria-controls="Results-list"
          aria-expanded={results.length > 0}
          aria-activedescendant={
            selectedIndex >= 0 ? `option-${selectedIndex}` : undefined
          }
          role="combobox"
        />
        <Button
          asChild
          size="icon"
          variant="ghost"
          className="top-0 right-0 absolute h-full"
          aria-label="Search">
          <Link href={`/search?q=${encodeURIComponent(query)}`}>
            <Search className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      {isLoading && isFocused && (
        <div
          className="z-[9999] absolute bg-background shadow-sm mt-2 p-2 border rounded-md w-full"
          aria-live="polite">
          Đang tìm kiếm...
        </div>
      )}
      {results.length > 0 && !isLoading && isFocused && (
        <ul
          id="Results-list"
          className="z-[9999] absolute bg-background shadow-sm mt-2 border rounded-md w-full max-h-[200px] overflow-y-auto"
          role="listbox">
          {results.map((result, index) => {
            const isObject = typeof result === "object" && result !== null;
            const displayText = isObject
              ? (result as any).title || result
              : result;
            const slug = isObject ? (result as any).slug : null;

            return (
              <li
                key={slug || displayText || index}
                id={`option-${index}`}
                role="option"
                aria-selected={index === selectedIndex}>
                <Link
                  href={
                    slug
                      ? `/event/${slug}`
                      : `/search?q=${encodeURIComponent(displayText)}`
                  }
                  className={`block px-4 py-2 w-full cursor-pointer ${
                    index === selectedIndex ? "bg-muted" : "hover:bg-muted"
                  }`}>
                  {displayText}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {results.length === 0 && !isLoading && isFocused && debouncedQuery && (
        <div
          className="z-[9999] absolute bg-background shadow-sm mt-2 p-2 border rounded-md w-full"
          aria-live="polite">
          Không có kết quả
        </div>
      )}
    </div>
  );
}
