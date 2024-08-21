import React, { useState, useEffect } from 'react';
import './styles/createPost.css';
import api from './api';

const CATEGORIES = ['main', 'weekly-news', 'anekdots']; // Предопределенные категории

function CreatePost({ onClose, postToEdit = null }) {
  const [header, setHeader] = useState(postToEdit ? postToEdit.header : '');
  const [body, setBody] = useState(postToEdit ? postToEdit.body : '');
  const [category, setCategory] = useState(postToEdit ? postToEdit.category : CATEGORIES[0]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (postToEdit) {
      setHeader(postToEdit.header);
      setBody(postToEdit.body);
      setCategory(postToEdit.category);
    }
  }, [postToEdit]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file && !postToEdit) {
      setError('Пожалуйста, загрузите фото для поста.');
      return;
    }

    try {
      // Если редактируем пост, сначала удаляем старый
      if (postToEdit) {
        await api.delete(`/texts/${postToEdit.id}`);
        await api.delete(`/deletefile/${postToEdit.id}`);
      }

      // Создаем новый пост
      const postResponse = await api.post('/texts/', {
        header,
        body,
        category,
      });

      const postId = postResponse.data.id;

      console.log('Post created successfully:', postResponse.data);

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const fileResponse = await api.post(`/uploadfile/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('File uploaded successfully:', fileResponse.data);
      }

      setHeader('');
      setBody('');
      setCategory(CATEGORIES[0]);
      setFile(null);

      onClose();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError('Ошибка валидации: пожалуйста, проверьте введенные данные.');
      } else {
        setError('Произошла ошибка при создании поста. Попробуйте позже.');
      }
      console.error('Error creating post or uploading file:', err);
    }
  };

  return (
    <div className="create-post-modal">
      <div className="create-post-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{postToEdit ? 'Редактировать пост' : 'Создать новый пост'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="header">Заголовок</label>
            <input
              type="text"
              id="header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Содержание</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="file">Загрузить фото</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/*"
              required={!postToEdit} // Файл обязателен только при создании нового поста
            />
          </div>
          <button type="submit">{postToEdit ? 'Сохранить изменения' : 'Создать'}</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;

