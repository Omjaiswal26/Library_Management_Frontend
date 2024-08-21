import React, { createContext, useState, useContext } from 'react';

const BookContext = createContext();

export const useBookContext = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [booksUpdated, setBooksUpdated] = useState(false);

  const triggerRefresh = () => {
    setBooksUpdated(prev => !prev);
  };

  return (
    <BookContext.Provider value={{ booksUpdated, triggerRefresh }}>
      {children}
    </BookContext.Provider>
  );
};
