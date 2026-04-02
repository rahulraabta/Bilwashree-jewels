'use client';

import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch, placeholder = "Search for necklaces, pendants..." }) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const focusTimeoutRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (!query) setIsExpanded(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [query]);

  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

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
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSearch(query.trim());
          }
        }}
        aria-label="Search products"
      />

      {query && (
        <button
          className="search-clear-btn"
          onClick={() => {
            setQuery('');
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
