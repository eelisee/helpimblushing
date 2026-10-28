import React, { useState } from 'react';

export const BsodEmoticon: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);

  const faces = [':(', ':o', ';)', ':3', ':( '];
  const currentFace = faces[clickCount % faces.length];

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="inline-block select-none mb-6">
      <button
        onClick={handleClick}
        title="Tap face"
        aria-label="Windows error emoticon"
        className="font-mono text-7xl sm:text-8xl md:text-9xl font-light tracking-tighter text-white hover:opacity-90 active:scale-95 transition-transform duration-100 cursor-pointer text-left block focus:outline-none"
      >
        {currentFace}
      </button>
    </div>
  );
};
