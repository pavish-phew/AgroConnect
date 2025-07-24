// /jwtcheck
import React, { useEffect, useState } from "react";
// import axios from "axios";
import axios from "../axiosProduct";
import { useNavigate } from "react-router-dom";
import logoImage from '../assets/image2.png';
const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const navigate = useNavigate(); 
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("jwt"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/products");
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleClick = () => {
    const token = localStorage.getItem('jwt');
    if(token==null)
    {
      navigate('/login')
    }
    else{
      console.log("Helrreee"+token);
      navigate('/wishlist')
    }
    // onChange();
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("currentuser");
    setToken(null); 
  };

  const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        onSelectCategory(category);
      };
  const categories = [
    "Seed",
    "Equipment",
    "Tools",
    "Machinary",
    "Herbicide",
    "Pesticides",
  ];

  return(
    <header>
  <nav className="navbar navbar-expand-lg fixed-top">
    <div className="container-fluid">
      <a className="navbar-brand" style={{ fontFamily: "Times New Roman" }} href="/">
        <img
          src={logoImage}
          alt="Agro Logo"
          style={{
            width: '30px',
            height: '25px',
            marginRight: '15px',
          }}
        />
        AgroConnect
      </a>
      <div className="d-flex align-items-center" style={{width:'30%', paddingLeft:'0px'}}>
        <input
        // style={{backgroundColor:'lightgray',text:'red'}}
        style={{borderColor:'black'}}
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {showSearchResults && (
          <ul className="list-group">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <li key={result.id} className="list-group-item">
                  <a href={`/product/${result.id}`} className="search-result-link">
                  <button
  style={{
    left: '0%',
    border: 'none',
    width: '100%',
    textAlign: 'left', 
    padding: '7px'
  }}
>
                    <span>{result.name}</span>
                  </button>
                  </a>
                </li>
              ))
            ) : (
              noResults && <p className="no-results-message">No Product with such Name</p>
            )}
          </ul>
        )}
      </div>
      <div style={{width:'13%'}}>
      <div
      onClick={handleClick}
      style={{
        width: '40px',
        height: '40px',
        // backgroundColor: 'green',
        clipPath: 'polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span style={{ color: 'white', fontSize: '18px' }}>💚</span>
    </div>
      </div>
      <div className="d-block d-sm-none">
      <button
  style={{ paddingLeft: '0px', background: 'transparent', border: 'none',width:'5%' }}
  // className="navbar-toggler"
  type="button"
  data-bs-toggle="collapse"
  data-bs-target="#navbarSupportedContent"
  aria-controls="navbarSupportedContent"
  aria-expanded="false"
  aria-label="Toggle navigation"
>
  <span style={{
      display: 'block',
      width: '6px',
      height: '6px',
      borderRadius: '250%',
      backgroundColor: 'lightgrey',
      margin: '2px auto' 
  }}></span>
  <span style={{
      display: 'block',
      width: '6px',
      height: '6px',
      borderRadius: '200%',
      backgroundColor: 'lightgrey',
      margin: '2px auto'
  }}></span>
  <span style={{
      display: 'block',
      width: '6px',
      height: '6px',
      borderRadius: '200%',
      backgroundColor: 'lightgrey',
      margin: '2px auto'
  }}></span>
</button>
</div>

      {/* <button
      style={{paddingLeft:'5px'}}
        // className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" style={{ backgroundColor: 'lightgrey',}}></span>
      </button> */}

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/">
              Home
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="/"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Categories
            </a>
            <ul className="dropdown-menu">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className="dropdown-item"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          {/* Conditionally render Login/Register or Logout based on token */}
          {!token ? (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/login">Login</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/register">Register</a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/add_product">Add Product</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={handleLogout} href="/">Logout</a>
              </li>
            </>
          )}
        </ul>

      {/* Move search bar here to make it always visible */}
      <div className="d-flex align-items-center">
        {/* <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        /> */}
        {showSearchResults && (
          <ul className="list-group">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <li key={result.id} className="list-group-item">
                  <a href={`/product/${result.id}`} className="search-result-link">
                  <button
                  style={{
                    left: '0%',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left', 
                    padding: '7px', 
                  }}
                >
                    <span>{result.name}</span>
                </button>
                  </a>
                </li>
              ))
            ) : (
              noResults && <p className="no-results-message">No Product with such Name</p>
            )}
          </ul>
        )}
      </div>
        <div className="d-flex align-items-center">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "dark-theme" ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
          </button>

          <a href="/cart" className="nav-link text-dark">
            <i className="bi bi-cart me-2" style={{ fontSize: "1.7rem", padding: 10 }}>Cart</i>
          </a>
        </div>
      </div>


    </div>
  </nav>
