import React,{useState} from 'react';
import './Register.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


export default function Register(props) {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        firstName:"",lastName:"",email:"",password:"",confirmPassword:"",phoneNumber:"",address:""
    })
    const [passwordMatchError,setPasswordMatchError] =useState(false);
    const [checkEmail,setCheckEmail]=useState(false);
    const handleChange = (e)=>{
        const {name,value} = e.target;
        setFormData((prevData)=>({
            ...prevData,[name]:value
        }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
      
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatchError(true);
            return;
        }
        setPasswordMatchError(false);
        axios.post('http://localhost:3000/register', formData)
          .then((res) => {
            if(res.data==='Registration successful.')
            {
              setCheckEmail(false);
              navigate('/login');
            }
            else 
            {
              setCheckEmail(true);
            }
            
            console.log('Registration successful:', res.data);
          })
          .catch((err) => {
            console.error('Registration failed:', err);
          });
      };
  return (
    <div className="container1">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
            <h2 className="card-title text-center">REGISTRATION</h2>
            {passwordMatchError && (
                <div className="alert alert-danger" role="alert">
                    Passwords do not match. Please make sure your passwords match.
                </div>
            )}
            {checkEmail && (
                <div className="alert alert-danger" role="alert">
                    Email already registered.Try different one..
                </div>
            )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address <span className="required">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password <span className="required">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="required">*</span></label>
                <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
