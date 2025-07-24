import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosProduct";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userId = localStorage.getItem("currentuser");
        const response = await axios.get(`/users/${userId}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("This is the Response : " + response.data);
        const cartData = response.data;
        const productDetails = cartData.map((cartItem) => {
          const price = parseFloat(cartItem.product.price) || 0;
          return {
            ...cartItem.product,
            quantity: cartItem.quantity,
            price,
            imageUrl: cartItem.product.imageDate,
          };
        });

        setCartItems(productDetails);
      } catch (error) {
        console.error("Error fetching cart or product data:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchCartItems();
  }, [navigate]);
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      return acc + itemPrice * itemQuantity;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const calculateSelectedTotalPrice = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.id))
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleIncreaseQuantity = async (itemId) => {
    setLoading(true);
    const userId = localStorage.getItem("currentuser");

    try {
      const productResponse = await axios.get(`/api/product/${itemId}`);
      const currentProductQuantity = productResponse.data.stockQuantity;
      console.log(currentProductQuantity);
      setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find((item) => item.id === itemId);

        if (itemToUpdate) {
          if (itemToUpdate.quantity < currentProductQuantity) {
            const updatedItems = prevItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );

            updateCartItem(userId, itemId, itemToUpdate.quantity + 1);
            return updatedItems;
          } else {
            alert("Out of Stock!");
            return prevItems;
          }
        }
        return prevItems;
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      alert("Failed to update quantity. Please try again.");
    }
    setLoading(false);
  };

  const handleDecreaseQuantity = (itemId) => {
    setLoading(true);
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(item.quantity - 1, 0);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      const itemToRemove = updatedItems.find(
        (item) => item.id === itemId && item.quantity === 0
      );
      if (itemToRemove) {
        handleRemoveFromCart(itemId);
      }

      const updatedItem = updatedItems.find((item) => item.id === itemId);
      const userId = localStorage.getItem("currentuser");

      if (updatedItem) {
        updateCartItem(userId, itemId, updatedItem.quantity);
      }

      return updatedItems;
    });
    setLoading(false);
  };

  const updateCartItem = async (userId, itemId, newQuantity) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.put(
        `/users/${userId}/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Cart updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    try {
      const token = localStorage.getItem("jwt");
      const userId = localStorage.getItem("currentuser");
      await axios.delete(`/users/${userId}/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error removing item from cart in database:", error);
    }
  };

  const handleshowdescription = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = new Set(prevSelectedItems);
      if (updatedSelectedItems.has(itemId)) {
        updatedSelectedItems.delete(itemId);
      } else {
        updatedSelectedItems.add(itemId);
      }
      return updatedSelectedItems;
    });
  };

  const handleCheckout = async () => {
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );

    // Filter selected products from the cartItems
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.has(item.id)
    );

    if (selectedProducts.length === 0) {
      alert("Please select at least one item to proceed to checkout.");
      return;
    }

    console.log(selectedProducts);

    // Calculate the total price of selected items (this part can be customized)
    const selectedTotalPrice = calculateSelectedTotalPrice();
    console.log("Selected Total Price:", selectedTotalPrice);

    // Prepare the products data to send to the backend
    const products = selectedProducts.map((item) => ({
      id: item.id, // Product ID
      name: item.name, // Product name
      price: item.price, // Product price
      imageName: item.imageName, // Image URL or file name
      stockQuantity: item.stockQuantity, // Quantity of the product being purchased
    }));

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // Make the request to create the checkout session with selected products
      const response = await fetch(
        "http://localhost:8080/create-checkout-session",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ products }), // Send the mapped products array
        }
      );

      if (!response.ok) {
        console.error("Error creating checkout session:", response.statusText);
        return;
      }

      const session = await response.json();
      console.log("This is the session : " + session.id);

      // Redirect to the Stripe Checkout page
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      // Error handling after the redirect attempt
      if (result.error) {
        console.error("Error with Stripe Checkout:", result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  // const handleCheckout = async () => {
  //   const stripe = await loadStripe(
  //     "pk_test_51QVrCPKK1yvsvGYP1GWLOkDVtsWPxDhFiJ3P3NSWICZUac9s5VKQjiDzWHC9lcWIU1EH4Ap6JXkNWHUjTVtYZOy9002Gm7TYqK"
  //   );

  //   const selectedProducts = cartItems.filter((item) =>
  //     selectedItems.has(item.id)
  //   );

  //   if (selectedProducts.length === 0) {
  //     alert("Please select at least one item to proceed to checkout.");
  //     return;
  //   }

  //   console.log(selectedProducts);

  //   const selectedTotalPrice = calculateSelectedTotalPrice();
  //   console.log("Selected Total Price:", selectedTotalPrice);

  //   const headers = {
  //     "Content-Type": "application/json",
  //   };

  //   const products = [
  //     {
  //       id: 1, // Product ID
  //       name: "Product Name", // Product Name
  //       price: 15.0, // Product price
  //       imageName: "image-url-or-path.jpg", // Product image URL or file name
  //       stockQuantity: 2, // Quantity of the product being purchased
  //     },
  //   ];
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8080/create-checkout-session",
  //       {
  //         method: "POST",
  //         headers: headers,
  //         body: JSON.stringify({ products }),
  //       }
  //     );

  //     if (!response.ok) {
  //       console.error("Error creating checkout session:", response.statusText);
  //       return;
  //     }

  //     const session = await response.json();
  //     console.log("This is the session : " + session.id);

  //     const result = await stripe.redirectToCheckout({
  //       sessionId: session.id,
  //     });
  //     // Error handling after redirect attempt
  //     if (result.error) {
  //       console.error("Error with Stripe Checkout:", result.error.message);
  //     }
  //   } catch (error) {
  //     console.error("Checkout error:", error);
  //   }
  // };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cartItems.length === 0 ? (
          <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div
                  className="item"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div>
                    <input
                      style={{
                        marginRight: "10px",
                        transform: "scale(1.5)",
                        cursor: "pointer",
                      }}
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <img
                      onClick={() => handleshowdescription(item.id)}
                      style={{ cursor: "pointer" }}
                      src={
                        item.imageDate
                          ? `data:image/png;base64,${item.imageDate.replace(
                              /^Binary\.createFromBase64\('(.+)'\, \d+\)$/,
                              "$1"
                            )}`
                          : item.imageData
                          ? `data:image/png;base64,${item.imageData}`
                          : "placeholder-image-url"
                      }
                      alt={item.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = "placeholder-image-url";
                      }}
                    />
                  </div>
                  <div className="description">
                    <span>{item.brand}</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="quantity">
                    <button
                      className="plus-btn"
                      type="button"
                      onClick={() => handleIncreaseQuantity(item.id)}
                      disabled={loading}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                    <input type="text" value={item.quantity} readOnly />
                    <button
                      className="minus-btn"
                      type="button"
                      onClick={() => handleDecreaseQuantity(item.id)}
                      disabled={loading}
                    >
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                  </div>
                  <div className="total-price" style={{ textAlign: "center" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}
            <div className="total">Total: ${totalPrice.toFixed(2)}</div>
            <Button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        selectedItems={selectedItems}
        cartItems={cartItems}
        totalPrice={calculateSelectedTotalPrice()}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
