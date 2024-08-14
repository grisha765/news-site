import React, { useState } from 'react';
import './header.css';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLoginSubmit = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    // Здесь можно добавить дополнительную логику для авторизации
  };

  return (
    <div className="header-container">
      <div className="header-title">Новосной сайт</div>
      <div className="auth-container">
        <button className="login-button" onClick={handleLoginClick}>Вход</button>
        {showMenu && (
          <div className="login-menu">
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLoginSubmit}>Вход</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;

