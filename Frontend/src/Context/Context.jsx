import axioss from "../axios";
import { useState, useEffect, createContext } from "react"; 
// import { useNavigate } from 'react-router-dom'; 
import axios from "axios";
const AppContext = createContext({
  // username: "",
  // setUsername: (name) => {},
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  clearCart: () => {},
  userId: null,
  setUserId: (id) => {},
  logout: () => {},
});

export const AppProvider = ({ children }) => {
  // const navigate = useNavigate(); 
  const [username, setUsername] = useState(null);
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('currentuser');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // const fetchUsername = async () => {
  //  var  Id = localStorage.getItem("currentuser")
  //   const token = localStorage.getItem('jwt'); // Assuming token is stored in localStorage
  //   try {
  //     const response = await fetch(`http://localhost:8080/getusername/${Id}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`, // Include the token if needed
  //         'Content-Type': 'application/json',
  //       },
  //     });
  
  //     if (response.ok) {
  //       const data = await response.text();
  //       console.log(data);
  //     } else {
  //       console.error('Error fetching username:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching username:', error);
  //   }
  // };
  
  // const fetchUsername = async (userId) => {
  //   try {
  //     const token = localStorage.getItem('jwt');
  //     if (!token) {
  //       // navigate('/login');
  //       return;
  //     }
  //     const response = await axios.get(`http://localhost:8080/getusername/${userId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setUsername(response.data.username);
  //   } catch (error) {
  //     console.error("Error fetching username", error);
  //   }
  // };

  const addToCart = async (product) => {
    if (!userId) {
      console.error("User ID is null, cannot add to cart.");
      return false;
    }
    const cartItem = { productId: product.id, quantity: 1 };

    try {
      const token = localStorage.getItem('jwt');
      if (token) {
        const response = await axios.put(`http://172.16.2.211:8080/users/${userId}/cart`, cartItem, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status >= 200 && response.status < 300) {
          setCart(response.data.cart);
          return true;
        } else {
          console.error("Unexpected response:", response);
          return false;
        }
      }
    } catch (error) {
      console.error("Error adding to cart", error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!userId) {
      console.error("User ID is null, cannot remove from cart.");
      return;
    }
    try {
      const response = await axioss.delete(`/users/${userId}/cart/${productId}`);
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axioss.get("/products");
      setData(response.data);
      setUsername(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentuser');
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (userId && token) {
      const fetchCart = async (userId) => {
        try {
          const response = await axios.get(`http://172.16.2.211:8080/users/${userId}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(response.data.cart);
        } catch (error) {
          console.error("Error fetching cart", error);
        }
      };
      fetchCart(userId);
    }
  }, [userId]);

  return (
    <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart, refreshData, clearCart, userId, setUserId, logout, username, setUsername }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;















// import axios from "../axios";
// import { useState, useEffect, createContext } from "react"; 
// import { useNavigate } from 'react-router-dom'; 
// const AppContext = createContext({
//   username: null,
//   setUsername: (name) => {},
//   data: [],
//   isError: "",
//   cart: [],
//   addToCart: (product) => {},
//   removeFromCart: (productId) => {},
//   refreshData: () => {},
//   clearCart: () => {},
//   userId: null,
//   setUserId: (id) => {},
//   logout: () => {},
// });

// export const AppProvider = ({ children }) => {

//   const navigate = useNavigate();
//   const [username, setUsername] = useState(null);
//   const [data, setData] = useState([]);
//   const [isError, setIsError] = useState("");
//   const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
//   const [userId, setUserId] = useState(null);

//   // Set userId from localStorage on initial render
//   useEffect(() => {
//     const storedUserId = localStorage.getItem('currentuser');
//     if (storedUserId) {
//       setUserId(storedUserId); // Set the userId from localStorage if it exists
//       fetchUsername(storedUserId);
//     }
//   }, []);

//   const fetchUsername = async (userId) => {
//     try {
//       const token = localStorage.getItem('jwt');
//       console.log(token)
//       if(!token)
//       {
//         navigate('/login');
//         return;
//       }
//       const response = await axios.get(`http://localhost:8080/getusername/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsername(response.data.username); // Adjust based on your API response
//     } catch (error) {
//       console.error("Error fetching username", error);
//     }
//   };
//   const addToCart = async (product) => {
//     if (!userId) {
//         console.error("User ID is null, cannot add to cart.");
//         return false; // Indicate failure due to missing user ID
//     }

//     const cartItem = { productId: product.id, quantity: 1 };

//     try {
//         const token = localStorage.getItem('jwt');
//         if (token) {
//             const response = await axios.put(`http://localhost:8080/users/${userId}/cart`, cartItem, {
//                 headers: { Authorization: "Bearer " + token }
//             });

//             // Check if the response status is in the success range
//             if (response.status >= 200 && response.status < 300) {
//                 setCart(response.data.cart); // Update the frontend cart
//                 return true; // Indicate success
//             } else {
//                 console.error("Unexpected response:", response);
//                 return false; // Indicate failure
//             }
//         }
//     } catch (error) {
//         console.error("Error adding to cart", error.response ? error.response.data : error);
//         return false; // Indicate failure
//     }
// };





//   const removeFromCart = async (productId) => {
//     if (!userId) {
//       console.error("User ID is null, cannot remove from cart.");
//       return; // Early return if userId is null
//     }

//     try {
//       const response = await axios.delete(`/users/${userId}/cart/${productId}`);
//       setCart(response.data.cart); // Update the frontend cart
//     } catch (error) {
//       console.error("Error removing from cart", error);
//     }
//   };

//   const refreshData = async () => {
//     try {
//       const response = await axios.get("/products");
//       setData(response.data);
//     } catch (error) {
//       setIsError(error.message);
//     }
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const logout = () => {
//     setUserId(null);
//     localStorage.removeItem('jwt');
//     localStorage.removeItem('currentuser'); // Clear userId on logout
//   };

//   useEffect(() => {
//     refreshData();
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('jwt');
//       // console.log(token)
//     if (userId&&token) {
//       const fetchCart = async (userId) => {
//         try {
//             const token = localStorage.getItem("jwt"); // Assuming token is stored in local storage
//             console.log(token+" "+userId)
//             const response = await axios.get(`http://localhost:8080/users/${userId}/cart`, {
//                 headers: {
//                     Authorization: "Bearer "+token // Include JWT token in Authorization header
//                 }
//             });
//             // Handle response
//         } catch (error) {
//             console.error("Error fetching cart", error);
//         }
//     };
    
//       var id = localStorage.getItem("currentuser")
//       fetchCart(id);
//     }
//   }, [userId]);

//   return (
//     <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart, refreshData, clearCart, userId, setUserId, logout, username, setUsername, }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export default AppContext;
