import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import StarRating from './Assets/StarRating';
import './Home.css';

const SearchedProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialKey = queryParams.get('key');

  const [key, setKey] = useState(initialKey);
  const [data, setData] = useState({
    info: []
  });

  useEffect(() => {
    fetchData();
  }, [key]);

  function fetchData() {
    axios.post('http://localhost:3000/searchedproducts', { key })
      .then(res => {
        setData({ info: res.data });
        console.log(data);
      })
      .catch(err => console.log(err));
  }

  function showDetails(item) {
    navigate(`/showdetails?itemId=${item.ID}`);
  }

  // Update key when location changes
  useEffect(() => {
    setKey(queryParams.get('key'));
  }, [location.search]);

  return (
    <div>
      <div>
        <h2>Showing results for : {key}</h2>
      </div>
      <div className='Products1'>
        {data.info.length > 0 ? (
          data.info.map(item => (
            <div className='Product1' key={item.ID}>
              <img src={require('../image/' + item.IMG_URL)} alt="ProductImage" style={{ width: '200px', height: '150px' }} />
              <StarRating rating={item.RATING} />
              <div className='Description1'>
                <p><b>{item.NAME} </b></p>
              {
                item.DISCOUNT > 0 ?(<p><b style={{ color: 'red' }}><del>&#2547;{item.BASE_PRICE}</del><b>{' '}</b>&#2547;{item.BASE_PRICE-(item.BASE_PRICE*(item.DISCOUNT/100))}</b></p>):(<p><b style={{ color: 'red' }}>&#2547;{item.BASE_PRICE}</b></p>)
              }
                <button type="button" className="btn btn-outline-info" onClick={() => showDetails(item)}>Product Details</button>
              </div>
            </div>
          ))
        ) : (
            'Loading...'
          )}
      </div>
    </div>
  );
};

export default SearchedProducts;



