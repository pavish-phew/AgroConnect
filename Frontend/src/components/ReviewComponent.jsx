import React, { useState, useEffect, useContext } from 'react';
import axios from "../axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReviewComponent.css'; 
import AppContext from '../Context/Context';

const ReviewComponent = ({ productId, productOwnerId }) => {
  const { userId } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false); 

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/products/${productId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        setError('Failed to fetch reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = { rating, reviewText, userId: userId };

    try {
      const response = await axios.post(`/products/${productId}/reviews`, newReview);
      const savedReview = response.data;
      setReviews([...reviews, savedReview]);
      setRating(0);
      setReviewText('');
    } catch (error) {
      setError('Error submitting review. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? "text-warning" : "text-muted"} style={{ fontSize: '20px' }}>
        ★
      </span>
    ));
  };

  return (
    <div className="review-section my-4">
      <h3 className="mb-4">Reviews</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {userId && userId !== productOwnerId && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Rating:</label>
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="0">Select rating</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Review:</label>
            <textarea
              className="form-control"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </div>
            <div>
              <div
                style={{ cursor: 'pointer', fontSize: '24px', textAlign: 'center', margin: '10px 0', color: 'blue' }}
                onClick={() => setShowAll(prev => !prev)}
              >
                {/* nav-item dropdown */}
                {showAll ? '▲' : '▼'} 
              </div>
            </div>
          </div>

        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {reviews.length > 0 ? (
            <>
              {/* Show only the first review initially */}
              {showAll ? (
                reviews.map((review) => (
                  <div key={review.reviewId} className="review-card border p-3 mb-3 shadow-sm">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h5>{review.userName}</h5>
                      <div>{renderStars(review.rating)}</div>
                    </div>
                    <p style={{ color: 'red' }}>{review.reviewText}</p>
                    <small className="text-muted">{new Date(review.timestamp).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                reviews.length > 0 && (
                  <div key={reviews[0].reviewId} className="review-card border p-3 mb-3 shadow-sm">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h5>{reviews[0].userName}</h5>
                      <div>{renderStars(reviews[0].rating)}</div>
                    </div>
                    <p style={{ color: 'red' }}>{reviews[0].reviewText}</p>
                    <small className="text-muted">{new Date(reviews[0].timestamp).toLocaleString()}</small>
                  </div>
                )
              )}

              {/* Down Arrow for expanding reviews */}
              {/* {!showAll && (
                <div 
                  style={{ cursor: 'pointer', fontSize: '24px', textAlign: 'center', margin: '10px 0' }} 
                  onClick={() => setShowAll(true)}
                >
                  ▼ 
                </div>
              )} */}
            </>
          ) : (
            <div className="alert alert-info">No reviews yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;

// import React, { useState, useEffect, useContext } from 'react';
// import axios from "../axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './ReviewComponent.css'; // Adjust the path as necessary
// import AppContext from '../Context/Context';

// const ReviewComponent = ({ productId, productOwnerId }) => {
//   const { userId } = useContext(AppContext);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showAll, setShowAll] = useState(false); // State to track whether to show all reviews

//   useEffect(() => {
//     const fetchReviews = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`/products/${productId}/reviews`);
//         setReviews(response.data);
//       } catch (error) {
//         setError('Failed to fetch reviews.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, [productId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newReview = { rating, reviewText, userId: userId };

//     try {
//       const response = await axios.post(`/products/${productId}/reviews`, newReview);
//       const savedReview = response.data;
//       setReviews([...reviews, savedReview]);
//       setRating(0);
//       setReviewText('');
//     } catch (error) {
//       setError('Error submitting review. Please try again.');
//     }
//   };

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => (
//       <span key={index} className={index < rating ? "text-warning" : "text-muted"} style={{ fontSize: '20px' }}>
//         ★
//       </span>
//     ));
//   };

//   return (
//     <div className="review-section my-4">
//       <h3 className="mb-4">Reviews</h3>

//       {error && <div className="alert alert-danger">{error}</div>}
//       {userId && userId !== productOwnerId && (
//         <form onSubmit={handleSubmit} className="mb-4">
//           <div className="mb-3">
//             <label className="form-label">Rating:</label>
//             <select
//               className="form-select"
//               value={rating}
//               onChange={(e) => setRating(Number(e.target.value))}
//             >
//               <option value="0">Select rating</option>
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <option key={star} value={star}>{star}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Review:</label>
//             <textarea
//               className="form-control"
//               value={reviewText}
//               onChange={(e) => setReviewText(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary">Submit Review</button>
//         </form>
//       )}

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div>
//           {reviews.length > 0 ? (
//             <>
//               {/* Show only the first review initially */}
//               {showAll ? (
//                 reviews.map((review) => (
//                   <div key={review.reviewId} className="review-card border p-3 mb-3 shadow-sm">
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <h5>{review.userName}</h5>
//                       <div>{renderStars(review.rating)}</div>
//                     </div>
//                     <p style={{ color: 'red' }}>{review.reviewText}</p>
//                     <small className="text-muted">{new Date(review.timestamp).toLocaleString()}</small>
//                   </div>
//                 ))
//               ) : (
//                 <div key={reviews[0].reviewId} className="review-card border p-3 mb-3 shadow-sm">
//                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <h5>{reviews[0].userName}</h5>
//                     <div>{renderStars(reviews[0].rating)}</div>
//                   </div>
//                   <p style={{ color: 'red' }}>{reviews[0].reviewText}</p>
//                   <small className="text-muted">{new Date(reviews[0].timestamp).toLocaleString()}</small>
//                 </div>
//               )}
//               {/* View More button */}
//               {!showAll && (
//                 <button onClick={() => setShowAll(true)} className="btn btn-secondary">
//                   View More
//                 </button>
//               )}
//             </>
//           ) : (
//             <div className="alert alert-info">No reviews yet.</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewComponent;

// import React, { useState, useEffect, useContext } from 'react';
// import axios from "../axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './ReviewComponent.css'; // Adjust the path as necessary
// import AppContext from '../Context/Context';
// // import { useNavigate } from 'react-router-dom';
// const ReviewComponent = ({ productId, productOwnerId }) => {
//   // const navigate = useNavigate();
//   const { userId } = useContext(AppContext);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchReviews = async () => {
//       console.log(userId)
//       console.log(productOwnerId)
//       // if(userId==null)
//       // {
//       //   navigate('/login')
//       // }
//       setLoading(true);
//       try {
//         const response = await axios.get(`/products/${productId}/reviews`);
//         setReviews(response.data);
//       } catch (error) {
//         setError('Failed to fetch reviews.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, [productId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newReview = { rating, reviewText, userId: userId, };

//     try {
//       const response = await axios.post(`/products/${productId}/reviews`, newReview);
//       const savedReview = response.data;
//       setReviews([...reviews, savedReview]);
//       setRating(0);
//       setReviewText('');
//     } catch (error) {
//       setError('Error submitting review. Please try again.');
//       console.error(error);
//     }
//   };
//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => {
//         return (
//             <span key={index} className={index < rating ? "text-warning" : "text-muted"} style={{fontSize:'20px'}}>
//                 ★
//             </span>
//         );
//     });
// };

//   return (
//     <div className="review-section my-4">
//       <h3 className="mb-4">Reviews</h3>

//       {error && <div className="alert alert-danger">{error}</div>}
//       {userId && userId !== productOwnerId && (
//       <form onSubmit={handleSubmit} className="mb-4">
//         <div className="mb-3">
//           <label className="form-label">Rating:</label>
//           <select
//             className="form-select"
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//           >
//             <option value="0">Select rating</option>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <option key={star} value={star}>{star}</option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Review:</label>
//           <textarea
//             className="form-control"
//             value={reviewText}
//             onChange={(e) => setReviewText(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">Submit Review</button>
//       </form>)}

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div>
//           {reviews.length > 0 ? (
//             reviews.map((review) => (
//               <div key={review.reviewId} className="review-card border p-3 mb-3 shadow-sm">
//                 {/* <p>{review.rating}</p> */}
//                 <div style={{display:'flex',justifyContent:'space-between'}}>
//                 <h5>{review.userName}</h5>
//                 <div>{renderStars(review.rating)}</div>
//                 </div>
//                 <p style={{ color: 'red' }}>{review.reviewText}</p>
//                 <small className="text-muted">{new Date(review.timestamp).toLocaleString()}</small>
//               </div>
//             ))
//           ) : (
//             <div className="alert alert-info">No reviews yet.</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewComponent;
