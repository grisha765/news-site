import React, { useState, useContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Header from './Header';
import WeeklyNews from './WeeklyNews';
import Anekdots from './Anekdots';
import { UserProvider, UserContext } from './UserContext';
import NewsPosts from './NewsPosts';

function AppContent() {
  const { userData } = useContext(UserContext);

  const username = userData?.username || 'Аноним';
  const role = userData?.role || 'без роли';

  const selectedCategories = ['main'];

  return (
    <Router>
      <Header />
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="main-container">
              <h1>Главные новости для {username} ({role})</h1>
              <NewsPosts categories={selectedCategories} />
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
      <AppContent />
    </UserProvider>
  );
}

export default App;

