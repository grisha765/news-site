import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './styles/header.css';
import CreatePost from './CreatePost';
import { UserContext } from './UserContext';
import Auth from './Auth'; // Импортируем новый компонент Auth

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { userData } = useContext(UserContext);

  const handleLoginClick = () => {
    setIsFrozen(!isFrozen);
    setShowMenu(!showMenu);
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setShowMenu(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowMenu(false);
  };

  const handleCreatePostClick = () => {
    setShowCreatePost(true); // Открываем модальное окно
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false); // Закрываем модальное окно
  };

  const handleCloseMenu = () => {
    setIsFrozen(false);
    setShowMenu(false);
  };

  return (
    <>
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
          <button className={`button ${isFrozen ? 'frozen' : ''}`} onClick={handleLoginClick}>
            {isLoggedIn ? userData.username : 'Вход'}
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="auth-popup">
          <Auth
            isLoggedIn={isLoggedIn}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onCloseMenu={handleCloseMenu}
          />
        </div>
      )}
      
      {showCreatePost && <CreatePost onClose={handleCloseCreatePost} />}
    </>
  );
}

export default Header;

