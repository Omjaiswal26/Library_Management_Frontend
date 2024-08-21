import React, { useState, useEffect } from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import './OverdueBookList.css';

const OverdueBookList = () => {
    const [overdueBooks, setOverdueBooks] = useState([]);

    useEffect(() => {
        const fetchOverdueBooks = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/overdue_book_list/?count=4');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedData = data.map(book => ({
                    memberId: book.member_id,
                    memberName: book.member_name,
                    bookId: book.book_id,
                    title: book.book_title || 'N/A',
                    author: book.book_author || 'N/A',
                    overdue: `${book.overdue} days`,
                    status: 'Overdue', // Assuming all books are overdue
                    fine: `${book.fine}`
                }));
                setOverdueBooks(formattedData);
            } catch (error) {
                console.error('Error fetching overdue books:', error);
            }
        };

        fetchOverdueBooks();
    }, []);

    return (
        <div className="OverdueBookListContainer">
            <Card className="overdue-book-list-card">
                <CardBody>
                    <h2 className='overdue-book-list-title'>Overdue Book List</h2>
                    <Table className="overdueTable" hover responsive>
                        <thead>
                            <tr>
                                <th>Member Id</th>
                                <th>Member Name</th>
                                <th>Book Id</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Overdue</th>
                                <th>Status</th>
                                <th>Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overdueBooks.length > 0 ? (
                                overdueBooks.map((book, index) => (
                                    <tr key={index}>
                                        <td>{book.memberId}</td>
                                        <td>{book.memberName}</td>
                                        <td>{book.bookId}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.overdue}</td>
                                        <td>{book.status}</td>
                                        <td>{book.fine}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-books-available">
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
};

export default OverdueBookList;
