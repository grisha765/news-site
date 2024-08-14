import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('Hello World');

  const handleMouseEnter = () => {
    setText('World');
  };

  const handleMouseLeave = () => {
    setText('Hello');
  };

  return (
    <div 
      className="hello-text"
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </div>
  );
}

export default App;

