import React, { useState, useEffect, useContext } from 'react';
import './styles/newsPosts.css';
import api from './api';
import { UserContext } from './UserContext';
import CreatePost from './CreatePost';

function NewsPosts({ categories = [] }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/texts')
      .then(response => {
        let filteredPosts = response.data;
        if (categories.length > 0) {
          filteredPosts = filteredPosts.filter(post =>
            categories.includes(post.category)
          );
        }
        setPosts(filteredPosts);
      })
      .catch(error => {
        console.error('Ошибка при загрузке постов:', error);
      });
  }, [categories]);

  const handleDeletePost = (postId) => {
    api.delete(`/texts/${postId}`)
      .then(response => {
        setPosts(posts.filter(post => post.id !== postId));
        console.log('Пост удален:', response.data);
      })
      .catch(error => {
        console.error('Ошибка при удалении поста:', error);
      });

    api.delete(`/deletefile/${postId}`)
      .then(response => {
        console.log('Изображение удалено:', response.data);
      })
      .catch(error => {
        console.error('Ошибка при удалении изображения:', error);
      });
  };

  return (
    <div className="news-posts-container">
      {posts.map(post => (
        <NewsCard key={post.id} post={post} onDelete={handleDeletePost} />
      ))}
    </div>
  );
}

function NewsCard({ post, onDelete }) {
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    api.get(`/downloadfile/${post.id}`, { responseType: 'blob' })
      .then(response => {
        const imageUrl = URL.createObjectURL(response.data);
        setImage(imageUrl);
      })
      .catch(error => {
        console.error('Ошибка при загрузке изображения:', error);
      });
  }, [post.id]);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditClick = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="news-card" onClick={handleCardClick}>
        {image && <img src={image} alt={post.header} className="news-card-image" />}
        <div className="news-card-header">
          <h2>{post.header}</h2>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>{post.header}</h2>
            <p>{post.body}</p>
            {image && <img src={image} alt={post.header} className="modal-image" />}
            {userData.role === 'admin' && (
              <>
                <button className="edit-button" onClick={handleEditClick}>Редактировать</button>
                <button className="delete-button" onClick={() => onDelete(post.id)}>Удалить</button>
              </>
            )}
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <CreatePost postToEdit={post} onClose={handleCloseEditModal} />
      )}
    </>
  );
}

export default NewsPosts;

