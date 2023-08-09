import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

export function TagSearch() {
  const [searchTag, setSearchTag] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  const handleSearchIconClick = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchTag('');
    }
  };

  const handleClearSearch = () => {
    setIsSearchVisible(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/searched-tag/${searchTag}`);
      setSearchTag('')
    }
  };

  return (
    <div>
      <InputGroup>
        {isSearchVisible && (
          <Input
            type="text"
            placeholder="Search by tag"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
        <InputRightElement>
          <IconButton
            icon={isSearchVisible ? <CloseIcon /> : <SearchIcon />}
            onClick={isSearchVisible ? handleClearSearch : handleSearchIconClick}
          />
        </InputRightElement>
      </InputGroup>
    </div>
  );
}


