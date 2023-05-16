import { useState, useContext, useEffect } from "react";
import { useUserData } from "../../Context/UserDataContext";
// import {
//   createConnection,
//   stopHubConnection,
// } from "../../Services/HubConnectionServices/HubConnectionService";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Popup from "../Popup/Popup";

const Register = () => {
  const [hubConnection, setHubConnection] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState({
    userName: "",
    displayName: "",
    roleName: "",
    password: "",
  });

  const { userData, setUserData } = useUserData();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const registerUser = async (formData) => {
    try {
      const response = await fetch(
        "https://localhost:7040/api/Account/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log(
        "data variable printed from registerUser function of Register.js",
        data
      );

      setUserData(data);
      console.log(
        "res.status and res.ok printed from registerUser function of Register.js",
        response.status,
        response.ok
      );

      if (response.ok) {
        navigate("/room");
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      userName: formData.get("userName"),
      displayName: formData.get("displayName"),
      roleName: formData.get("roleName"),
      password: formData.get("password"),
    };
    const responseData = registerUser(userData);
    console.log(
      "response printed from handle submit of Register.js: ",
      responseData
    );
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const loginButtonHandler = () =>{
    navigate('/login');

  }

  return (
    <div className="register-screen">
      <form onSubmit={handleSubmit} className="form">
        <h4>Create an Account</h4>
        <div className="form-floating mb-3 input-divs">
          <input
            type="text"
            className="form-control"
            name="userName"
            id="userName"
            placeholder="Username"
            value={registerForm.userName}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="userName">Username</label>
        </div>
        <div className="form-floating mb-3 input-divs">
          <input
            type="text"
            className="form-control"
            name="displayName"
            id="displayName"
            placeholder="Display Name"
            value={registerForm.displayName}
            onChange={handleInputChange}
            maxLength={20}
            required
          />
          <label htmlFor="displayName">Display Name</label>
        </div>
        <div className="form-floating mb-3 input-divs">
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={handleInputChange}
            minLength={6}
            maxLength={20}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-floating mb-3 input-divs">
          <select
            className="form-control"
            name="roleName"
            id="roleName"
            value={registerForm.roleName}
            onChange={handleInputChange}
            required
          >
            <option value="Examinee">Examinee</option>
            <option value="Proctor">Proctor</option>
          </select>
          <label htmlFor="roleName">Role Name</label>
        </div>
        <button className="w-100 btn btn-lg btn-success" type="submit">
          Register
        </button>
        <div className="mt-5"  >
        <p>Already have an account? <button className="btn btn-link" style={{paddingTop: "2px", textDecoration:"none"}} onClick={loginButtonHandler} >Login</button></p>
        </div>
      </form>
      {showPopup && (
        <Popup
          success={loginSuccess}
          onClose={handlePopupClose}
          text={"Registration"}
        />
      )}
    </div>
  );
};

export default Register;
