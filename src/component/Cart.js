import React from 'react';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import './Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserCntxt';


export default function Cart({cartCount,setCartCount,showOffcanvas,setShowOffcanvas,show, setShow,user,cart,setCart}) {
      const { userRole } = useUser();
      const navigate = useNavigate();
      const handleCartIconClick = () => { 
        setShowOffcanvas(!showOffcanvas);
        setShow(true);
      };
      function showCart ()
      {
        setShow(false);
      }
      function handleCheckout ()
      {
        if(cart.info.length>0){
          setShow(false); 
          navigate('/payment', { state: { orderedProducts: cart.info } });
        }
        else
        {
          alert('Your cart is empty')
        }
      }
      function handleCartDelete(id)
      {
        axios.post('http://localhost:3000/cart1',{user,id})
        .then(res => {
          setCart({info:res.data.reslt});
          if(res.data.result1[0].CARTITEMS!=null)
          {
            setCartCount(res.data.result1[0].CARTITEMS);
          }
          else{
            setCartCount(0);
          }
        })
      .catch(err => console.log(err));
      }
      
  return (
    <>
    {userRole ==='customer'?(<div>
      <div className="scroll-to-top">
      <FaShoppingCart className="cart-icon" onClick={handleCartIconClick} />
      {cartCount >= 0 && <span className="cart-count">{cartCount}</span>}
      </div>
      <div className={`offcanvas ${show ? 'show' : ''}`}>
        <div className='head' style={{ textAlign: 'center',height :'70px' }}><h1>Your Cart</h1></div>
        
      <ul className="cart-list">
          {cart.info.length>0 ?
          cart.info.map((item) => (
            <li className="cart-item" key={`${item.ID}-${item.NAME}`}>
              <div className="item-details">
                <img src={require('../image/'+item.IMG_URL)} alt='product' width={"30px"} height={"30px"}/>
                <p className="item-name">{item.NAME}</p>
                <p className="item-quantity">Cost: {item.PRODUCT_COUNT}X{item.BASE_PRICE}={item.PRODUCT_COUNT*item.BASE_PRICE}</p>
              </div>
              <div className="delete-icon" onClick={()=>handleCartDelete(item.ID)}>
                <FaTrash/>
              </div>
            </li>
          )):(<b>Your Shopping Cart Is Empty!!!</b>)}
        </ul>
        <div className="checkout-button-container">
                <button className="checkout-button" onClick={handleCheckout}>
                    Checkout
                </button>
            </div>
      <button className="offcanvas-close" onClick={showCart}>
        &times;
      </button>
    </div>
    
    </div>):(<></>)}
    </>
  )
}
