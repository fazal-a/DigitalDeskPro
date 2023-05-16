import { useState } from "react";
import { useUserData } from "../../Context/UserDataContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Register = () => {
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState({
    userName: "",
    displayName: "",
    roleName: "",
    password: "",
  });

  const { setUserData } = useUserData();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loginUser = async (formData) => {
    try {
      const response = await fetch("https://localhost:7040/api/Account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setUserData(data);
      if (data) {
        navigate("/room");
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
      password: formData.get("password"),
    };
    const responseData = loginUser(userData);
  };

  const signupButtonHandler = () => {
    navigate("/register");
  };

  return (
    <div className="login-screen">
      <form onSubmit={handleSubmit} className="form">
        <h4>Login</h4>
        <div className="form-floating mb-3 username-div">
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

        <div className="form-floating mb-3 password-div">
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

        <button className="w-100 btn btn-lg btn-success" type="submit">
          Login
        </button>
        <div className="mt-5">
          <p>
            Don't have an account?{" "}
            <button
              className="btn btn-link"
              style={{ paddingTop: "2px", textDecoration: "none" }}
              onClick={signupButtonHandler}
            >
              Signup
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
