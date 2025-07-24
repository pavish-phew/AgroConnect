import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <>
      <section id="error_page" className="section">
        <div className="container">
          <div className="error_page_content">
            <h2 style={{ color: "green" }}>Payment Successful !</h2>
            <h3 style={{ color: "white" }}>
              You will receive the order status later{" "}
            </h3>
            <h3 style={{ color: "white" }}>
              Please check your mail after few minutes
            </h3>
            <Link to="/" className="btn">
              Go Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default SuccessPage;
