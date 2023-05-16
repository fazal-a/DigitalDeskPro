import React, { useEffect, useContext, useState, useRef } from "react";
import { useUserData } from "../../Context/UserDataContext";

import { createRoom } from "../../Services/RoomServices/CreateRoomService";
import { getRooms } from "../../Services/RoomServices/GetRoomsService";
import { deleteRoom } from "../../Services/RoomServices/DeleteRoomService";
import { editRoom } from "../../Services/RoomServices/EditRoomService";

import EditRoomModal from "../Modal/EditRoomModal";
import DeleteRoomModal from "../Modal/DeleteRoomModal";

import NavBar from "../../Utils/NavBar/NavBar";
import { useNavigate } from "react-router-dom";

import "./Room.css";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

const Room = () => {
  const [roomsData, setRoomsData] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const { userData, setUserData, deleteUserData } = useUserData();
  const [roomName, setRoomName] = useState("");

  const [roomDeleted, setRoomDeleted] = useState(false);
  const [roomEdited, setRoomEdited] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);
  const [participents, setParticipents] = useState();

  const handleJoinRoom = () => {
    setJoinRoom(!joinRoom);
    console.log(!joinRoom);
  };

  const navigate = useNavigate();
  let roomsDiv;

  const handleInputChange = (event) => {
    setRoomName(event.target.value);
  };

  const getRoomData = async (token) => {
    const allRoomsData = await getRooms(token, pageNumber);
    setRoomsData(allRoomsData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userData) {
      const token = userData.token;
      console.log(token);
      await createRoom(roomName, token);
      setRoomName("");
      await getRoomData(token);
    }
  };

  const handleJoinRoomClick = async (examId) => {
    // handleJoinRoom();
    // navigate(`/home/${examId}`);
    navigate(`/home/${examId}`, { state: { callback: handleJoinRoom } });
  };

  const handleDeleteRoomClick = async (examId) => {
    if (userData) {
      const token = userData.token;
      deleteRoom(examId, token);
      setRoomDeleted(true);
    }
    navigate(`/room/`);
  };

  const handleEditRommClick = (examId, name) => {
    if (userData) {
      const token = userData.token;
      editRoom(examId, name, token);
      console.log(examId, name, token);
      setRoomEdited(true);
    }
    navigate(`/room/`);
  };

  const updateParticipents = () => {
    if (roomsData) {
      let result = roomsData?.map((a) => a.countMember);
      setParticipents(result);
      console.log(result);
    }
  };

  useEffect(() => {
    if (userData) {
      getRoomData(userData.token);
      updateParticipents();
    }

    setRoomDeleted(false);
    setRoomEdited(false);
    
  }, [userData, roomDeleted, roomEdited, joinRoom]);

  if (roomsData) {
    roomsDiv = roomsData.map((room, index) => {
      const { examId, examName, userName, countMember } = room;
      return (
        <tr className="text-center" key={index}>
          <th scope="row">{examId ? examId : "No exam id exist"}</th>
          <td>{examName ? examName : "No exam Name exist"}</td>
          <td>{countMember ? countMember : "No one joined yet"}</td>
          <td>{userName ? userName : "No user Name exist"}</td>
          <td>
            <button
              className="btn btn-dark"
              onClick={() => handleJoinRoomClick(examId)}
            >
              Join Examinee Room
              <AiOutlineUsergroupAdd className="ms-2" size="20px" />
            </button>
          </td>
          <td colSpan="2">
            {userData.userName === userName && (
              <DeleteRoomModal
                handleDelete={handleDeleteRoomClick}
                roomId={examId}
              />
            )}
            {userData.roleName === "Proctor" &&
              userData.userName === userName && (
                <EditRoomModal
                  handleEdit={handleEditRommClick}
                  roomId={examId}
                  roomExamName={examName}
                />
              )}
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <NavBar />
      {userData.roleName === "Proctor" && (
        <div className="create-room mb-5">
          <form onSubmit={handleSubmit} className="form mt-5">
            <h4>Create Room</h4>
            <div className="row g-3 align-items-center mt-2">
              <div className="col-auto mb-4">
                <label className="fw-lighter text-muted" htmlFor="roomName">
                  Room Name *
                </label>
                {/* Added label and asterisk */}
                <input
                  type="text"
                  className="form-control"
                  name="roomName"
                  id="roomName"
                  placeholder="Enter the room name"
                  value={roomName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col">
                <button className="btn btn-primary" type="submit">
                  Create Room
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="container">
        <table className="table table-striped mt-5">
          <thead>
            <tr className="text-center">
              <th scope="col">Exam ID</th>
              <th scope="col">Exam Name</th>
              <th scope="col">Participents</th>
              <th scope="col">Created By</th>
              <th scope="col">Join</th>

              {userData.roleName === "Proctor" && <th scope="col">Actions</th>}
            </tr>
          </thead>
          <tbody>{roomsDiv}</tbody>
        </table>

        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a
                className="page-link"
                href="#"
                tabIndex="-1"
                aria-disabled="true"
              >
                Previous
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item ">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Room;
