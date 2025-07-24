// // http://192.168.77.227:8080/jwtcheck
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axiosProduct";
import GooglePayButton from "@google-pay/button-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReviewComponent from "./ReviewComponent";
import "./Product.css";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, } from 'react-share';
import InstagramIcon from "../assets/unplugged.png";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData, userId } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(`/api/product/${id}/image`, { responseType: "blob" });
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const incrementViewCount = async () => {
    const curUserId = localStorage.getItem("currentuser");

    if (!product || curUserId === product.userId) return;

    try {
      const token = localStorage.getItem('jwt');
      if (token) {
        await axios.post(`/api/products/${id}/view`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  useEffect(() => {
    if (product) {
      incrementViewCount();
    }
  }, [product]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`/api/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = async (productId, product) => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/login');
      return alert("User not logged in");
    }

    // try {
    //   const productResponse = await axios.get(`/users/quantity/${productId}/cart`);
    //   const availableQuantity = productResponse.data;

    //   const userCartResponse = await axios.get(`/users/currentquantity/${userId}/${productId}/cart`, {
    //     headers: { Authorization: `Bearer ${token}` }
    //   });
    //   const cartQuantity = userCartResponse.data;

    //   if (cartQuantity >= availableQuantity) {
    //     return alert("Out of stock");
    //   }

    //   const success = await addToCart(product);
    //   if (success) {
    //     alert("Product added to cart");
    //   } else {
    //     alert("Failed to add product to cart. Please try again.");
    //   }
    // }
    try {
      const response = await fetch('http://172.16.2.211:8080/jwtcheck', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        console.error("Invalid token, redirecting to login.");
        navigate('/login');
        return;
      }
      const res = await addToCart(product);
      if (res) {
        alert("Product added to cart!");
      } else {
        alert("Out of Stock!");
      }
    } 
    catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add product to cart. Please try again.";
      alert(errorMessage);
      console.error("Error adding to cart", error);
    }
  };

  if (loading) {
    return <h2 className="text-center my-5">Loading...</h2>;
  }

  if (!product) {
    return <h2 className="text-center my-5">Product not found.</h2>;
  }
  const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`;
  const curid = localStorage.getItem("currentuser");
  const shareUrl = window.location.href; 
  const title = product.name;
  return (
    <div className="row align-items-start">
  <div className="col-md-4 d-flex justify-content-center" style={{ minHeight: '300px' }}>
    <img 
      className="img-fluid" 
      src={imageUrl} 
      alt={product.imageName} 
      style={{ objectFit: 'cover', width: '100%' }} 
    />
  </div>
  {/* ///////////////////// */}
  <div className="col-md-5">
  {/* Product Details Section */}
  <div className="product-description">
    <h1 className="h3 text-capitalize" style={{ color: "red" }}>{product.name}</h1>
    <span className="text-muted">{product.category}</span>
    <p className="release-date">
      <small>Listed: <i>{new Date(product.releaseDate).toLocaleDateString()}</i></small>
    </p>
    <i className="text-muted">{product.brand}</i>
    <p className="font-weight-bold mt-2">PRODUCT DESCRIPTION:</p>
    <p>{product.description}</p>
  </div>
  <div className="product-price mt-3">
    <span className="h4">₹{product.price}</span>
    <div className="share-buttons">
      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={shareUrl} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <a href={instagramShareUrl} target="_blank" rel="noopener noreferrer">
        <img src={InstagramIcon} alt="Share on Instagram" style={{ width: 32, height: 32, borderRadius: '50%' }} />
      </a>
    </div>

    <h6 className="mt-2">
      Stock Available: <span className="text-success font-weight-bold">{product.stockQuantity}</span>
    </h6>
    <GooglePayButton
  environment="PRODUCTION"
  paymentRequest={{
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'stripe', // e.g., 'stripe'
            gatewayMerchantId: 'yourActualGatewayMerchantId',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: 'yourActualGooglePayMerchantId',
      merchantName: 'Your Actual Merchant Name',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: '1.00', // Replace with actual price
      currencyCode: 'INR', // Replace with actual currency code
      countryCode: 'IN', // Replace with actual country code
    },
  }}
  onLoadPaymentData={paymentRequest => {
    console.log('load payment data', paymentRequest);
  }}
/>

    {/* <GooglePayButton
        environment="PRODUCTION"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '12345678901234567890',
            merchantName: 'Demo Merchant',
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: '10.00',
            currencyCode: 'INR',
            countryCode: 'IN',
          },
          shippingAddressRequired: true,
          callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
        }}
        onLoadPaymentData={paymentRequest => {
          console.log('Success', paymentRequest);
        }}
        onPaymentAuthorized={paymentData => {
          console.log('Payment Authorised Success', paymentData);
          return { transactionState: 'SUCCESS' };
        }}
        existingPaymentMethodRequired='false'
        buttonColor='black'
        buttonType='Buy'
      /> */}
    <div className="text-center mt-3"> 
      {product.userId !== curid && (
        <button
          className={`btn btn-primary ${!product.productAvailable ? "disabled" : ""}`}
          onClick={() => handleAddToCart(product.id, product)}
          disabled={!product.productAvailable}
          style={{
            width: '100%',
            fontWeight: 'bold',
            color: "white",
            padding: '15px',
            borderRadius: '20px',
            border: 'none',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          {product.productAvailable ? "Add to cart" : "Out of Stock"}
        </button>
      )}
      {product.userId === curid && (
        <div className="mt-2 d-flex justify-content-center">
          <button className="btn btn-warning me-2" style={{ backgroundColor: 'orange' }} onClick={handleEditClick}>Update</button>
          <button className="btn btn-danger" style={{ backgroundColor: 'red' }} onClick={deleteProduct}>Delete</button>
        </div>
      )}
    </div>
  </div>
</div>
      
      <div className="col-md-3">
    {/* Review Component */}
    <ReviewComponent productId={product.id} productOwnerId={product.userId}/>
      </div>
   </div>

  );
};

export default Product;

// import { useNavigate, useParams } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import AppContext from "../Context/Context";
// // import axios from "../axios";
// import axios from "../axiosProduct";
// import GooglePayButton from "@google-pay/button-react";

// const Product = () => {
//   const { id } = useParams();
//   const { addToCart, removeFromCart, refreshData, userId } = useContext(AppContext);
//   const [product, setProduct] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`/api/product/${id}`);
//         setProduct(response.data);
//         if (response.data.imageName) {
//           fetchImage();
//         }
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchImage = async () => {
//       const response = await axios.get(`/api/product/${id}/image`, { responseType: "blob" });
//       setImageUrl(URL.createObjectURL(response.data));
//     };

//     fetchProduct();
//   }, [id]);

//   const incrementViewCount = async () => {
//     const curUserId = localStorage.getItem("currentuser");

//     if (!product) return;

//     // Check if the current user is the owner of the product
//     console.log(curUserId)
//     console.log(product.userId)
//     if (curUserId === product.userId) {
//       return; // Don't increment the view count if the user is the owner
//     }

//     try {
//       const token = localStorage.getItem('jwt');
//       if (!token)
//         {
//           // navigate('/login')
//           // return alert("User not logged in");
//         } else
//       await axios.post(`/api/products/${id}/view`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (error) {
//       console.error("Error incrementing view count:", error);
//     }
//   };

//   useEffect(() => {
//     if (product) {
//       incrementViewCount();
//     }
//   }, [product]);

//   const deleteProduct = async () => {
//     try {
//       await axios.delete(`/api/product/${id}`);
//       removeFromCart(id);
//       alert("Product deleted successfully");
//       refreshData();
//       navigate("/");
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   const handleEditClick = () => {
//     navigate(`/product/update/${id}`);
//   };

//   const handleAddToCart = async (productId, product) => {
//     const token = localStorage.getItem('jwt');
//     if (!token)
//       {
//         navigate('/login')
//         return alert("User not logged in");
//       } 

//     try {
//       const productResponse = await axios.get(`/users/quantity/${productId}/cart`);
//       const availableQuantity = productResponse.data;

//       const userCartResponse = await axios.get(`/users/currentquantity/${userId}/${productId}/cart`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const cartQuantity = userCartResponse.data;

//       if (cartQuantity >= availableQuantity) {
//         return alert("Out of stock");
//       }

//       const success = await addToCart(product);
//       if (success) {
//         alert("Product added to cart");
//       } else {
//         alert("Failed to add product to cart. Please try again. Out of stock!");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Failed to add product to cart. Please try again.";
//       alert(errorMessage);
//       console.error("Error adding to cart", error);
//     }
//   };

//   if (loading) {
//     return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
//   }

//   if (!product) {
//     return <h2 className="text-center" style={{ padding: "10rem" }}>Product not found.</h2>;
//   }

//   const curid = localStorage.getItem("currentuser");

//   return (
//     <>
//       <div className="containers" style={{ display: "flex" }}>
//         <img className="left-column-img" src={imageUrl} alt={product.imageName} style={{ width: "50%", height: "auto" }} />

//         <div className="right-column" style={{ width: "50%" }}>
//           <div className="product-description">
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>{product.category}</span>
//               <p className="release-date" style={{ marginBottom: "2rem" }}>
//                 <h6>Listed: <span><i>{new Date(product.releaseDate).toLocaleDateString()}</i></span></h6>
//               </p>
//             </div>

//             <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px' }}>{product.name}</h1>
//             <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
//             <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>PRODUCT DESCRIPTION:</p>
//             <p style={{ marginBottom: "1rem" }}>{product.description}</p>
//           </div>

//           <div className="product-price">
//             <span style={{ fontSize: "2rem", fontWeight: "bold" }}>₹{product.price}</span>
//             {product.userId !== curid && ( // Show the button only if the user is not the owner
//     <button
//       className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
//       onClick={() => handleAddToCart(product.id, product)}  
//       disabled={!product.productAvailable}
//       style={{
//         padding: "1rem 2rem",
//         fontSize: "1rem",
//         backgroundColor: "#007bff",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//         marginBottom: "1rem",
//       }}
//     >
//       {product.productAvailable ? "Add to cart" : "Out of Stock"}
//     </button>
//   )}

//             {/* <button
//               className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
//               onClick={() => handleAddToCart(product.id, product)}  
//               disabled={!product.productAvailable}
//               style={{
//                 padding: "1rem 2rem",
//                 fontSize: "1rem",
//                 backgroundColor: "#007bff",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 marginBottom: "1rem",
//               }}
//             >
//               if (curUserId === product.userId){product.productAvailable ? "Add to cart" : "Out of Stock"}
//             </button> */}

//             <h6 style={{ marginBottom: "1rem" }}>
//               Stock Available: <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
//             </h6>

//             {/* Google Pay Purchase Button */}
//             {product.productAvailable && (
//               <div>
//                 <hr />
//                 <GooglePayButton
//                   environment="TEST"
//                   paymentRequest={{
//                     apiVersion: 2,
//                     apiVersionMinor: 0,
//                     allowedPaymentMethods: [
//                       {
//                         type: 'CARD',
//                         parameters: {
//                           allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
//                           allowedCardNetworks: ['MASTERCARD', 'VISA'],
//                         },
//                         tokenizationSpecification: {
//                           type: 'PAYMENT_GATEWAY',
//                           parameters: {
//                             gateway: 'example',
//                             gatewayMerchantId: 'exampleGatewayMerchantId',
//                           },
//                         },
//                       },
//                     ],
//                     merchantInfo: {
//                       merchantId: '12345678901234567890',
//                       merchantName: 'Demo Merchant',
//                     },
//                     transactionInfo: {
//                       totalPriceStatus: 'FINAL',
//                       totalPriceLabel: 'Total',
//                       totalPrice: '100',
//                       currencyCode: 'USD',
//                       countryCode: 'US',
//                     },
//                     shippingAddressRequired: true,
//                     callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
//                   }}
//                   onLoadPaymentData={paymentRequest => {
//                     console.log('Success', paymentRequest);
//                   }}
//                   onPaymentAuthorized={paymentData => {
//                     console.log('Payment Authorised Success', paymentData);
//                     return { transactionState: 'SUCCESS' };
//                   }}
//                   onPaymentDataChanged={paymentData => {
//                     console.log('On Payment Data Changed', paymentData);
//                     return {};
//                   }}
//                   existingPaymentMethodRequired='false'
//                   buttonColor='black'
//                   buttonType='Buy'
//                 />
//               </div>
//             )}

//           </div>

//           {/* Conditionally render Edit and Delete buttons */}
//           {product.userId === curid && ( 
//             <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
//               <button
//                 className="btn btn-primary"
//                 type="button"
//                 onClick={handleEditClick}
//                 style={{
//                   padding: "1rem 2rem",
//                   fontSize: "1rem",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Update
//               </button>
//               <button
//                 className="btn btn-danger"
//                 type="button"
//                 onClick={deleteProduct}
//                 style={{
//                   padding: "1rem 2rem",
//                   fontSize: "1rem",
//                   backgroundColor: "#dc3545",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Product;

// import { useNavigate, useParams } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import AppContext from "../Context/Context";
// import axios from "../axios";
// import GooglePayButton from "@google-pay/button-react";

// const Product = () => {
//   const { id } = useParams();
//   const { data, addToCart, removeFromCart, cart, refreshData, islogged, userId  } = useContext(AppContext);
//   const [product, setProduct] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`/api/product/${id}`);
//         setProduct(response.data);
//         if (response.data.imageName) {
//           fetchImage();
//         }
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };

//     const fetchImage = async () => {
//       const response = await axios.get(`http://localhost:8080/api/product/${id}/image`, { responseType: "blob" });
//       setImageUrl(URL.createObjectURL(response.data));
//     };

//     fetchProduct();
//   }, [id]);

//   const curid = localStorage.getItem("currentuser");
//   if (!curid) {
//     console.log("User Id Not found ");
//   }

//   const deleteProduct = async () => {
//     try {
//       await axios.delete(`http://localhost:8080/api/product/${id}`);
//       removeFromCart(id);
//       alert("Product deleted successfully");
//       refreshData();
//       navigate("/");
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   const handleEditClick = () => {
//     navigate(`/product/update/${id}`);
//   };

//   const handleAddToCart = async (productId, product) => {
//     const token = localStorage.getItem('jwt');
//     if (!token) return alert("User not logged in");

//     try {
//       const productResponse = await axios.get(`http://localhost:8080/users/quantity/${productId}/cart`);
//       const availableQuantity = productResponse.data;

//       const userCartResponse = await axios.get(`http://localhost:8080/users/currentquantity/${userId}/${productId}/cart`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const cartQuantity = userCartResponse.data;

//       if (cartQuantity >= availableQuantity) {
//         return alert("Out of stock");
//       }

//       const success = await addToCart(product);
//       if (success) {
//         alert("Product added to cart");
//       } else {
//         alert("Failed to add product to cart. Please try again. Out of stock!");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Failed to add product to cart. Please try again.";
//       alert(errorMessage);
//       console.error("Error adding to cart", error);
//     }
//   };

//   // // Function to handle Google Pay payment
//   // const handleGooglePay = async (upiId) => {
//   //   const amount = product.price; // Set the amount dynamically
//   //   const transactionId = `txn_${new Date().getTime()}`; // Generate a unique transaction ID
//   //   const name = "Store"; // You can replace this with your store name
  
//   //   // UPI payment link for QR code and deep link
//   //   const upiPaymentLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=&tid=${transactionId}&am=${amount}&tn=Payment for ${product.name}`;
  
//   //   // Detect mobile devices
//   //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
//   //   if (isMobile) {
//   //     // Redirect to Google Pay using deep link on mobile
//   //     window.open(`gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=&tid=${transactionId}&am=${amount}&tn=Payment for ${product.name}`, '_blank');
//   //   } else {
//   //     // On desktop, generate a QR code and display it
//   //     const qrCanvas = document.getElementById('qrCodeCanvas'); // Ensure this is a canvas element
  
//   //     // Generate the QR code for UPI payment
//   //     try {
//   //       await QRCode.toCanvas(qrCanvas, upiPaymentLink, { width: 256 });
//   //       alert("Scan the QR code with your UPI app to complete the payment.");
//   //     } catch (err) {
//   //       console.error('QR Code generation failed: ', err);
//   //     }
//   //   }
//   // };
  

//   if (!product) {
//     return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
//   }

//   return (
//     <>
//       <div className="containers" style={{ display: "flex" }}>
//         <img className="left-column-img" src={imageUrl} alt={product.imageName} style={{ width: "50%", height: "auto" }} />
        
//         <div className="right-column" style={{ width: "50%" }}>
//           <div className="product-description">
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>{product.category}</span>
//               <p className="release-date" style={{ marginBottom: "2rem" }}>
//                 <h6>Listed: <span><i>{new Date(product.releaseDate).toLocaleDateString()}</i></span></h6>
//               </p>
//             </div>

//             <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px' }}>{product.name}</h1>
//             <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
//             <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>PRODUCT DESCRIPTION:</p>
//             <p style={{ marginBottom: "1rem" }}>{product.description}</p>
//           </div>

//           <div className="product-price">
//             <span style={{ fontSize: "2rem", fontWeight: "bold" }}>₹{product.price}</span>
//             <button
//               className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
//               onClick={() => handleAddToCart(product.id, product)}  
//               disabled={!product.productAvailable}
//               style={{
//                 padding: "1rem 2rem",
//                 fontSize: "1rem",
//                 backgroundColor: "#007bff",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 marginBottom: "1rem",
//               }}
//             >
//               {product.productAvailable ? "Add to cart" : "Out of Stock"}
//             </button>

//             <h6 style={{ marginBottom: "1rem" }}>
//               Stock Available: <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
//             </h6>

//             {/* Google Pay Purchase Button */}
// {product.productAvailable && (
//   <div>
//     Helo
//     {/* <h1><img src={logo} className="App-logo" alt="logo" /> Google Pay React Demo</h1> */}
//       <hr />
//       <GooglePayButton
//         environment="TEST"
//         paymentRequest={{
//           apiVersion: 2,
//           apiVersionMinor: 0,
//           allowedPaymentMethods: [
//             {
//               type: 'CARD',
//               parameters: {
//                 allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
//                 allowedCardNetworks: ['MASTERCARD', 'VISA'],
//               },
//               tokenizationSpecification: {
//                 type: 'PAYMENT_GATEWAY',
//                 parameters: {
//                   gateway: 'example',
//                   gatewayMerchantId: 'exampleGatewayMerchantId',
//                 },
//               },
//             },
//           ],
//           merchantInfo: {
//             merchantId: '12345678901234567890',
//             merchantName: 'Demo Merchant',
//           },
//           transactionInfo: {
//             totalPriceStatus: 'FINAL',
//             totalPriceLabel: 'Total',
//             totalPrice: '0',
//             currencyCode: 'USD',
//             countryCode: 'US',
//           },
//           shippingAddressRequired: true,
//           callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
//         }}
//         onLoadPaymentData={paymentRequest => {
//           console.log('Success', paymentRequest);
//         }}
//         onPaymentAuthorized={paymentData => {
//             console.log('Payment Authorised Success', paymentData)
//             return { transactionState: 'SUCCESS'}
//           }
//         }
//         onPaymentDataChanged={paymentData => {
//             console.log('On Payment Data Changed', paymentData)
//             return { }
//           }
//         }
//         existingPaymentMethodRequired='false'
//         buttonColor='black'
//         buttonType='Buy'
//       />

//     {/* QR Code Container */}
//     <div id="qrCodeContainer" style={{ marginTop: "20px" }}></div>
//   </div>
// )}

//           </div>

//           {/* Conditionally render Edit and Delete buttons */}
//           {product.userId === curid && ( 
//             <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
//               <button
//                 className="btn btn-primary"
//                 type="button"
//                 onClick={handleEditClick}
//                 style={{
//                   padding: "1rem 2rem",
//                   fontSize: "1rem",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Update
//               </button>
//               <button
//                 className="btn btn-danger"
//                 type="button"
//                 onClick={deleteProduct}
//                 style={{
//                   padding: "1rem 2rem",
//                   fontSize: "1rem",
//                   backgroundColor: "#dc3545",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Product;

// // import { useNavigate, useParams } from "react-router-dom";
// // import { useContext, useEffect, useState } from "react";
// // import AppContext from "../Context/Context";
// // import axios from "../axios";

// // const Product = () => {
// //   const { id } = useParams();
// //   const { data, addToCart, removeFromCart, cart, refreshData, islogged, userId  } = useContext(AppContext);
// //   const [product, setProduct] = useState(null);
// //   const [imageUrl, setImageUrl] = useState("");
// //   const navigate = useNavigate();
// //   // const Id = "66f77627abfbd9561c15a4ac";
// //   // console.log("log: "+Id)
// //   useEffect(() => {
// //     const fetchProduct = async () => {
// //       try {
// //         const response = await axios.get(`http://localhost:8080/api/product/${id}`);
// //         setProduct(response.data);
// //         if (response.data.imageName) {
// //           fetchImage();
// //         }
// //       } catch (error) {
// //         console.error("Error fetching product:", error);
// //       }
// //     };

// //     const fetchImage = async () => {
// //       const response = await axios.get(`http://localhost:8080/api/product/${id}/image`, { responseType: "blob" });
// //       setImageUrl(URL.createObjectURL(response.data));
// //     };
    
// //     fetchProduct();
// //   }, [id]);
// //   const curid = localStorage.getItem("currentuser")
// //   if(!curid)
// //   {
// //     console.log("User Id Not found ")
// //   }
// //   const deleteProduct = async () => {
// //     try {
// //       await axios.delete(`http://localhost:8080/api/product/${id}`);
// //       removeFromCart(id);
// //       alert("Product deleted successfully");
// //       refreshData();
// //       navigate("/");
// //     } catch (error) {
// //       console.error("Error deleting product:", error);
// //     }
// //   };

// //   const handleEditClick = () => {
// //     navigate(`/product/update/${id}`);
// //   };

// //   const handleAddToCart = async (productId, product) => {
// //     const token = localStorage.getItem('jwt');
// //     if (!token) return alert("User not logged in");

// //     try {
// //         const productResponse = await axios.get(`http://localhost:8080/users/quantity/${productId}/cart`);
// //         const availableQuantity = productResponse.data;

// //         const userCartResponse = await axios.get(`http://localhost:8080/users/currentquantity/${userId}/${productId}/cart`, {
// //             headers: { Authorization: `Bearer ${token}` }
// //         });
// //         const cartQuantity = userCartResponse.data;

// //         if (cartQuantity >= availableQuantity) {
// //             return alert("Out of stock");
// //         }

// //         const success = await addToCart(product);
// //         if (success) {
// //             alert("Product added to cart");
// //         } else {
// //             alert("Failed to add product to cart. Please try again. out of stock!");
// //         }
// //     } catch (error) {
// //         const errorMessage = error.response?.data?.message || "Failed to add product to cart. Please try again.";
// //         alert(errorMessage);
// //         console.error("Error adding to cart", error);
// //     }
// // };

// //   if (!product) {
// //     return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
// //   }

// //   return (
// //     <>
// //       <div className="containers" style={{ display: "flex" }}>
// //         <img className="left-column-img" src={imageUrl} alt={product.imageName} style={{ width: "50%", height: "auto" }} />
        
// //         <div className="right-column" style={{ width: "50%" }}>
// //           <div className="product-description">
// //             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
// //               <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>{product.category}</span>
// //               <p className="release-date" style={{ marginBottom: "2rem" }}>
// //                 <h6>Listed: <span><i>{new Date(product.releaseDate).toLocaleDateString()}</i></span></h6>
// //               </p>
// //             </div>

// //             <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px' }}>{product.name}</h1>
// //             <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
// //             <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>PRODUCT DESCRIPTION:</p>
// //             <p style={{ marginBottom: "1rem" }}>{product.description}</p>
// //           </div>

// //           <div className="product-price">
// //             <span style={{ fontSize: "2rem", fontWeight: "bold" }}>${product.price}</span>
// //             <button
// //   className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
// //   onClick={() => handleAddToCart(product.id, product)}  // Wrap it in an arrow function
// //   disabled={!product.productAvailable}
// //   style={{
// //     padding: "1rem 2rem",
// //     fontSize: "1rem",
// //     backgroundColor: "#007bff",
// //     color: "white",
// //     border: "none",
// //     borderRadius: "5px",
// //     cursor: "pointer",
// //     marginBottom: "1rem",
// //   }}
// // >
// //   {product.productAvailable ? "Add to cart" : "Out of Stock"}
// // </button>

// //             <h6 style={{ marginBottom: "1rem" }}>
// //               Stock Available: <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
// //             </h6>
// //           </div>

// //           {/* Conditionally render Edit and Delete buttons */}
// //               {/* console.log("Pro: "+product.userId) */}
// //               {/* {console.log("product id"+product.userId)}
// //               {console.log("user id"+curid)} */}
// //           {product.userId ==  curid&& ( 
// //             <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
// //               <button
// //                 className="btn btn-primary"
// //                 type="button"
// //                 onClick={handleEditClick}
// //                 style={{
// //                   padding: "1rem 2rem",
// //                   fontSize: "1rem",
// //                   backgroundColor: "#007bff",
// //                   color: "white",
// //                   border: "none",
// //                   borderRadius: "5px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 Update
// //               </button>
// //               <button
// //                 className="btn btn-danger"
// //                 type="button"
// //                 onClick={deleteProduct}
// //                 style={{
// //                   padding: "1rem 2rem",
// //                   fontSize: "1rem",
// //                   backgroundColor: "#dc3545",
// //                   color: "white",
// //                   border: "none",
// //                   borderRadius: "5px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //            )} 
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Product;











