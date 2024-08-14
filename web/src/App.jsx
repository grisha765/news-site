import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('Hello World');

  const handleMouseEnter = () => {
    setText('Click Me');
  };

  const handleMouseLeave = () => {
    setText('Hello World');
  };

  return (
    <div 
      style={{ fontSize: '24px', textAlign: 'center', marginTop: '20%' }}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </div>
  );
}

export default App;

