import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sessionhandler = () => {
  const code = new URLSearchParams(useLocation().search).get("code");

  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function setUserInfoFromGoogle() {
      if (!code) return;
      try {
        const response = await axios.post(
          `http://localhost:8080/oauth/google?code=${code}`
        );
        console.log(response.data);
        const {
          userInfo: userInfoObject,
          message: successMessage,    
          authResponse: authresponse,
        } = response.data;
        const email = userInfoObject.email;
        const name = userInfoObject.name;
        const picture = userInfoObject.picture;
        const jwt = authresponse.token;
        const userId = authresponse.userId;
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("currentuser", userId);
        console.log("User Email:", email);
        console.log("User Name:", name);
        console.log("User Picture:", picture);
        console.log("JWT TOKEN : ", jwt);
        console.log("User Id : ", userId);
        setUserInfo(userInfoObject);
        setMessage(successMessage);
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error during login:", error);
        setError("Failed to retrieve user information.");
      }
    }
    setUserInfoFromGoogle();
  }, [code]);
  return (
    <div>
      <h2>Session Handler</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
      {userInfo && (
        <div>
          <h3>User Information:</h3>
          <p>
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <img src={userInfo.picture} alt="User Avatar" />
        </div>
      )}
    </div>
  );
};

export default Sessionhandler;
