import { useState, useContext } from 'react';
import api from './api';
import { UserContext } from './UserContext';
import './styles/auth.css'; // Переименованный CSS файл для Auth

function Auth({ onLoginSuccess, onLogout, isLoggedIn, onCloseMenu }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { userData, setUserData } = useContext(UserContext);

  const handleLoginSubmit = async () => {
    try {
      const response = await api.post('/login', { username, password });
      const user = { username: response.data.user, role: response.data.role };
      setUserData(user);
      onLoginSuccess(user);
      onCloseMenu();
    } catch (error) {
      console.error('Ошибка входа:', error);
      onCloseMenu();
    }
  };

  const handleLogoutClick = () => {
    setUserData({ username: '', role: '' });
    onLogout();
    onCloseMenu();
  };

  if (isLoggedIn) {
    return (
      <div className="dropdown-menu">
        <p>User: {userData.username}</p>
        <p>Role: {userData.role}</p>
        <button onClick={handleLogoutClick}>Выход</button>
      </div>
    );
  }

  return (
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
  );
}

export default Auth;

