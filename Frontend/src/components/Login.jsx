import React, { useState, useContext, useEffect } from "react";
import AppContext from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosProduct";
import "./Login.css";

function Login() {
  const { setUserId } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("lokesh@gmail.com");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      mailId: email,
      password: password,
    };

    try {
      const response = await axios.post("/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.data;

      if (response) {
        const { token, userId } = data;
        setUserId(userId);
        localStorage.setItem("currentuser", userId);
        localStorage.setItem("jwt", token);

        navigate("/");
      } else {
        const errorMessage = data?.message || "Login failed";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setError("Invalid username or password");
    }
  };
  const handleGoogleLogin = async () => {
    try {
      console.log("Requesting Google login URL from backend...");
      const response = await axios.get("/login", { withCredentials: true });

      if (response.status === 200) {
        const googleLoginUrl = response.data.url;
        window.location.href = googleLoginUrl;
      } else {
        alert("google login failed");
        console.error(
          "Failed to get login URL:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching Google login URL:", error);
    }
  };

  const handleGoogleCallback = async (code) => {
    try {
      console.log("Calling handleGoogleCallback with code:", code);
      const response = await axios.get(`/oauth/google?code=${code}`);

      if (response.status === 200) {
        console.log("Response from backend:", response.data);
        const userInfoString = response.data.userInfo.trim();
        const userInfo = JSON.parse(userInfoString);
        console.log("User email:", userInfo.email);
      } else {
        console.error("Google login failed:", response.data.error);
      }
    } catch (error) {
      console.error("Error during Google login callback:", error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    console.log("Google OAuth Code:", code);
    if (code) {
      handleGoogleCallback(code);
    }
  }, []);

  return (
    <>
      <br></br>
      <br></br>
      <div className="container" style={{ display: "flex", paddingTop: "0%" }}>
        <div className="heading">Sign In</div>
        <br />
        <div>
          <form className="form" onSubmit={handleLogin}>
            {/* Email Input with Icon */}
            <div className="input-container">
              <i
                className="fa fa-envelope icon"
                style={{ marginTop: "15%", fontSize: "17px" }}
              ></i>
              <input
                required
                className="input"
                type="email"
                name="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input with Icon */}
            <div className="input-container">
              <i
                className="fa fa-lock icon"
                style={{ marginTop: "15%", fontSize: "22px" }}
              ></i>
              <input
                required
                className="input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Login Button */}
            <input className="login-button" type="submit" value="Sign In" />
          </form>
          <button
            className="gsi-material-button"
            onClick={handleGoogleLogin}
            style={{
              fontFamily: "times-new-roman",
              width: "200px", // Set desired width
              height: "50px", // Set desired height
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s, transform 0.3s", // Added transform transition
              // backgroundColor: '#4285F4',
            }}
            onMouseOver={(e) => {
              // e.currentTarget.style.backgroundColor = '#357ae8';
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              // e.currentTarget.style.backgroundColor = '#4285F4';
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div className="gsi-material-button-icon">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                style={{ display: "block", width: "24px", height: "24px" }} // Set icon size
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">
              Sign in with Google
            </span>
          </button>

          {/* <div className="social-account-container">
            <span className="title">Or Sign in with</span>
            <div className="social-accounts">
              <button
                className="social-button google"
                onClick={handleGoogleLogin}
              >
                <svg
                  className="svg"
                  xmlns="http:www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 488 512"
                >
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
              </button>
              <button className="social-button apple">
                <svg
                  className="svg"
                  xmlns="http:www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 384 512"
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                </svg>
              </button>
              <button className="social-button twitter">
                <svg
                  className="svg"
                  xmlns="http:www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                </svg>
              </button>
            </div>
          </div> */}
        </div>

        {/* <div>
                <div className="social-account-container">
                    <span className="title">Or Sign in with</span>
                    <div className="social-accounts">
                    </div>
                </div>
            </div> */}
        <br></br>

        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </>
  );
}

export default Login;

// import React, { useState, useContext } from "react";
// import AppContext from "../Context/Context"; // Your context for user state
// import { Link, useNavigate } from 'react-router-dom';
// import axios from "../axiosProduct"; // Your axios instance
// import './Login.css'
// function Login() {
//     const { setUserId } = useContext(AppContext);
//     const navigate = useNavigate();

//     const [email, setEmail] = useState("lokesh@gmail.com");
//     const [password, setPassword] = useState("123");
//     const [error, setError] = useState(null);

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         const loginData = {
//             mailId: email,
//             password: password
//         };

//         try {
//             const response = await axios.post('/login', loginData, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             const data = await response.data;

//             if (response) {
//                 const { token, userId } = data;
//                 setUserId(userId);
//                 localStorage.setItem("currentuser", userId);
//                 localStorage.setItem('jwt', token);

//                 navigate('/'); // Redirect to homepage
//             } else {
//                 const errorMessage = data?.message || "Login failed";
//                 setError(errorMessage);
//             }
//         } catch (error) {
//             console.error("Error occurred during login:", error);
//             setError("Invalid username or password");
//         }
//     };

//     return (
//         <div className="container">
//             <div className="heading">Sign In</div>
//             <form className="form" onSubmit={handleLogin}>
//                 <input
//                     required
//                     className="input"
//                     type="email"
//                     name="email"
//                     placeholder="E-mail"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     required
//                     className="input"
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                 <span className="forgot-password"><a href="#">Forgot Password?</a></span>
//                 <input className="login-button" type="submit" value="Sign In" />
//             </form>
//             <div className="social-account-container">
//                 <span className="title">Or Sign in with</span>
//                 <div className="social-accounts">
//                     <button className="social-button google">
//                         {/* Google SVG Icon */}
//                         <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
//                             <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
//                         </svg>
//                     </button>
//                     <button className="social-button apple">
//                         {/* Apple SVG Icon */}
//                         <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
//                             <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
//                         </svg>
//                     </button>
//                     <button className="social-button twitter">
//                         {/* Twitter SVG Icon */}
//                         <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
//                             <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
//                         </svg>
//                     </button>
//                 </div>
//             </div>
//             <p>
//                 Don't have an account? <Link to="/register">Register here</Link>
//             </p>
//         </div>
//     );
// }

// export default Login;

// // http://192.168.77.227:8080/jwtcheck

/*<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.3.0</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.lokesh</groupId>
	<artifactId>ecom-proj</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>ecom-proj</name>
	<description>AgorConnect</description>
	<url/>
	<licenses>
		<license/>
	</licenses>
	<developers>
		<developer/>
	</developers>
	<scm>
		<connection/>
		<developerConnection/>
		<tag/>
		<url/>
	</scm>
	<properties>
		<java.version>21</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency> 
		<dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.5</version>
        </dependency>
		<dependency>
    <groupId>jakarta.validation</groupId>
    <artifactId>jakarta.validation-api</artifactId>
    <version>3.0.0</version> <!-- You can use the latest version -->
</dependency>
<dependency>
			<groupId>
				org.springframework.boot
			</groupId>
			<artifactId>
				spring-boot-starter-webflux
			</artifactId>
		</dependency>
		<!-- Reactor Core and Netty (managed by Spring Boot) -->
		<dependency>
			<groupId>
				io.projectreactor
			</groupId>
			<artifactId>
				reactor-core
			</artifactId>
		</dependency>
		<dependency>
			<groupId>
				io.projectreactor.netty
			</groupId>
			<artifactId>
				reactor-netty-http
			</artifactId>
		</dependency>

	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
				</configuration>
			</plugin>
		</plugins>
	</build>

</project>
*/
