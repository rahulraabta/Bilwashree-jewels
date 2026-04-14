'use client';
import { useState, useRef, useEffect } from 'react';

export default function SearchBar({ onSearch, suggestions = [], onSuggestionSelect }) {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    onSearch?.(val);
    setShowSuggestions(val.length > 0);
  };

  const handleSelect = (suggestion) => {
    setValue('');
    onSearch?.('');
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => value.length > 0 && setShowSuggestions(true)}
        placeholder="Search jewellery..."
        style={{
          padding: '8px 14px',
          borderRadius: '20px',
          border: '1px solid #c9a84c',
          outline: 'none',
          fontSize: '14px',
          width: '200px',
          background: '#fff8f0',
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid #c9a84c',
          borderRadius: '10px',
          listStyle: 'none',
          margin: 0,
          padding: '6px 0',
          zIndex: 9999,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          maxHeight: '240px',
          overflowY: 'auto',
        }}>
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSelect(s)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                borderBottom: '1px solid #f5f0e8',
              }}
              onMouseEnter={e => e.target.style.background = '#fff8f0'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
