'use client';

import { useState, useEffect, useRef } from 'react';

export default function SearchBar({
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  placeholder = "Search for necklaces, pendants...",
}) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const focusTimeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (!query) setIsExpanded(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [query]);

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredSuggestions = normalizedQuery
    ? suggestions
      .filter((item) => {
        const label = (item.label || '').toLowerCase();
        const keywords = (item.keywords || []).join(' ').toLowerCase();
        return label.includes(normalizedQuery) || keywords.includes(normalizedQuery);
      })
      .slice(0, 6)
    : [];

  return (
    <div
      ref={containerRef}
      className={`search-container ${isExpanded ? 'expanded' : ''}`}
    >
      <button
        className="search-toggle-btn"
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
          } else if (query.trim()) {
            onSearch(query.trim());
          } else {
            onSearch('');
          }

          if (focusTimeoutRef.current) {
            clearTimeout(focusTimeoutRef.current);
          }

          focusTimeoutRef.current = setTimeout(() => {
            inputRef.current?.focus();
            if (isExpanded && query) {
              inputRef.current?.select();
            }
          }, 100);
        }}
        aria-label="Toggle search"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>

      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);

          // Debounce the search to improve performance
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
          }

          searchTimeoutRef.current = setTimeout(() => {
            onSearch(value);
          }, 150); // 150ms debounce delay
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredSuggestions[0] && onSuggestionSelect) {
              onSuggestionSelect(filteredSuggestions[0]);
              setQuery(filteredSuggestions[0].label);
              setIsExpanded(false);
              return;
            }
            onSearch(query.trim());
          }
        }}
        aria-label="Search products"
      />

      {isExpanded && filteredSuggestions.length > 0 && (
        <div className="search-suggestions" role="listbox" aria-label="Search suggestions">
          {filteredSuggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected="false"
              className="search-suggestion-item"
              onClick={() => {
                setQuery(item.label);
                onSearch(item.label);
                if (onSuggestionSelect) {
                  onSuggestionSelect(item);
                }
                setIsExpanded(false);
              }}
            >
              <span className="suggestion-label">{item.label}</span>
              <span className="suggestion-type">{item.type}</span>
            </button>
          ))}
        </div>
      )}

      {query && (
        <button
          className="search-clear-btn"
          onClick={() => {
            setQuery('');
            onSearch('');
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
