'use client';

import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch, placeholder = "Search for necklaces, pendants..." }) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  return (
    <div
      ref={containerRef}
      className={`search-container ${isExpanded ? 'expanded' : ''}`}
    >
      <button
        className="search-toggle-btn"
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded) setTimeout(() => inputRef.current?.focus(), 100);
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
