import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBInputGroup,
} from "mdb-react-ui-kit";

import { FiEdit } from "react-icons/fi";


const EditRoomModal = ({ handleEdit, roomId, roomExamName }) => {
  const [roomName, setRoomName] = useState(roomExamName);
  const [centredModal, setCentredModal] = useState(false);


  const handleChange = (event) => {

    let value = event.target.value
    setRoomName(value)
  }

  const handleSubmit = () => {
    handleEdit(roomId, roomName)
    toggleShow();
    setRoomName('')
  }


  const toggleShow = () => setCentredModal(!centredModal);

  return (
    <>
      <MDBBtn className="btn btn-info" onClick={toggleShow}>
        Edit
        <FiEdit className='ms-2' size='20px'/>
      </MDBBtn>

      <MDBModal tabIndex="-1" show={centredModal} setShow={setCentredModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Enter Room Name</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                name="rooname"
                label="Enter new room name"
                onChange={handleChange}
                value={roomName}
                required
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleSubmit} className="btn btn-success">Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default EditRoomModal;
