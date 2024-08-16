import React, { useContext } from 'react';
import './styles/anekdots.css';
import { UserContext } from './UserContext';

function Anekdots() {
  const { userData } = useContext(UserContext);
  const username = userData?.username || 'Аноним';
  const role = userData?.role || 'без роли';
  return (
    <div className="anekdots-container">
      <h1>Анекдоты для {username} ({role})</h1>
      <p>Здесь будут анекдоты</p>
      {/* Дополнительно можно добавить контент, новости, изображения и т.д. */}
    </div>
  );
}

export default Anekdots;
