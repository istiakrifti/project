import './App.css';
import Navbar from './component/Navbar';
import AdminBar from './component/Adminbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";
import Login from './component/Login';
import Home from './component/Home';
import Register from './component/Register';
import ShowDetails from './component/showDetails';
import React, { useState } from 'react';
import ShowMenuProducts from './component/ShowMenuProducts';
import SearchedProducts from './component/SearchedProducts';
import Cart from './component/Cart';
import PaymentPage from './component/PaymentPage';
import { UserProvider } from './component/UserCntxt';
import UserInfo from './component/userInfo';
import UpdateUser from './component/UpdateUserInfo';
import CheckUsers from './component/CheckUsers';
import UpdateProduct from './component/UpdateProduct';
import AddNewProduct from './component/AddNewProduct';
import ApprovePurchase from './component/ApprovePurchase';
import UserNotification from './component/UserNotification';
import CompareTwoProduct from './component/CompareTwoProduct';
import Compare from './component/Compare';
import Footer from './component/Footer';


function App() {
  
  const [loginStatus,setLoginStatus] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [show,setShow] = useState(false);
  const [comCount,setComCount] = useState(0);
  const [compare,setCompare] = useState([]);
  const [user,setUser] = useState(0);
  const [cart, setCart] = useState(
    {
      info:[]
    }
  );
  return (
    <>
  
    <Router>
    <UserProvider>
    <Navbar loginStatus={loginStatus} user={user} setCart={setCart} setCartCount={setCartCount} setLoginStatus={setLoginStatus}/>
    <AdminBar/>
    <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/login" element={<Login loginStatus={loginStatus} setLoginStatus={setLoginStatus} setCart={setCart} user={user} setUser={setUser} setCartCount={setCartCount}/>}/> 
          <Route exact path="/register" element={<Register/>}/> 
          <Route exact path="/showdetails" element={<ShowDetails setCart={setCart} compare={compare} setCompare={setCompare} comCount={comCount} setComCount={setComCount} loginStatus={loginStatus} user={user} setCartCount={setCartCount} cartCount={cartCount}/>}/>
          <Route exact path="/showmenuproducts" element={<ShowMenuProducts/>}/>
          <Route exact path="/searchedproducts" element={<SearchedProducts/>}/>
          <Route path="/payment" element={<PaymentPage cart={cart} setCart={setCart} setCartCount={setCartCount} />} />
          <Route exact path="/updateUserInfo" element={<UpdateUser/>}/>
          <Route exact path="/checkUsers" element={<CheckUsers/>}/>
          <Route exact path="/updateProduct" element={<UpdateProduct/>}/>
          <Route exact path="/addNewProduct" element={<AddNewProduct/>}/>
          <Route exact path="/userInfo" element={<UserInfo/>}/>
          <Route exact path="/pendingPurchase" element={<ApprovePurchase/>}/>
          <Route exact path="/compare" element={<CompareTwoProduct compare={compare} setCompare={setCompare} comCount={comCount} setComCount={setComCount}/>}/>
      </Routes>
      <UserNotification user={user}  />
      <Compare comCount={comCount} loginStatus={loginStatus} setComCount={setComCount} compare={compare} setCompare={setCompare}/>
      <Cart cartCount={cartCount} setCartCount={setCartCount} cart={cart} setCart={setCart} user={user} show={show} setShow={setShow} showOffcanvas={showOffcanvas} setShowOffcanvas={setShowOffcanvas}/>
      </UserProvider>
      <Footer/>
    </Router>
    
    </>
  );
}

export default App;
