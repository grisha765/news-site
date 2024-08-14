import React, { useState } from 'react';
import './index.css';
import Header from './Header';

function App() {
  const [text, setText] = useState('Hello World');

  const handleMouseEnter = () => {
    setText('World');
  };

  const handleMouseLeave = () => {
    setText('Hello');
  };

  return (
    <div>
      <Header />
      <div 
        className="hello-text"
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </div>
    </div>
  );
}

export default App;

