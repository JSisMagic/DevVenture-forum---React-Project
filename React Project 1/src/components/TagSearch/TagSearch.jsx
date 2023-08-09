import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';

export function TagSearch() {
  const [searchTag, setSearchTag] = useState('');
  const navigate = useNavigate()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ marginRight: '10px' }}>Search Posts by Tag:</h2>
        <input
          type="text"
          placeholder="Enter tag"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Navigate to the search results page with the entered tag
              navigate(`/searched-tag/${searchTag}`);
            }
          }}
        />
      </div>
    </div>
  );
}
