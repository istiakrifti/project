import React, { useEffect, useState } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function AddNewProduct() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        basePrice: '',
        discount: '',
        category: '',
        subcategory: '',
        brand: '',
        stock: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      console.log(file);
      setImageFile(file);
  };
  const [imgFileName,setImageFileName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataWithImage = new FormData();
        formDataWithImage.append('name', formData.name);
        formDataWithImage.append('basePrice', formData.basePrice);
        formDataWithImage.append('discount', formData.discount);
        formDataWithImage.append('category', formData.category);
        formDataWithImage.append('subcategory', formData.subcategory);
        formDataWithImage.append('brand', formData.brand);
        formDataWithImage.append('stock', formData.stock);
        formDataWithImage.append('image', imageFile);
        axios.post('http://localhost:3000/addNewProduct', formDataWithImage ,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
            .then((res) => {
                setImageFileName(res.data);
                navigate('/');
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
            <h2 className="card-title text-center">ADD NEW PRODUCT</h2>
    
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
                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">
                                        Image <span className="required">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="image"
                                        name="image"
                                        accept="*"
                                        onChange={handleImageChange}
                                        required
                                    />
                </div>
                <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">ADD</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}
