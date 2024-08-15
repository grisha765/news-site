import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Header from './Header';
import WeeklyNews from './WeeklyNews';
import Anekdots from './Anekdots'

function App() {
  const [text, setText] = useState('Hello');

  const handleMouseEnter = () => {
    setText('World');
  };

  const handleMouseLeave = () => {
    setText('Hello');
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route 
          path="/news_site/" 
          element={
            <div 
              className="hello-text"
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              {text}
            </div>
          } 
        />
        <Route path="/news_site/weekly-news" element={<WeeklyNews />} />
        <Route path="/news_site/Anekdots" element={<Anekdots />} />
      </Routes>
    </Router>
  );
}

export default App;

