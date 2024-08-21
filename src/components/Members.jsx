import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "./Members.css";
import { useBookContext } from "./BookContext";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { booksUpdated } = useBookContext();

  // State variables for add member form and success message
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [endDate, setEndDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const toggleModal = () => setModal(!modal);
  const toggleAddMemberModal = () => {
    setAddMemberModal(!addMemberModal);
    setSuccessMessage(""); // Reset success message when opening the modal
  };

  const handleRowClick = (member) => {
    setSelectedMember(member);
    toggleModal();
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/members/?count=5");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
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
      const response = await fetch("http://127.0.0.1:8000/members/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (response.ok) {
        setSuccessMessage("New Member Added Successfully");
        fetchMembers(); // Refresh the members list
        setTimeout(() => {
          toggleAddMemberModal(); // Close the modal after showing the success message
        }, 2000); // Delay for 2 seconds
        setMemberName('')
        setMemberEmail('')
        setMemberPhone('')
        setEndDate('')
      } else {
        console.error("Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleSettleDebt = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/settle_member_debt/?member_id=${selectedMember.member_id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        alert("Outstanding Settled"); // Show a success alert
        fetchMembers(); // Refresh the members list to update outstanding debt
        toggleModal(); // Close the modal
      } else {
        console.error("Failed to settle debt");
      }
    } catch (error) {
      console.error("Error settling debt:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [booksUpdated]);

  return (
    <div className="card">
      <div className="member-card-header">
        <h4 className="card-title">Members</h4>
        <button className="addButton" onClick={toggleAddMemberModal}>
          Add Member
        </button>
      </div>
      <div className="MembersContainer">
        <Table className="membersTable" hover>
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
                <tr
                  key={member.member_id}
                  onClick={() => handleRowClick(member)}
                >
                  <td>{member.member_id}</td>
                  <td>{member.member_name}</td>
                  <td>{member.books_issued}</td>
                  <td>{member.end_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-members-available">
                  No Members Available
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Modal for member details */}
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>
            {selectedMember ? selectedMember.member_name : ""}
          </ModalHeader>
          <ModalBody>
            {selectedMember && (
              <>
                <p>
                  <strong>Member ID:</strong> {selectedMember.member_id}
                </p>
                <p>
                  <strong>Books Issued:</strong> {selectedMember.books_issued}
                </p>
                <p>
                  <strong>End Date:</strong> {selectedMember.end_date}
                </p>
                <p>
                  <strong>Outstanding Debt:</strong>{" "}
                  {selectedMember.outstanding_debt}
                </p>
                {selectedMember.last_settlement_date && (
                  <>
                    <p>
                      <strong>Last Settlement Date:</strong>{" "}
                      {selectedMember.last_settlement_date}
                    </p>
                    <p>
                      <strong>Last Settled Amount:</strong>{" "}
                      {selectedMember.last_settled_amount}
                    </p>
                  </>
                )}
                {selectedMember.outstanding_debt > 0 && (
                  <Button color="danger" onClick={handleSettleDebt}>
                    Settle Debt
                  </Button>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal for adding a member */}
        <Modal isOpen={addMemberModal} toggle={toggleAddMemberModal}>
          <ModalHeader toggle={toggleAddMemberModal}>Add Member</ModalHeader>
          <Form onSubmit={handleAddMember}>
            <ModalBody>
              {successMessage ? (
                <p className="text-success">{successMessage}</p>
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
                      type="number"
                      id="memberPhone"
                      value={memberPhone}
                      onChange={(e) =>
                        setMemberPhone(e.target.value.slice(0, 10))
                      }
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
              {!successMessage && (
                <Button color="primary" type="submit">
                  Add Member
                </Button>
              )}
              <Button color="secondary" onClick={toggleAddMemberModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Members;
