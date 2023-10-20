import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css'; // Make sure to import your CSS file
import axios from 'axios';
import { useEffect } from 'react';

export default function PaymentPage(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const orderedProducts = location.state.orderedProducts;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    mobile: '',
    email: '',
    paymentMethod:'',
    deliveryMethod:'',
  });
  function Total()
  {
    let total=0;
    for(let i=0;i<orderedProducts.length;i++)
    {          
        total+= (orderedProducts[i].DISCOUNT > 0 ?orderedProducts[i].BASE_PRICE-(orderedProducts[i].BASE_PRICE*(orderedProducts[i].DISCOUNT/100)):orderedProducts[i].BASE_PRICE)*orderedProducts[i].PRODUCT_COUNT;
    }
    return total;
  }

  const concatenateFormData = () => {
    const total = Total();
    const formDataString = 
      `First Name: ${formData.firstName} - 
      Last Name: ${formData.lastName} -
      Mobile: ${formData.mobile} - 
      Email: ${formData.email} - 
      Payment Method: ${formData.paymentMethod} - 
      Delivery Method: ${formData.deliveryMethod} -
      Total: ${total}`.replace(/\s+/g, ' ');
    return formDataString;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  function updateCart()
  {
    props.setCart({info:[]});
    props.setCartCount(0);
  }
  const handleConfirmOrder = () => {
    const paymentInfo = concatenateFormData();
    const address = formData.address;
    axios.post('http://localhost:3000/payment', {orderedProducts,paymentInfo,address})
      .then(res => {
            
      })
      .catch(err => console.log(err));
    alert('Order confirmed successfully...Wait for approval!!!');
    updateCart();
    navigate('/');
  };

  return (
    <div className="checkout-page">
      <div className="container5">
        <h1 className="page-title">Checkout</h1>
        <div className="row5">
          
          <div className="col-md-6">
            <div className="customer-info-section">
              <h2>Customer Information</h2>
              <form className="customer-info-form">
                <div className="form-group">
                  <label htmlFor="input-firstname">First Name</label>
                  <input
                    type="text"
                    id="input-firstname"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-lastname">Last Name</label>
                  <input
                    type="text"
                    id="input-lastname"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-address">Address</label>
                  <input
                    type="text"
                    id="input-address"
                    name="address"
                    placeholder="Address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-telephone">Mobile</label>
                  <input
                    type="tel"
                    id="input-telephone"
                    name="mobile"
                    placeholder="Mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-email">Email</label>
                  <input
                    type="email"
                    id="input-email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="payment-info-section">
              <div className='paymentheading'>
              <h2>Payment Information</h2></div>

              <div className="payment-options">
              <p style={{fontWeight:"bold",fontSize:"20px"}}>Select a payment method</p>
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    onChange={handleInputChange}
                  />
                  Cash on Delivery
                </label>
                <br />
                <label className="radio-inline">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    onChange={handleInputChange}
                  />
                  Online Payment
                </label>
              </div>
              <div className="accepted-logo">
                <h2>We Accept:</h2>
                <img
                  className="logo logo-visa"
                  src={require('./card-logo.png')}
                  alt="Accepted Cards"
                />
              </div>
              <div className='delivery'>
              <h2>Delivery Method</h2>
                    
                    <p style={{fontWeight:"bold",fontSize:"20px"}}>Select a delivery method</p>
                    <label className="radio-inline">
                    <input
                        type="radio"
                        name="deliveryMethod"
                        value="Home Delivery"
                        onChange={handleInputChange}
                    />
                    Home Delivery - 60৳
                    </label>
                    <br />
                    <label className="radio-inline">
                    <input
                        type="radio"
                        name="deliveryMethod"
                        value="Store Pickup"
                        onChange={handleInputChange}
                    />
                    Store Pickup - 0৳
                    </label>
              </div>
            </div>
          </div>
        </div>
       
        <div className="product-details-section">
          <h2>Product Details</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
             
              {orderedProducts.map((product) => (
                <tr key={product.ID}>
                  <td>{product.NAME}</td>
                  <td>&#2547;{product.DISCOUNT > 0 ?product.BASE_PRICE-(product.BASE_PRICE*(product.DISCOUNT/100)):product.BASE_PRICE}</td>
                  <td>{product.PRODUCT_COUNT}</td>
                  <td>&#2547;{product.DISCOUNT > 0 ?product.BASE_PRICE-(product.BASE_PRICE*(product.DISCOUNT/100)):product.BASE_PRICE*product.PRODUCT_COUNT}</td>
                </tr>
                
              ))}
              <tr>
              <td colSpan={3}>Total</td> 
                <td>&#2547;{Total()}</td>
              </tr>
              
            </tbody>
            
          </table>
        </div>
        
        <div className="checkout-final-action">
          <button className="btn submit-btn pull-right" type="button" onClick={handleConfirmOrder}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
