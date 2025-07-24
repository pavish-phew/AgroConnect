import React from "react";
import { Link } from "react-router-dom";

const FailurePage = () => {
  return (
    <>
      <section id="error_page" className="section">
        <div className="container">
          <div className="error_page_content">
            <h2 style={{ color: "red" }}>Payment Failure !</h2>
            {/* <h3 style={{ color: "white" }}>
              You will receive the order status later{" "}
            </h3> */}
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

export default FailurePage;
