import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import 'font-awesome/css/font-awesome.min.css';
import "./Register.css";
const Register = () => {
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      username: name,
      mailId: email,
      password: password,
    };
    try {
      const response = await fetch("http://172.16.2.211:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const registeredUser = await response.json();
        setMessage("User registered successfully!");
        console.log("User registered successfully", registeredUser);
        setMessageVisible(true);
        setTimeout(() => {
          setMessageVisible(false);
          navigate("/login");
        }, 2000);
      } else {
        setMessage("Registration Failed");
        console.log("Registration Failed");
      }
    } catch (error) {
      console.error("Error occurred during registration:", error);
    }
  };

  return (
    <>
      {messageVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "600px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#EDFBD8",
            borderRadius: "8px",
            boxShadow: "0px 0px 5px -3px #111",
            width: "320px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            zIndex: 1000,
            transition: "opacity 0.5s ease",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              transform: "translateY(-2px)",
              marginRight: "8px",
            }}
          >
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z"
                fill="#393a37"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <div
            style={{
              fontWeight: "500",
              fontSize: "14px",
              color: "#2B641E",
            }}
          >
            {message}
          </div>
          <div
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
              marginLeft: "auto",
            }}
            onClick={() => setMessageVisible(false)}
          >
            <svg
              height="20"
              viewBox="0 0 20 20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"
                fill="#2B641E"
              ></path>
            </svg>
          </div>
        </div>
      )}
      <br></br>
      <br></br>
      <div style={{ textAlign: "center", marginTop: "5px" }}>
        <div className="container">
          <h1 className="heading">Sign Up</h1>
          <form className="form" onSubmit={handleRegister}>
            <div className="input-container">
              <i className="fa fa-user"></i>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="input-container">
              <i className="fa fa-envelope" style={{ fontSize: "16px" }}></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>
            <div className="input-container">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>
            <button type="submit" className="login-button">
              Register
            </button>
          </form>
          <br></br>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;

// import React, { useState, useContext, useEffect } from "react";
// import AppContext from "../Context/Context";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "../axiosProduct";
// import "./Login.css";

// function Login() {
//   const { setUserId } = useContext(AppContext);
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("lokesh@gmail.com");
//   const [password, setPassword] = useState("123");
//   const [error, setError] = useState(null);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const loginData = {
//       mailId: email,
//       password: password,
//     };

//     try {
//       const response = await axios.post("/login", loginData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.data;

//       if (response) {
//         const { token, userId } = data;
//         setUserId(userId);
//         localStorage.setItem("currentuser", userId);
//         localStorage.setItem("jwt", token);

//         navigate("/");
//       } else {
//         const errorMessage = data?.message || "Login failed";
//         setError(errorMessage);
//       }
//     } catch (error) {
//       console.error("Error occurred during login:", error);
//       setError("Invalid username or password");
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       const response = await axios.get("/login", { withCredentials: true });
//       if (response.status === 200) {
//         const googleLoginUrl = response.data.url;
//         window.location.href = googleLoginUrl;
//       } else {
//         alert("Google login failed");
//         console.error(
//           "Failed to get login URL:",
//           response.status,
//           response.data
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching Google login URL:", error);
//     }
//   };

//   return (
//     <>
//       <br />
//       <br />
//       <div className="container" style={{ display: "flex", paddingTop: "0%" }}>
//         <div className="heading">Sign In</div>
//         <br />
//         <div>
//           <form className="form" onSubmit={handleLogin}>
//             <div className="input-container">
//               <i
//                 className="fa fa-envelope icon"
//                 style={{ marginTop: "15%", fontSize: "17px" }}
//               ></i>
//               <input
//                 required
//                 className="input"
//                 type="email"
//                 name="email"
//                 placeholder="E-mail"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="input-container">
//               <i
//                 className="fa fa-lock icon"
//                 style={{ marginTop: "15%", fontSize: "22px" }}
//               ></i>
//               <input
//                 required
//                 className="input"
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             {error && <p style={{ color: "red" }}>{error}</p>}

//             <input className="login-button" type="submit" value="Sign In" />
//           </form>

//           <button className="gsi-material-button" onClick={handleGoogleLogin}>
//             Sign in with Google
//           </button>
//           {/* <button className="gsi-material-button" onClick={handleGithubLogin}>
//             Sign in with GitHub
//           </button> */}

//           <br />
//           <p>
//             Don't have an account? <Link to="/register">Register here</Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Login;

// // http://192.168.77.227:8080/jwtcheck
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'font-awesome/css/font-awesome.min.css'; // Ensure this is imported in your project
// import axios from "../axiosProduct";
// const Register = () => {
//     const navigate = useNavigate();
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         const userData = {
//             username: name,
//             mailId: email,
//             password: password,
//         };
//         try {
//             const response = await fetch('http://172.16.2.211:8080/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(userData),
//             });
//             if (response.ok) {
//                 const registeredUser = await response.json();
//                 console.log("User registered successfully", registeredUser);
//                 navigate("/login");
//             } else {
//                 console.log("Registration Failed");
//             }
//         } catch (error) {
//             console.error("Error occurred during registration:", error);
//         }
//     };

//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px', padding: '40px' }}>
//             <div style={{padding:'3%'}}></div>
//             <h1 style={{ fontFamily: 'Arial, sans-serif', color: 'green' }}>Register</h1>
//             <form onSubmit={handleRegister}>
//                 <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <i className="fa fa-user" style={{ marginRight: '10px', color: '#999' }}></i>
//                     <input
//                         type="text"
//                         placeholder="Name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                         style={{
//                             padding: '10px',
//                             border: '1px solid #ccc',
//                             borderRadius: '5px',
//                             width: '300px',
//                         }}
//                     />
//                 </div>
//                 <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <i className="fa fa-envelope" style={{ marginRight: '10px', color: '#999' }}></i>
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         style={{
//                             padding: '10px',
//                             border: '1px solid #ccc',
//                             borderRadius: '5px',
//                             width: '300px',
//                         }}
//                     />
//                 </div>
//                 <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <i className="fa fa-lock" style={{ marginRight: '10px', color: '#999' }}></i>
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         style={{
//                             padding: '10px',
//                             border: '1px solid #ccc',
//                             borderRadius: '5px',
//                             width: '300px',
//                         }}
//                     />
//                 </div>
//                 <br />
//                 <button
//                     type="submit"
//                     style={{
//                         padding: '10px 20px',
//                         fontSize: '16px',
//                         cursor: 'pointer',
//                         backgroundColor: '#4285F4',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '5px'
//                     }}
//                 >
//                     Register
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Register;
