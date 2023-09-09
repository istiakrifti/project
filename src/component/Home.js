import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import {useNavigate} from 'react-router-dom';
import { useUser } from './UserCntxt';
import StarRating from './Assets/StarRating';

export default function Home() {
  const navigate = useNavigate();
  const {userRole}= useUser();
  const [data, setData] = useState({
    info: []
  });
  const [disProducts, setdisProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios.get('http://localhost:3000/')
      .then(res => {
        setData({ info: res.data.result });
        setdisProducts(res.data.result2);
      })
      .catch(err => console.log(err));
  }

  function showDetails(item) {
    navigate(`/showdetails?itemId=${item.ID}`);
}


  return (
    <div>
      <div>
        <div style ={{marginBottom: '50px'}}>
      {userRole==='admin'?(
            <div className='Head'>
            <h4>Welcome Admin</h4>
            <h6>Check & Manage Your  Products!</h6>
          </div>
          
          ):(
              <div className='Head'>
            <h4>Welcome</h4>
            <h6>Check & Get Your Desired Products!</h6>
          </div>
          )}</div>
          <div style = {{marginBottom : '50px'}}>
        <h3 style ={{marginLeft: '30px'}}>Featured Products </h3>

        <div className = 'Products1'>
        
          {data.info.length > 0 ? (
           
            data.info.map(item => (
              <div className = 'Product1' key={`${item.ID}-${item.NAME}+${item.IMG_URL}`}>
                    
                <img src = {require('../image/'+item.IMG_URL)} alt = "ProductImage" style = {{width: '200px',height:'150px'}}/>
                <StarRating rating={item.RATING} />
                <div className='Description1'>
              <p><b> {item.NAME} </b></p>
              {
                item.DISCOUNT > 0 ?(<p><b style={{ color: 'red' }}><del>&#2547;{item.BASE_PRICE}</del><b>{' '}</b>&#2547;{item.BASE_PRICE-(item.BASE_PRICE*(item.DISCOUNT/100))}</b></p>):(<p><b style={{ color: 'red' }}>&#2547;{item.BASE_PRICE}</b></p>)
              }
                <button type="button" className="btn btn-outline-info" onClick={() => showDetails(item)}>Product Details</button>               
                </div>
              </div>
            ))
           ) : (
            'Loading...'
          )}</div>
          </div>
        
          <div style = {{marginBottom : '50px'}}>
        <h3 style ={{marginLeft: '30px'}}>Discounted Products </h3>

        <div className = 'Products1'>

          {disProducts.length > 0 ? (
          
            disProducts.map(item => (
              <div className = 'Product1' key={`${item.ID}-${item.NAME}+${item.IMG_URL}`}>
                    
                <img src = {require('../image/'+item.IMG_URL)} alt = "ProductImage" style = {{width: '200px',height:'150px'}}/>
                <StarRating rating={item.RATING} />
                <div className='Description1'>
              <p><b> {item.NAME} </b></p>
              {
                item.DISCOUNT > 0 ?(<p><b style={{ color: 'red' }}><del>&#2547;{item.BASE_PRICE}</del><b>{' '}</b>&#2547;{item.BASE_PRICE-(item.BASE_PRICE*(item.DISCOUNT/100))}</b></p>):(<p><b style={{ color: 'red' }}>&#2547;{item.BASE_PRICE}</b></p>)
              }
                
                <button type="button" className="btn btn-outline-info" onClick={() => showDetails(item)}>Product Details</button>               
                </div>
              </div>
            ))
          ) : (
            'Loading...'
          )}</div>
          </div>

      </div>
    </div>
  )
}
