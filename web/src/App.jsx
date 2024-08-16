import React, { useState, useContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Header from './Header';
import WeeklyNews from './WeeklyNews';
import Anekdots from './Anekdots';
import { UserProvider, UserContext } from './UserContext';

function AppContent() { // Создаем отдельный компонент для содержимого приложения
  const { userData } = useContext(UserContext);

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
          path="/" 
          element={
            <div 
              className="hello-text"
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              {userData.username ? `${userData.username} (${userData.role})` : text}
            </div>
          } 
        />
        <Route path="/weekly-news" element={<WeeklyNews />} />
        <Route path="/Anekdots" element={<Anekdots />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent /> {/* Оборачиваем наше содержимое в UserProvider */}
    </UserProvider>
  );
}

export default App;

