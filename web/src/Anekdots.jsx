import React, { useContext } from 'react';
import './styles/anekdots.css';
import { UserContext } from './UserContext';
import NewsPosts from './NewsPosts';

function Anekdots() {
  const { userData } = useContext(UserContext);
  const username = userData?.username || 'Аноним';
  const role = userData?.role || 'без роли';

  const selectedCategories = ['anekdots'];
  return (
    <div className="anekdots-container">
      <h1>Анекдоты для {username} ({role})</h1>
      <NewsPosts categories={selectedCategories} />
    </div>
  );
}

export default Anekdots;
