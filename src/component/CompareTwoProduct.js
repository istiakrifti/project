import React from 'react';
import { useLocation } from 'react-router-dom';
import './CompareTwoProducts.css';
import StarRating from './Assets/StarRating';

function CompareTwoProduct(props) {
  const location = useLocation();
  const resultTable = location.state.resultTable;
  const p1 = location.state.p1;
  const p2 = location.state.p2;
  const product = location.state.product;

  const attributeValues = {};

  resultTable.forEach((item) => {
    const { ATTR_NAME, ATTR_VALUE, PRODUCT_ID } = item;

    if (!attributeValues[ATTR_NAME]) {
      attributeValues[ATTR_NAME] = { Product1: '', Product2: '' };
    }

    if (PRODUCT_ID === p1) {
      attributeValues[ATTR_NAME].Product1 = ATTR_VALUE;
    } else if (PRODUCT_ID === p2) {
      attributeValues[ATTR_NAME].Product2 = ATTR_VALUE;
    }
  });

  const attributes = Object.keys(attributeValues);
  console.log(product);
  return (
    <div>
      <h1>Product Comparison</h1>
      <table>
        <thead>
          <tr>
            <th> </th>
            <th className="product1"><div><img src={require('../image/'+product[0].IMG_URL)} alt='product1' width={'150px'} height={'150px'}/><br/>
            <p>{product[0].NAME}</p><p><b style={{ color: 'red' }}>&#2547;{product[0].BASE_PRICE}</b></p><p><StarRating rating={product[0].RATING} /></p></div></th>
            <th className="product2"><div><img src={require('../image/'+product[1].IMG_URL)} alt='product2' width={'150px'} height={'150px'}/><br/>
            <p>{product[1].NAME}</p><p><b style={{ color: 'red' }}>&#2547;{product[1].BASE_PRICE}</b></p><p><StarRating rating={product[1].RATING} /></p></div></th>
          </tr>
        </thead>
        <tbody>
          {attributes
          .filter((atr)=>(atr!=='Name'))
          .map((attribute) => ( 
            <tr key={attribute}>
              <td className="attr"><b>{attribute}</b></td>
              <td className="product1">{attributeValues[attribute].Product1}</td>
              <td className="product2">{attributeValues[attribute].Product2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompareTwoProduct;
