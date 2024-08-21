import React, { useState, useEffect } from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import './BooksIssued.css';

const BooksIssued = () => {
    const [issuedBooks, setIssuedBooks] = useState([]);

    // Fetch data from API
    const fetchIssuedBooks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/issued_books_list/?count=8');
            const data = await response.json();
            setIssuedBooks(data);
        } catch (error) {
            console.error('Error fetching issued books:', error);
        }
    };

    useEffect(() => {
        fetchIssuedBooks();
    }, []); // Fetch data once when component mounts

    return (
        <div className="BooksIssuedContainer">
            <Card className="books-issued-card">
                <CardBody>
                    <h2 className='books-issued-title'>Books Issued</h2>
                    <Table className="issuedTable" hover responsive>
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Member ID</th>
                                <th>Issue Date</th>
                                <th>Return Date</th>
                                <th>Fine</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                        {issuedBooks.length > 0 ? (
                            issuedBooks.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.book_id}</td>
                                    <td>{book.issued_to_member}</td>
                                    <td>{book.issue_date}</td>
                                    <td>{book.return_date}</td>
                                    <td>{book.fine}</td>
                                    <td><span className="view-details">View Details</span></td>
                                </tr>
                            ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-books-available">
                                        No Books Overdue
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}

export default BooksIssued;
