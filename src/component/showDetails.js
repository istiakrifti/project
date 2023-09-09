import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
import './showDetails.css';
import { useUser } from './UserCntxt';
import CustomAlert from './CustomAlert';
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
    axios.post('http://localhost:3000/showdetails',{ id,userId })
      .then(res => {
        setData({ info: res.data.result1 });
        setprevReviews(res.data.result2);
        setCheckPurchase(res.data.result3);
      })
      .catch(err => console.log(err));
  }

  const showAlert = (message)=>{
    setAlert ( {
      msg: message,
    })
    setTimeout(()=>{
      setAlert(null);
    },4000);
  }

  const checkLoginStatus=(id)=>{
    if(!props.loginStatus)
    {
      showAlert('You have to log in first');
    }
    else 
    { 
      let cCount=props.cartCount;
      cCount++;
      props.setCartCount(cCount);
      const u_id=props.user;
      axios.post('http://localhost:3000/cart',{id,u_id})
      .then(res => {
          props.setCart({info:res.data});
      })
      .catch(err => console.log(err));
      handleShowAlert();
    }
  }
  
  const addtocomp = (info) => {
    const existingProduct = props.compare.find((product) => product.ID === info.ID);
  
    if (existingProduct) {
      showAlert('Product is already in the comparison list.');
    } else {
      if (props.comCount < 2) {
        props.setComCount(props.comCount + 1);
        props.setCompare([...props.compare, info]);
      } else {
        showAlert('Already added two products');
      }
    }
  };
  

  const handleSubmit = (e) => {
    product_id = data.info[0].ID;    
    e.preventDefault();
    axios.post('http://localhost:3000/productReview', {product_id,userId,rating,review})
      .then((res) => {       
        console.log('successful:', res.data);
      })
      .catch((err) => {
        console.error('failed:', err);
      });

     navigate('/');

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
                <p>Category: {productInfo.CATEGORY}</p>
                <p>Subcategory: {productInfo.SUBCATEGORY}</p>
                <p>Brand: {productInfo.BRAND}</p>
                <p>Available Stock: {productInfo.STOCK}</p>
                </h5>
                {userRole==='admin' ?( <button type="button" class="btn btn-outline-success" onClick={()=>{navigate(`/updateProduct?itemId=${productInfo.ID}`)}}>Update Info</button>)
                :( 
                  <div className='buttons1'>
                  <button type="button" class="btn btn-outline-success" onClick={()=>{checkLoginStatus(productInfo.ID)}}>Add To Cart</button>
                  
                  <button type="button" class="btn btn-outline-success" onClick={()=>{addtocomp(productInfo)}}>Add To Compare</button>
                  </div>)}
                {ShowAlert && (
                  <CustomAlert
                    message="Item has been added to you cart!"
                    onClose={handleCloseAlert}
                    type="success"
                  />
                )}
              </div>  

             
        
      </div>
      </div>


      {checkPurchase.length > 0 ? (
        <div className="product-rating" style={{ marginLeft: '160px' , marginBottom: '80px' }}>
        <h2>Rate This Product</h2>
        <StarRating rating={rating} onRatingChange={handleRatingChange} />
        <form onSubmit={handleSubmit}>
        <div className="form-row py-3 pt-3">
                      <div className='col-lg-10'>
                      <input type="review" onChange={e=>setReview(e.target.value)} className='inp px-3' autoComplete='off' placeholder='Product Review' style={{ borderRadius: '0' }}/>
                      </div>
                      </div>
        <button type="submit" className="btn btn-primary">Submit</button>  
        </form>
        </div> 
      ):(<></>)}
            



          <div style={{ marginLeft: '160px', marginBottom: '80px' }}>
            <h2 style={{ marginBottom: '30px' }}>User Reviews</h2>
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
          </>
            ))
          ) : (
            'Loading...'
          )}

          


           </div>
  )
}