</header>


  );
  // return (
  //   <header>
  //     <nav className="navbar navbar-expand-lg fixed-top">
  //       <div className="container-fluid">
  //           <a className="navbar-brand" style={{ fontFamily:"Times New Roman"}}href="">
  //       <img
  //         src={logoImage} // Use the imported image here
  //         alt="Agro Logo"
  //         style={{
  //           width: '30px', // Set your desired width
  //           height: '25px', // Set your desired height
  //           marginRight: '15px', // Optional: spacing between image and text
  //         }}
  //       />
  //       AgroConnect
  //     </a>
  //         {/* <img></img>
  //         <a className="navbar-brand" href="">
  //           AgroConnect
  //         </a> */}
  //         <button
  //           className="navbar-toggler"
  //           type="button"
  //           data-bs-toggle="collapse"
  //           data-bs-target="#navbarSupportedContent"
  //           aria-controls="navbarSupportedContent"
  //           aria-expanded="false"
  //           aria-label="Toggle navigation"
  //         >
  //           <span className="navbar-toggler-icon" style={{ backgroundColor: 'lightgrey' }} ></span>
  //         </button>
  //         <div className="collapse navbar-collapse" id="navbarSupportedContent">
  //           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
  //             <li className="nav-item">
  //               <a className="nav-link active" aria-current="page" href="/">
  //                 Home
  //               </a>
  //             </li>
  //             {/* <li className="nav-item">
  //               <a className="nav-link" href="/add_product">
  //                 Add Product
  //               </a>
  //             </li> */}
  //             <li className="nav-item dropdown">
  //               <a
  //                 className="nav-link dropdown-toggle"
  //                 href="/"
  //                 role="button"
  //                 data-bs-toggle="dropdown"
  //                 aria-expanded="false"
  //               >
  //                 Categories
  //               </a>
  //               <ul className="dropdown-menu">
  //                 {categories.map((category) => (
  //                   <li key={category}>
  //                     <button
  //                       className="dropdown-item"
  //                       onClick={() => handleCategorySelect(category)}
  //                     >
  //                       {category}
  //                     </button>
  //                   </li>
  //                 ))}
  //               </ul>
  //             </li>

  //             {/* Conditionally render Login/Register or Logout based on token */}
  //             {!token ? (
  //               <>
  //                 <li className="nav-item">
  //                   <a className="nav-link" href="/login">
  //                     Login
  //                   </a>
  //                 </li>
  //                 <li className="nav-item">
  //                   <a className="nav-link" href="/register">
  //                     Register
  //                   </a>
  //                 </li>
  //               </>
  //             ) : (
  //               <>
  //               <li className="nav-item">
  //               <a className="nav-link" href="/add_product">
  //                 Add Product
  //               </a>
  //             </li>
  //                 <li className="nav-item">
  //                   <a className="nav-link" href="/profile">
  //                     Profile
  //                   </a>
  //                 </li>
  //                 <li className="nav-item">
  //                   <a className="nav-link" onClick={handleLogout} href="/">
  //                     Logout
  //                   </a>
  //                 </li>
  //               </>
  //             )}
  //           </ul>
  //           <button className="theme-btn" onClick={toggleTheme}>
  //             {theme === "dark-theme" ? (
  //               <i className="bi bi-moon-fill"></i>
  //             ) : (
  //               <i className="bi bi-sun-fill"></i>
  //             )}
  //           </button>
  //           <div className="d-flex align-items-center cart">
  //             <a href="/cart" className="nav-link text-dark">
  //               <i
  //                 className="bi bi-cart me-2"
  //                 style={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   fontSize: "1.7rem",
  //                   padding: 10,
  //                 }}
  //               >
  //                 Cart
  //               </i>
  //             </a>

  //             <input
  //               className="form-control me-2"
  //               type="search"
  //               placeholder="Search"
  //               aria-label="Search"
  //               value={input}
  //               onChange={(e) => handleChange(e.target.value)}
  //               onFocus={() => setSearchFocused(true)}
  //               onBlur={() => setSearchFocused(false)}
  //             />
  //             {showSearchResults && (
  //               <ul className="list-group">
  //                 {searchResults.length > 0 ? (
  //                   searchResults.map((result) => (
  //                     <li key={result.id} className="list-group-item">
  //                       <a href={`/product/${result.id}`} className="search-result-link">
  //                         <span>{result.name}</span>
  //                       </a>
  //                     </li>
  //                   ))
  //                 ) : (
  //                   noResults && (
  //                     <p className="no-results-message">
  //                       No Product with such Name
  //                     </p>
  //                   )
  //                 )}
  //               </ul>
  //             )}
  //             <div />
  //           </div>
  //         </div>
  //       </div>
  //     </nav>
  //   </header>
  // );
};

export default Navbar;
