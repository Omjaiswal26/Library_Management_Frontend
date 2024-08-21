import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import './MembersPage.css'; // Ensure this file is updated to match BooksPage.css
import SideNav from './SideNav';
import TopNav from './TopNav';
import 'bootstrap/dist/css/bootstrap.min.css';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [customPage, setCustomPage] = useState(''); // Add this line
  const pageSize = 10; // Number of members per page

  const toggleModal = () => setModal(!modal);
  const toggleAddMemberModal = () => {
    setAddMemberModal(!addMemberModal);
    setSuccessMessage(''); // Reset success message when opening the modal
  };

  const fetchMembers = async (page = 1) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/members_page/?count=${pageSize}&page=${page}`);
      const data = await response.json();

      if (response.ok) {
        setMembers(data.members);
        setTotalPages(data.total_pages);
        setCurrentPage(page); // Update current page
      } else {
        console.error('Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleRowClick = (member) => {
    setSelectedMember(member);
    toggleModal();
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const newMember = {
      member_name: memberName,
      member_email: memberEmail,
      member_phone: memberPhone,
      end_date: endDate,
      is_active: true,
      outstanding_debt: 0,
      books_issued: 0,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/members/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
        
      });

      if (response.ok) {
        setSuccessMessage('New Member Added Successfully');
        fetchMembers(currentPage); // Refresh the members list
        setTimeout(() => {
          toggleAddMemberModal(); // Close the modal after showing the success message
        }, 2000);  // Delay for 2 seconds
        setMemberName('')
        setMemberEmail('')
        setMemberPhone('')
        setEndDate('')
      } else {
        console.error('Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleSettleDebt = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/settle_member_debt/?member_id=${selectedMember.member_id}`, {
        method: 'GET',
      });

      if (response.ok) {
        alert('Outstanding Settled'); // Show a success alert
        fetchMembers(currentPage); // Refresh the members list to update outstanding debt
        toggleModal(); // Close the modal
      } else {
        console.error('Failed to settle debt');
      }
    } catch (error) {
      console.error('Error settling debt:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(pageSize / 2));
    const endPage = Math.min(totalPages, startPage + pageSize - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="membersPageContainer">
      <SideNav />
      <div className="members-page-main-content">
        <TopNav />
        <div className='members-page-card-main'>
            <div className='header-container'>
                <h2>Members</h2>
                <Button className="addButton" onClick={toggleAddMemberModal}>Add Member</Button>
            </div>
          <Table className="membersPageTable" hover>
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Member Name</th>
                <th>Books Issued</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.member_id} onClick={() => handleRowClick(member)} className="clickable-row">
                    <td>{member.member_id}</td>
                    <td>{member.member_name}</td>
                    <td>{member.books_issued}</td>
                    <td>{member.end_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Members Available</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Button className="page-link" onClick={() => fetchMembers(1)}>&laquo; First</Button>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Button className="page-link" onClick={() => fetchMembers(currentPage - 1)}>&lsaquo; Previous</Button>
              </li>
              {pageNumbers.map(number => (
                <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                  <Button className="page-link" onClick={() => fetchMembers(number)}>{number}</Button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Button className="page-link" onClick={() => fetchMembers(currentPage + 1)}>Next &rsaquo;</Button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Button className="page-link" onClick={() => fetchMembers(totalPages)}>Last &raquo;</Button>
              </li>
            </ul>
            <div className="custom-page">
              <input
                type="number"
                value={customPage}
                onChange={(e) => setCustomPage(e.target.value)}
                placeholder="Page number"
              />
              <Button onClick={() => fetchMembers(parseInt(customPage, 10))}>Go</Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Modal for member details */}
      {selectedMember && (
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>{selectedMember.member_name}</ModalHeader>
          <ModalBody>
            <p><strong>Member ID:</strong> {selectedMember.member_id}</p>
            <p><strong>Books Issued:</strong> {selectedMember.books_issued}</p>
            <p><strong>End Date:</strong> {selectedMember.end_date}</p>
            <p><strong>Outstanding Debt:</strong> {selectedMember.outstanding_debt}</p>
            {selectedMember.last_settlement_date && (
              <>
                <p><strong>Last Settlement Date:</strong> {selectedMember.last_settlement_date}</p>
                <p><strong>Last Settled Amount:</strong> {selectedMember.last_settled_amount}</p>
              </>
            )}
            {selectedMember.outstanding_debt > 0 && (
              <Button color="danger" onClick={handleSettleDebt}>Settle Debt</Button>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleModal}>Close</Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Modal for adding a member */}
      <Modal isOpen={addMemberModal} toggle={toggleAddMemberModal}>
        <ModalHeader toggle={toggleAddMemberModal}>Add Member</ModalHeader>
        <Form onSubmit={handleAddMember}>
          <ModalBody>
            {successMessage ? (
              <p className="success-message">{successMessage}</p>
            ) : (
              <>
                <FormGroup>
                  <Label for="memberName">Name</Label>
                  <Input
                    type="text"
                    id="memberName"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="memberEmail">Email</Label>
                  <Input
                    type="email"
                    id="memberEmail"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="memberPhone">Phone</Label>
                  <Input
                    type="text"
                    id="memberPhone"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value.slice(0,10))}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="endDate">End Date</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </FormGroup>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleAddMemberModal}>Cancel</Button>
            <Button color="primary" type="submit">Add Member</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default MembersPage;
