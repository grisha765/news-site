import React, { useState, useEffect, useContext } from 'react';
import './styles/newsPosts.css';
import api from './api';
import { UserContext } from './UserContext';
import CreatePost from './CreatePost';

const imageCache = new Map();

function NewsPosts({ categories = [] }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts/')
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
    api.delete(`/posts/${postId}`)
      .then(response => {
        setPosts(posts.filter(post => post.id !== postId));
        console.log('Пост удален:', response.data);
      })
      .catch(error => {
        console.error('Ошибка при удалении поста:', error);
      });

    api.delete(`/deletefile/${postId}`)
      .then(response => {
        imageCache.delete(postId);  // Удаляем изображение из кэша
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { userData } = useContext(UserContext);

  useEffect(() => {
    if (imageCache.has(post.id)) {
      setImage(imageCache.get(post.id));
    } else {
      api.get(`/downloadfile/${post.id}`, { responseType: 'blob' })
        .then(response => {
          const imageUrl = URL.createObjectURL(response.data);
          imageCache.set(post.id, imageUrl);
          setImage(imageUrl);
        })
        .catch(error => {
          console.error('Ошибка при загрузке изображения:', error);
        });
    }
  }, [post.id]);

  const handleCardClick = () => {
    setIsModalOpen(true);
    fetchComments();
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

  const fetchComments = () => {
    api.get(`/comments/?post_id=${post.id}`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке комментариев:', error);
        setComments([]);
      });
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    const commentData = {
      post_id: post.id,
      user: userData.username,
      text: newComment,
    };

    api.post('/comments/', commentData)
      .then(response => {
        fetchComments();
        setNewComment('');
      })
      .catch(error => {
        console.error('Ошибка при добавлении комментария:', error);
      });
  };

  const handleDeleteComment = (commentId) => {
    api.delete(`/comments/${post.id}/${commentId}`)
      .then(response => {
        fetchComments();
      })
      .catch(error => {
        console.error('Ошибка при удалении комментария:', error);
      });
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
                  <div className="modal-content-left">
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
                  <div className="comments-section">
                      <h3>Комментарии</h3>
                      {comments.map((comment, index) => (
                          <div key={comment.id || index} className="comment">
                              <p><strong>{comment.username}</strong>: {comment.text}</p>
                              {userData.role === 'admin' && (
                                  <button onClick={() => handleDeleteComment(comment.id)}>Удалить</button>
                              )}
                          </div>
                      ))}
                      {['user', 'admin'].includes(userData.role) && (
                          <div className="add-comment">
                              <textarea
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  placeholder="Напишите комментарий"
                              />
                              <button onClick={handleAddComment}>Отправить</button>
                          </div>
                      )}
                  </div>
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

