import React, { useContext } from 'react';
import './styles/weeklyNews.css';
import { UserContext } from './UserContext';
import NewsPosts from './NewsPosts';

function WeeklyNews() {
  const { userData } = useContext(UserContext);
  const username = userData?.username || 'Аноним';
  const role = userData?.role || 'без роли';

  const selectedCategories = ['weekly-news'];

  return (
    <div className="weekly-news-container">
      <h1>Новости недели для {username} ({role})</h1>
      <NewsPosts categories={selectedCategories} />
    </div>
  );
}

export default WeeklyNews;

