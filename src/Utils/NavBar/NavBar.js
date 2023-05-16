import React from "react";
import { useUserData  } from "../../Context/UserDataContext";
import { useNavigate } from 'react-router-dom';
import logo from '../../components/assets/images/logo2.svg'
import "./NavBar.css";

const NavBar = () => {
  const { userData, setUserData, deleteUserData } = useUserData();
  const navigate = useNavigate();
  const logoutHandler = () => {
    deleteUserData();
    
    navigate('/login');
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark ps-4 pe-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img  src={logo} alt='jobster logo' className='logo' width='40px' height='40px'/>
            Proctor Examinee
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
            </ul>
            <div className="d-flex justify-content-center align-items-center" >
              <span className="pe-4" style={{color: 'white'}}>{userData.userName? userData.userName: <></>}</span>
              <button className="btn btn-outline-light" type="submit" onClick={logoutHandler}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default NavBar;
