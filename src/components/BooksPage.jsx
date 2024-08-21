import React, { useEffect, useState } from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import "./BooksPage.css";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [customPage, setCustomPage] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const booksPerPage = 20;
  const totalPages = 200; // Fixed total pages
  const pageRange = 5; // Number of pages to display

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchBooks = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/books/?count=${booksPerPage}&page=${currentPage}&title=${searchQuery}&author=${searchQuery}`);
          const data = await response.json();
          setBooks(data);
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };

      fetchBooks();
    }, 100); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);

  const handleRowClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setMemberId(''); // Reset memberId
    setReturnDate(''); // Reset returnDate
  };

  const handleIssue = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/issued_books/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        alert("Book Issued Successfully");
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.bookID === selectedBook.bookID
              ? { ...book, status: "Issued" }
              : book
          )
        );
        handleCloseModal();
      } else {
        alert("Failed to Issue Book");
      }
    } catch (error) {
      console.error("Error issuing book:", error);
    }
  };

  const handleReturn = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/issued_books/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: selectedBook.bookID,
        }),
      });

      if (response.ok) {
        alert("Book Returned Successfully");
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.bookID === selectedBook.bookID
              ? { ...book, status: "Available" }
              : book
          )
        );
        handleCloseModal();
      } else {
        alert("Failed to Return Book");
      }
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleCustomPage = () => {
    const pageNumber = parseInt(customPage, 10);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      alert("Invalid page number");
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="booksPageContainer">
      <SideNav />
      <div className="books-page-main-content">
      <TopNav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="books-page-card-main">
          <div className="header-container">
            <h2>Books</h2>
          </div>
          <table className="booksPageTable">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Avg Rating</th>
                <th>Publisher</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr
                    key={book.bookID}
                    onClick={() => handleRowClick(book)}
                    className="clickable-row"
                  >
                    <td>{book.bookID}</td>
                    <td>{book.title}</td>
                    <td>{book.authors}</td>
                    <td>{book.average_rating}</td>
                    <td>{book.publisher}</td>
                    <td>{book.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No books available</td>
                </tr>
              )}
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <Button
                  className="page-link"
                  onClick={() => handlePageChange(1)}
                >
                  &laquo; First
                </Button>
              </li>
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <Button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  &lsaquo; Previous
                </Button>
              </li>
              {pageNumbers.map((number) => (
                <li
                  key={number}
                  className={`page-item ${
                    number === currentPage ? "active" : ""
                  }`}
                >
                  <Button
                    className="page-link"
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </Button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <Button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next &rsaquo;
                </Button>
              </li>
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <Button
                  className="page-link"
                  onClick={() => handlePageChange(totalPages)}
                >
                  Last &raquo;
                </Button>
              </li>
            </ul>
            <div className="custom-page">
              <input
                type="number"
                value={customPage}
                onChange={(e) => setCustomPage(e.target.value)}
                placeholder="Page number"
              />
              <Button onClick={handleCustomPage}>Go</Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Modal for displaying book details */}
      {selectedBook && (
        <Modal isOpen={isModalOpen} toggle={handleCloseModal}>
          <ModalHeader toggle={handleCloseModal}>Book Details</ModalHeader>
          <ModalBody>
            <p>
              <strong>Book ID:</strong> {selectedBook.bookID}
            </p>
            <p>
              <strong>Title:</strong> {selectedBook.title}
            </p>
            <p>
              <strong>Author(s):</strong> {selectedBook.authors}
            </p>
            <p>
              <strong>Avg Rating:</strong> {selectedBook.average_rating}
            </p>
            <p>
              <strong>Publisher:</strong> {selectedBook.publisher}
            </p>
            <p>
              <strong>Status:</strong> {selectedBook.status}
            </p>

            {selectedBook.status === "Available" ? (
              <>
                <div>
                  <label>Member ID:</label>
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                  />
                </div>
                <div>
                  <label>Return Date:</label>
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
          </ModalBody>
          <ModalFooter>
            {selectedBook.status === "Available" ? (
              <Button color="primary" onClick={handleIssue}>
                Issue
              </Button>
            ) : (
              <Button color="secondary" onClick={handleReturn}>
                Return
              </Button>
            )}
            <Button color="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default BooksPage;
