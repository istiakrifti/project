import React, { useEffect, useState } from 'react';
import { FaExchangeAlt, FaTimes } from 'react-icons/fa';
import './Compare.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserCntxt';
import axios from 'axios';

function Compare(props) {
  const navigate = useNavigate();
  const {userRole} = useUser();
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };


const handleCompareNow = () => {
  if (props.comCount < 2) {
    alert('Add two products to compare');
    return;
  }
  const product = props.compare;
  const product1 = props.compare[0].ID;
  const product2 = props.compare[1].ID;

  axios
    .post('http://localhost:3000/compare', { product1, product2 })
    .then((res) => {
      navigate('/compare', { state: { resultTable: res.data , p1:product1, p2:product2, product: product} });
    })
    .catch((error) => {
      console.error('Error fetching user details:', error);
    });

    props.setCompare([]);
    props.setComCount(0);
    setShowPanel(!showPanel)
};

  const handleClear = () => {
    props.setCompare([]);
    props.setComCount(0);
  };
  
  return (
    <div>
      {props.loginStatus && userRole ==='customer' &&
      <div className="compare-icon" onClick={togglePanel}>
        <FaExchangeAlt />
        {props.comCount >= 0 && <span className="count1">{props.comCount}</span>}
      </div>}

      
      {showPanel && (
        <div className="compare-panel">
          <div className="panel-header">
            <h2>Compare Items</h2>
            <div className="close-button" onClick={togglePanel}>
              <FaTimes /> 
            </div>
          </div>
          <ul>
            {props.compare.map((item) => (
              <li>
                <div className='selected'>
                  {item.NAME}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={handleCompareNow}>Compare Now</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      )}
    </div>
  );
}

export default Compare;
