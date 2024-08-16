import React, { useContext } from 'react';
import './styles/weeklyNews.css';
import { UserContext } from './UserContext';

function WeeklyNews() {
  const { userData } = useContext(UserContext);
  const username = userData?.username || 'Аноним';
  const role = userData?.role || 'без роли';
  return (
    <div className="weekly-news-container">
      <h1>Новости недели для {username} ({role})</h1>
      <p>Здесь будут отображаться все последние новости за неделю.</p>
      {/* Дополнительно можно добавить контент, новости, изображения и т.д. */}
    </div>
  );
}

export default WeeklyNews;

