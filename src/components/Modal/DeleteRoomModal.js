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
} from "mdb-react-ui-kit";

import { AiOutlineDelete } from "react-icons/ai";

const DeleteRoomModal = ({ handleDelete, roomId }) => {

  const [centredModal, setCentredModal] = useState(false);

  const handleSubmit = () => {
      toggleShow();
      handleDelete(roomId)
  }


  const toggleShow = () => setCentredModal(!centredModal);

  return (
    <>
      <MDBBtn className="btn btn-danger me-3" onClick={toggleShow}>
        Delete
        <AiOutlineDelete className='ms-2' size='20px'/>
      </MDBBtn>

      <MDBModal tabIndex="-1" show={centredModal} setShow={setCentredModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Delete Room</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <p className="fs-4">Are you sure that you want to delete this room.</p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleSubmit} className="btn btn-danger">Confirm</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default DeleteRoomModal;
