import React from 'react';
import './App.css';
import Login from './login/Login.tsx';
import Article from './article/Article.tsx';
import NewArticle from './article/NewArticle.tsx';
import UpdateArticle from './article/UpdateArticle.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login disableCustomTheme={false} />} />
          <Route path="/article" element={<Article />} />
          <Route path="/new-article" element={<NewArticle />} />
          <Route path="/update-article/:id_article" element={<UpdateArticle />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
