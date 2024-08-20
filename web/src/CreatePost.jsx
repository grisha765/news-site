import React, { useState } from 'react';
import './styles/createPost.css';

function CreatePost({ onClose }) {
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика для отправки данных на сервер
    console.log({ header, body, category });
    // После отправки можно очистить форму
    setHeader('');
    setBody('');
    setCategory('');
    // Закрыть окно
    onClose();
  };

  return (
    <div className="create-post-modal">
      <div className="create-post-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Создать новый пост</h2>
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
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <button type="submit">Создать</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;

