import React, { useEffect, useState } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from './UserCntxt';
import CustomAlert from './Assets/CustomAlert';

export default function UpdateProduct() {
    const location = useLocation();
    const [ShowAlert, setShowAlert] = useState(false);
    const queryParams = new URLSearchParams(location.search); 
    const id = queryParams.get('itemId');
    const {userId}= useUser();
    const [ProductDetails, setProductDetails] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productId:'',
        name: '',
        basePrice: '',
        discount: '',
        rating: '',
        category: '',
        subcategory: '',
        brand: '',
        stock: ''
    });

    const handleShowAlert = () => {
      setShowAlert(true);
    };
    const handleCloseAlert = () => {
      setShowAlert(false);
      navigate('/');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const response = await axios.post('http://localhost:3000/showdetails', { id,userId });
                    setProductDetails(response.data.result1);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (ProductDetails) {
            const product = ProductDetails[0];
            setFormData({
                productId:product.ID,
                name: product.NAME,
                basePrice: product.BASE_PRICE,
                discount: product.DISCOUNT,
                rating: product.RATING,
                category: product.CATEGORY,
                subcategory: product.SUBCATEGORY,
                brand: product.BRAND,
                stock: product.STOCK
            });
        }
    }, [ProductDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("In form data "+formData.productId);
        axios.post('http://localhost:3000/updateProduct', formData)
            .then((res) => {
                console.log(res.data);
                handleShowAlert();
            })
            .catch((err) => {
                console.error('Update failed:', err);
            });
            
    };

    return (
        
         <div className="container1">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
            <h2 className="card-title text-center">UPDATE PRODUCT INFORMATION</h2>
    
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="basePrice" className="form-label">Base Price <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="basePrice"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="discount" className="form-label">Discount <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                <label htmlFor="subcategory" className="form-label">Sub Category <span className="required">*</span></label>
                <input
                    type="text"
                    className="form-control"
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    required
                />
                </div>
                <div className="mb-3">
                  <label htmlFor="brand" className="form-label">Brand <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">Stock<span className="required">*</span></label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">UPDATE</button>
                </div>
                {ShowAlert && (
                  
                    <CustomAlert
                    message="Info has been updated!"
                    onClose={handleCloseAlert}
                    type="success"/>
                 )}

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}
