import React, { useState } from 'react';
import './Navbar.css';
import { Link,useNavigate } from 'react-router-dom';
import DynamicNavbar from './DynamicNavbar';
import { useUser } from './UserCntxt'; 

export default function Navbar(props) {
  const {updateRole,userName}= useUser();
  console.log(userName);
  const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const [key,setKey] =useState('');
  
    function handleSubmit(e){
      e.preventDefault();    
      navigate(`/searchedproducts?key=${key}`);
  }
  function setLogin (){
    props.setLoginStatus(false);
    props.setCartCount(0);
    updateRole('null');

  }
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand me-5" to="/">
          <b style={{ color: 'red' }}>TechHub</b>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-between"
          style={{ marginLeft: '300px' }}
          id="navbarNav"
        >
          <form className="d-flex" onSubmit={handleSubmit}>
            <input
              className="form-control me-4"
              type="search"
              placeholder="Search"
              style={{ width: '400px' }}
              aria-label="Search"
              onChange={e=>setKey(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          <ul className="navbar-nav">
            {props.loginStatus ? (
              <li
                className="nav-item dropdown"
                onMouseLeave={closeDropdown}
                onClick={toggleDropdown}
                style={{ marginRight: '70px' }}
              >
                <span
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                >
                 <b> {userName} </b>
                </span>
                <div
                  className={`dropdown-menu ${showDropdown ? 'show' : ''}`}
                  aria-labelledby="navbarDropdown"
                >
                  <button className="dropdown-item" onClick={()=>navigate('/userInfo')}>Your Information</button>
                  <button className="dropdown-item logout-button" onClick={setLogin}><Link to='/login' className='logout'>Logout</Link></button>
                </div>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                   <b>Login</b>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
    <div><DynamicNavbar/></div>
    </div>
  );
}
