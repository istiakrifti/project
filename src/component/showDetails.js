import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
import './showDetails.css';
import { useUser } from './UserCntxt';
import CustomAlert from './Assets/CustomAlert';
import StarRating from './Assets/StarRating';

export default function ShowDetails(props) {
  const [ShowAlert, setShowAlert] = useState(false);
  const {userId,userRole}= useUser();
  const [rating, setRating] = useState(0);
  const [review,setReview] =useState('');
  const navigate=useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); 
  const id = queryParams.get('itemId');
  const [alert,setAlert] = useState(null);
  const [count,setCount] = useState([]);
  const [data, setData] = useState({
    info: []
  });
  const [prevReviews, setprevReviews] = useState([]);
  const [checkPurchase,setCheckPurchase]=useState([]);
  const [msgController, setMsgController] = useState(1);

  const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState(''); // To store new comments
const [replyTexts, setReplyTexts] = useState(''); // To store reply text
const [msg,setMsg]=useState('');

  let product_id = "";
  
  
  
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
 
 

  
  useEffect(() => {
    fetchData();
  }, []);
  
  function fetchData() {
    axios.post('http://localhost:3000/showdetails', { id, userId })
      .then(res => {
        setData({ info: res.data.result1 });
        setprevReviews(res.data.result2);
        setCheckPurchase(res.data.result3);
        setReview('');
        setRating(0);          
        const product_id = res.data.result1[0].ID; 
        fetchComments(product_id);
      })
      .catch(err => console.log(err));
  }

  function fetchComments(product_id) {
    axios.get(`http://localhost:3000/getComments/${product_id}`)
      .then((res) => {
        setComments(res.data); 
      })
      .catch((err) => {
        console.error('Failed to fetch comments:', err);
      });
  }
  
  const showAlert = (message)=>{
    setAlert ( {
      msg: message,
    })
    setTimeout(()=>{
      setAlert(null);
    },4000);
  }

  // const checkLoginStatus=(id)=>{
  //   if(!props.loginStatus)
  //   {
  //     showAlert('You have to log in first');
  //   }
  //   else 
  //   { 
  //     let cCount=props.cartCount;
  //     cCount++;
  //     props.setCartCount(cCount);
  //     const u_id=props.user;
  //     axios.post('http://localhost:3000/cart',{id,u_id})
  //     .then(res => {
  //         props.setCart({info:res.data});
  //     })
  //     .catch(err => console.log(err));
  //     setMsgController(1);
  //     handleShowAlert();
  //   }
  // }

  const checkLoginStatus=(id)=>{
    if(!props.loginStatus)
    {
      showAlert('You have to log in first');
    }
    else 
    { 
      let cCount=props.cartCount;
      
      const u_id=props.user;
      axios.post('http://localhost:3000/cart',{id,u_id})
      .then(res => {
          props.setCart({info:res.data.result});
          setMsg(res.data.msg);
      })
      .catch(err => console.log(err));
      if(msg!=='stockOut')
      {
      cCount++;
      props.setCartCount(cCount);
      setMsgController(1);
      handleShowAlert();
      }
      else
      {
        showAlert('This amount of the product is not available right now!!!');
      }
    }
  }

  const addComment = () => {
    // Create a new comment object
    const newCommentObject = {
      productId: id,
      userId: userId,
      text: newComment,
    };
  
    // Send the new comment to the server
    axios.post('http://localhost:3000/addComment', newCommentObject)
      .then((res) => {
        fetchComments(id);
        setNewComment(''); 
        setMsgController(4);
        handleShowAlert();
      })
      .catch((err) => {
        console.error('Failed to add comment:', err);
      });
  };
  
  const addReply = (commentId) => {
    const replyText = replyTexts[commentId] || '';
    const newReplyObject = {
      productId: id,
      userId: userId,
      parentCommentId: commentId,
      text: replyText,
    };
  
    // Send the new reply to the server
    axios.post('http://localhost:3000/addReply', newReplyObject)
      .then((res) => {
        setReplyTexts((prevReplyTexts) => ({
          ...prevReplyTexts,
          [commentId]: '',
        }));
        fetchComments(id);
        
      })
      .catch((err) => {
        console.error('Failed to add reply:', err);
      });
  };
  
  
  const addtocomp = (info) => {
    if(!props.loginStatus)
    {
      showAlert('You have to log in first');
    }
    else{
      const existingProduct = props.compare.find((product) => product.ID === info.ID);
  
      if (existingProduct) {
        showAlert('Product is already in the comparison list.');
      } else {
        if (props.comCount < 2) {
          props.setComCount(props.comCount + 1);
          props.setCompare([...props.compare, info]);
          setMsgController(2); 
          handleShowAlert();
        } else {
          showAlert('Already added two products');
        }
      }
    }
    
  };
  

  const handleSubmit = (e) => {
    product_id = data.info[0].ID;    
    e.preventDefault();
    axios.post('http://localhost:3000/productReview', {product_id,userId,rating,review})
      .then((res) => {       
        console.log('successful:', res.data);

        setMsgController(3); 
        handleShowAlert();
        fetchData();      

      })
      .catch((err) => {
        console.error('failed:', err);
      });

     

  };
  
  

  return (
        
        <div>
        {alert && (<div className="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>{alert.msg}</strong> 
        </div>)}
          {data.info.length > 0 ? (
            
            data.info.map(productInfo => (
              <>
              <div className='product'>
    <div className="details">                  
              <div className="big-img">
            
            <img src = {require('../image/'+productInfo.IMG_URL)} alt = "ProductImage" /> 
              </div>

              <div className="box">
                <div className="row">
                  <h2>{productInfo.NAME}</h2>                
                </div>
                <h5>
                <StarRating rating={productInfo.RATING} />
                
              {
                productInfo.DISCOUNT > 0 ?(<p><b style={{ color: 'red' }}><del>&#2547;{productInfo.BASE_PRICE}</del><b>{' '}</b>&#2547;{productInfo.BASE_PRICE-(productInfo.BASE_PRICE*(productInfo.DISCOUNT/100))}</b></p>):(<p><b style={{ color: 'red' }}>&#2547;{productInfo.BASE_PRICE}</b></p>)
              }
                <p><b style={{ color: 'indigo' }}>Category : </b> {productInfo.CATEGORY}</p>
                <p><b style={{ color: 'indigo' }}>Subcategory : </b> {productInfo.SUBCATEGORY}</p>
                <p><b style={{ color: 'indigo' }}>Brand : </b> {productInfo.BRAND}</p>
                <p><b style={{ color: 'indigo' }}>Description :  </b>{productInfo.ATTVALUES}</p>
                <p><b style={{ color: 'indigo' }}>Available Stock : </b> {productInfo.STOCK}</p>
                </h5>
                {userRole==='admin' ?( <button type="button" class="btn btn-outline-success" onClick={()=>{navigate(`/updateProduct?itemId=${productInfo.ID}`)}}>Update Info</button>)
                :( productInfo.BASE_PRICE > 0 ? (
                  <div className='buttons1'>
                  <button type="button" class="btn btn-outline-success" style={{marginRight:'30px'}} onClick={()=>{checkLoginStatus(productInfo.ID)}}>Add To Cart</button>
                  
                  <button type="button" class="btn btn-outline-success" onClick={()=>{addtocomp(productInfo)}}>Add To Compare</button>
                  </div>
                ):(<><p><b style={{ color: 'red' }}>(Upcoming Product : Not available yet!)</b></p> </>)
                  )}
                {ShowAlert && (
                  msgController === 1 ? (
                    <CustomAlert
                      message="Item has been added to your cart!"
                      onClose={handleCloseAlert}
                      type="success"
                    />
                  ) : msgController === 2 ? (
                    <CustomAlert
                      message="Item has been added to compare!"
                      onClose={handleCloseAlert}
                      type="success"
                    />
                  ) :  msgController === 3 ? (
                    <CustomAlert
                      message="Your review has been submitted!"
                      onClose={handleCloseAlert}
                      type="success"
                    />
                  ) :(
                    <CustomAlert
                    message="Your comment has been submitted!"
                    onClose={handleCloseAlert}
                    type="success"
                  />
                  )
                )}
              </div>  

             
        
      </div>
      </div>


      {props.loginStatus=== true && checkPurchase.length > 0 ? (
        <div className="product-rating" style={{ marginLeft: '160px' , marginBottom: '80px' }}>
        <h2>Rate This Product</h2>
        <StarRating rating={rating} onRatingChange={handleRatingChange} />
        <form onSubmit={handleSubmit}>
        <div className="form-row py-3 pt-3">
                      <div className='col-lg-10'>
                      <input value={review}type="review" onChange={e=>setReview(e.target.value)} className='inp px-3' autoComplete='off' placeholder='Product Review' style={{ borderRadius: '0' }}/>
                      </div>
                      </div>
        <button type="submit" className="btn btn-primary">Submit</button>  
        </form>
        </div> 
      ):(<></>)}
            



          <div style={{ marginLeft: '160px', marginBottom: '80px' }}>
            <div style={{ marginBottom: '30px',backgroundColor:'turquoise',width:'250px',height:'50px',textAlign: 'center',boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'}}><h2 style={{ }}>User Reviews</h2></div>
            {prevReviews.length > 0 ? (
              <ul>
                {prevReviews.map((review, index) => (
                  review.TEXT!=null &&
                  <li key={index}>
                    <h5>{review.NAME}</h5>
                    <div className="review-box" style={{  marginBottom: '10px' }}>
                      <p><b>{review.TEXT}</b></p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <h4>No reviews found....</h4>
            )}
          </div>
          <div>

          <div style={{ marginLeft: '160px', marginBottom: '80px' }}>
          <div style={{ marginBottom: '30px',backgroundColor:'turquoise',width:'250px',height:'50px',textAlign: 'center',boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'}}><h2>User Comments</h2></div>

  {props.loginStatus===true?(
    <div>
    <textarea
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      className="inp px-3"
      autoComplete="off"
      placeholder="Add a Comment"
      style={{ borderRadius: '0' }}
    />
    <button type="button" onClick={addComment} className="btn btn-primary">
      Add Comment
    </button>
  </div>
  ):(<></>)}

  
  <ul>
    {comments.length> 0 ? (
      comments.map((comment, index) => (
        <li key={comment.commentId} className={`comment-item-${index}`}>
          <h5>{comment.userName}</h5>
          <div className="review-box" style={{ marginBottom: '10px' }}>
            <p><b>{comment.text}</b></p>
          </div>
          {props.loginStatus===true? (
          <div className="reply-container">
            <textarea
              value={replyTexts[comment.commentId] || ''}
              onChange={(e) => {
                setReplyTexts((prevReplyTexts) => ({
                  ...prevReplyTexts,
                  [comment.commentId]: e.target.value,
                }));
              }}
              className="inp px-3 reply-input"
              autoComplete="off"
              placeholder="Add a Reply"
              style={{ borderRadius: '0' }}
            />
            <button
              type="button"
              onClick={() => addReply(comment.commentId)}
              className="btn btn-primary"
            >
              Add Reply
            </button>
          </div>):(<></>)}
          {/* Display replies (including replies to replies) */}
          {comment.replies.length > 0 && (
            <ul className="replies">
              {comment.replies.map((reply) => (
                <li key={reply.commentId} className={`reply-item-${index}`}>
                  <h5>{reply.userName}</h5>
                  <div className="review-box" style={{ marginBottom: '10px' }}>
                    <p><b>{reply.text}</b></p>
                  </div>
                  {/* Add reply input and button for replies to replies */}
                  <div className="reply-container">
                    {props.loginStatus===true?(
                                          <div>
                                          <textarea
                                            value={replyTexts[reply.commentId] || ''}
                                            onChange={(e) => {
                                              setReplyTexts((prevReplyTexts) => ({
                                                ...prevReplyTexts,
                                                [reply.commentId]: e.target.value,
                                              }));
                                            }}
                                            className="inp px-3 reply-input"
                                            autoComplete="off"
                                            placeholder="Add a Reply"
                                            style={{ borderRadius: '0' }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => addReply(reply.commentId)}
                                            className="btn btn-primary"
                                          >
                                            Add Reply
                                          </button>
                                          </div>
                      
                    ):(<></>)}

                    {reply.replies.length > 0 && (
            <ul className="replies">
              {reply.replies.map((reply1) => (
                <li key={reply1.commentId} className={`reply-item-${index}`}>
                  <h5>{reply1.userName}</h5>
                  <div className="review-box" style={{ marginBottom: '10px' }}>
                    <p><b>{reply1.text}</b></p>
                  </div>
                  {/* Add reply input and button for replies to replies */}
                  {props.loginStatus===true?(
                    <div className="reply-container">
                    <textarea
                      value={replyTexts[reply1.commentId] || ''}
                      onChange={(e) => {
                        setReplyTexts((prevReplyTexts) => ({
                          ...prevReplyTexts,
                          [reply.commentId]: e.target.value,
                        }));
                      }}
                      className="inp px-3 reply-input"
                      autoComplete="off"
                      placeholder="Add a Reply"
                      style={{ borderRadius: '0' }}
                    />
                    <button
                      type="button"
                      onClick={() => addReply(reply1.commentId)}
                      className="btn btn-primary"
                    >
                      Add Reply
                    </button>
                  </div>
                  ):(<></>)}
                  
                </li>
              ))}
            </ul>
          )}




                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="comment-separator"></div>
        </li>
      ))
    ):(<h5>No comments found...</h5>)}
  
  
</ul>

</div>
</div>
          </>
            ))
          ) : (
            'Loading...'
          )}
          
          


           </div>
  )
}