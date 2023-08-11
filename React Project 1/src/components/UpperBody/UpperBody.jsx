import React from 'react';
import './UpperBody.css';
import { GlassContainer } from '../GlassContainer/GlassContainer';

export function UpperBody() {
  return (
    <div className='headerContainer'>
      <GlassContainer className='fullImageContainer'>
        <img
          src="/src/assets/test_photo.jpg"
          alt="Image Description"
          className='fullImage'
        />
      </GlassContainer>
    </div>
  );
}
