import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './TopChoices.css';

const TopChoices = () => {
    const [books, setBooks] = useState([]);
    const [modal, setModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [memberId, setMemberId] = useState('');
    const [returnDate, setReturnDate] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/books/?count=6');
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const toggleModal = () => setModal(!modal);

    const handleCardClick = (book) => {
        setSelectedBook(book);
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
                    issued_to_member: memberId,
                    return_date: returnDate,
                }),
            });

            if (response.ok) {
                alert('Book Issued Successfully');
                toggleModal();
                // You may want to refetch the books or update the state here
            } else {
                alert('Failed to Issue Book');
            }
        } catch (error) {
            console.error('Error issuing book:', error);
        }
    };

    const handleReturn = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/issued_books/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: selectedBook.bookID,
                }),
            });

            if (response.ok) {
                alert('Book Returned Successfully');
                toggleModal();
                // You may want to refetch the books or update the state here
            } else {
                alert('Failed to Return Book');
            }
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    return (
        <div className='top-choices-section card'>
            <h2 className='top-choices-heading'>Top Choices</h2>
            <div className='top-choices-container'>
                {books.map((book, index) => (
                    <div
                        className="top-choices-card"
                        key={index}
                        onClick={() => handleCardClick(book)}
                    >
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">{book.authors}</p>
                        <p className="book-rating">Rating: {book.average_rating}</p>
                    </div>
                ))}
            </div>

            {/* Modal for book details */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>{selectedBook ? selectedBook.title : ''}</ModalHeader>
                <ModalBody>
                    {selectedBook && (
                        <>
                            <p><strong>Title:</strong> {selectedBook.title}</p>
                            <p><strong>Author:</strong> {selectedBook.authors}</p>
                            <p><strong>Average Rating:</strong> {selectedBook.average_rating}</p>

                            {selectedBook.status === 'Available' ? (
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
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    {selectedBook?.status === 'Available' ? (
                        <Button color="primary" onClick={handleIssue}>Issue</Button>
                    ) : (
                        <Button color="secondary" onClick={handleReturn}>Return</Button>
                    )}
                    <Button color="secondary" onClick={toggleModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default TopChoices;
