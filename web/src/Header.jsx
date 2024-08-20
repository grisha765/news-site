import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import './styles/header.css';
import CreatePost from './CreatePost';
import { UserContext } from './UserContext';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFrozen, setIsFrozen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { userData, setUserData } = useContext(UserContext);

  const handleLoginClick = () => {
    setIsFrozen(!isFrozen);
    setShowMenu(!showMenu);
  };

  const handleLoginSubmit = async () => {
    try {
      setIsFrozen(!isFrozen);
      const response = await api.post('/login', { username, password });
      const user = { username: response.data.user, role: response.data.role };
      setUserData(user);
      setIsLoggedIn(true);
      setShowMenu(false);

    } catch (error) {
      console.error('Ошибка входа:', error);
      setShowMenu(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({ username: '', role: '' });
    setUsername('');
    setPassword('');
  };

  const handleCreatePostClick = () => {
    setShowCreatePost(true); // Открываем модальное окно
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false); // Закрываем модальное окно
  };

  return (
    <div className="header-container">
      <Link to="/" className="header-title">Новости</Link>
      <div className="button-container">
        <button className="button" onClick={() => window.location.href = '#'}>
          Главная
        </button>
        <button className="button" onClick={() => window.location.href = '#/weekly-news'}>
          Новости недели
        </button>
        <button className="button" onClick={() => window.location.href = '#/anekdots'}>
          Анекдоты
        </button>
      </div>
      <div className="auth-container">
        {isLoggedIn && userData.role === 'admin' && (
          <button className="button" onClick={handleCreatePostClick}>
            Создать Пост
          </button>
        )}
        {isLoggedIn ? (
          <div className="user-menu">
            <button className={`login-button ${isFrozen ? 'frozen' : ''}`} onClick={handleLoginClick}>
              {showMenu ? 'Закрыть' : userData.username}
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <p>User: {userData.username}</p>
                <p>Role: {userData.role}</p>
                <button onClick={handleLogout}>Выход</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className={`login-button ${isFrozen ? 'frozen' : ''}`} onClick={handleLoginClick}>
              Вход
            </button>
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
          </>
        )}
      </div>
      {showCreatePost && <CreatePost onClose={handleCloseCreatePost} />}
    </div>
  );
}

export default Header;


