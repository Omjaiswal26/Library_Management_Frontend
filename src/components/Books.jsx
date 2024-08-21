import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './Books.css';
import { useBookContext } from './BookContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [memberId, setMemberId] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [message, setMessage] = useState('');
  const [showMessageOnly, setShowMessageOnly] = useState(false); // New state for message-only view
  const { triggerRefresh } = useBookContext(); // Use context

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      // Reset the state when closing the modal
      setSelectedBook(null);
      setMessage('');
      setShowMessageOnly(false);
    }
  };

  const handleRowClick = (book) => {
    setSelectedBook(book);
    setMessage(''); // Clear any existing messages
    setShowMessageOnly(false); // Ensure the full modal view is shown
    toggleModal();
  };

  const handleIssue = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/issued_books/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: selectedBook.bookID,
          book_title: selectedBook.title,
          book_author: selectedBook.authors,
          issued_to_member: memberId,
          return_date: returnDate,
          status: "Issued",
        }),
      });

      if (response.ok) {
        setMessage('Book Issued Successfully'); // Set success message
        setShowMessageOnly(true); // Show message only view
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.bookID === selectedBook.bookID ? { ...book, status: 'Issued' } : book
          )
        );
        triggerRefresh(); // Trigger refresh
      } else {
        setMessage('Failed to Issue Book'); // Set error message
      }
    } catch (error) {
      console.error('Error issuing book:', error);
      setMessage('Error issuing book');
    }
  };

  const handleReturn = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/issued_books/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: selectedBook.bookID,
        }),
      });

      if (response.ok) {
        setMessage('Book Returned Successfully'); // Set success message
        setShowMessageOnly(true); // Show message only view
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.bookID === selectedBook.bookID ? { ...book, status: 'Available' } : book
          )
        );
        triggerRefresh(); // Trigger refresh
      } else {
        setMessage('Failed to Return Book'); // Set error message
      }
    } catch (error) {
      console.error('Error returning book:', error);
      setMessage('Error returning book');
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/books/?count=4');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []); // Fetch books once when the component mounts

  return (
    <div className="BooksContainer">
      <Table className="booksTable" hover>
        <thead>
          <tr>
            <th>BookId</th>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.bookID} onClick={() => handleRowClick(book)}>
                <td>{book.bookID}</td>
                <td>{book.title}</td>
                <td>{book.authors}</td>
                <td>{book.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-books-available">
                No Books Available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {showMessageOnly ? '' : (selectedBook ? selectedBook.title : '')}
        </ModalHeader>
        <ModalBody>
          {showMessageOnly ? (
            <p className="message">{message}</p> // Display message only
          ) : (
            <>
              {selectedBook && (
                <>
                  <p><strong>Author:</strong> {selectedBook.authors}</p>
                  <p><strong>Year:</strong> {selectedBook.publication_date}</p>
                  <p><strong>Description:</strong> {selectedBook.description}</p>
                  <p><strong>Status:</strong> {selectedBook.status}</p>

                  {selectedBook.status === 'Available' ? (
                    <>
                      <div>
                        <label><b>Member ID: </b></label>
                        <input
                          type="text"
                          value={memberId}
                          onChange={(e) => setMemberId(e.target.value)}
                        />
                      </div>
                      <div>
                        <label><b>Return Date: </b></label>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <p>Book is currently issued.</p>
                  )}
                </>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {!showMessageOnly && (selectedBook?.status === 'Available' ? (
            <Button color="primary" onClick={handleIssue}>Issue</Button>
          ) : (
            <Button color="secondary" onClick={handleReturn}>Return</Button>
          ))}
          <Button color="secondary" onClick={toggleModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Books;
