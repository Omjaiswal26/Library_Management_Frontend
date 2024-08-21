import logo from './logo.svg';
import './App.css';
import React from 'react';
import HomePage from './components/HomePage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import BooksPage from './components/BooksPage';
import MembersPage from './components/MembersPage';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/books' element={<BooksPage/>}/>
        <Route path='/members' element={<MembersPage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
