import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShowMenuProducts.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import StarRating from './Assets/StarRating';

const ShowMenuProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const subcategory = queryParams.get('subcategory') || 'DefaultSubcategory';
  const brand = queryParams.get('brand') || 'DefaultBrand';
  const [Brands,setBrands]=useState([]);
  let flag=0;
  const [data, setData] = useState({
    info: []
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedProcessors, setSelectedProcessors] = useState([]);
  const [selectedRams, setSelectedRams] = useState([]);
  const [selectedDisplay, setSelectedDisplay] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedGraphics, setSelectedGraphics] = useState([]);

  // useEffect(()=>{
    
  //     resetFilters();
    
  // },[]);
  useEffect(() => {
    
    fetchData();
    
  }, [category,subcategory,brand]);

  function fetchData() {
    
      axios
      .post('http://localhost:3000/showmenuproducts', {
        category: category,
        subcategory: subcategory,
        brand: brand,
      })
      .then((res) => {
        setBrands(res.data.result1);
        setData({ info: res.data.result });
      })
      .catch((err) => console.log(err));
      
      setMinPrice(0);
      setMaxPrice(1000000);
      setSelectedSubcategories([]);
      setSelectedBrands([]);
      setSelectedProcessors([]);
      setSelectedDisplay([]);
      setSelectedGraphics([]);
      setSelectedRams([]);
      setSelectedStorage([]);
  }
  
  function showfilteredproducts()
  {
    axios
      .post('http://localhost:3000/showfilteredproducts', {
        category:category,
        subcategory:subcategory,
        selectedSubcategories:selectedSubcategories,
        selectedBrands:selectedBrands,
        selectedProcessors:selectedProcessors,
        selectedRams:selectedRams,
        selectedDisplay:selectedDisplay,
        selectedStorage:selectedStorage,
        selectedGraphics:selectedGraphics,
        minPrice:minPrice,
        maxPrice:maxPrice
      })
      .then((res) => {
        
        setData({ info: res.data });
        
      })
      .catch((err) => console.log(err));
  }
  function showDetails(item) {
    navigate(`/showdetails?itemId=${item.ID}`);
  }
  
  const handleSubcategoryChange = (e) => {
    const subcategoryValue = e.target.value;
    if (e.target.checked) {
      setSelectedSubcategories((prevSelected) => [...prevSelected, subcategoryValue]);
    } else {
      setSelectedSubcategories((prevSelected) => prevSelected.filter((item) => item !== subcategoryValue));
    }
  };

  const handleBrandChange = (e) => {
    const brandValue = e.target.value;
    if (e.target.checked) {
      setSelectedBrands((prevSelected) => [...prevSelected, brandValue]);
    } else {
      setSelectedBrands((prevSelected) => prevSelected.filter((item) => item !== brandValue));
    }
  };

  const handleCheckboxChange = (e, filterName) => {
    const filterValue = e.target.value;
    if(filterName==='Processor')
    {
      if (e.target.checked) {
        setSelectedProcessors((prevSelected) => [...prevSelected, filterValue]);
      } else {
        setSelectedProcessors((prevSelected) => prevSelected.filter((item) => item !== filterValue));
      }
    }
    if(filterName==='Ram')
    {
      if (e.target.checked) {
        setSelectedRams((prevSelected) => [...prevSelected, filterValue]);
      } else {
        setSelectedRams((prevSelected) => prevSelected.filter((item) => item !== filterValue));
      }
    }
    if(filterName==='Display')
    {
      if (e.target.checked) {
        setSelectedDisplay((prevSelected) => [...prevSelected, filterValue]);
      } else {
        setSelectedDisplay((prevSelected) => prevSelected.filter((item) => item !== filterValue));
      }
    }
    if(filterName==='Storage')
    {
      if (e.target.checked) {
        setSelectedStorage((prevSelected) => [...prevSelected, filterValue]);
      } else {
        setSelectedStorage((prevSelected) => prevSelected.filter((item) => item !== filterValue));
      }
    }
    if(filterName==='Graphics')
    {
      if (e.target.checked) {
        setSelectedGraphics((prevSelected) => [...prevSelected, filterValue]);
      } else {
        setSelectedGraphics((prevSelected) => prevSelected.filter((item) => item !== filterValue));
      }
    }
  };

  

  const laptop_filters = {
    'Processor': ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'AMD Athlon', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Pentium'],
    'Ram': ['2GB', '4GB', '8GB', '16GB', '32GB'],
    'Display': ['13.3', '14', '15.6'],
    'Storage': ['256GB', '512GB', '1TB', '1 TB'],
    'Graphics': ['Radeon', 'GTX1650', 'GTX 1650', 'GTX 1660', 'RTX 2060', 'RTX 2070', 'RTX 2080', 'RTX 3050', 'RTX 3060', 'RTX 3070', 'RTX 3080', 'MX450', 'Integrated', 'Iris', 'UHD']
  };
  const desktop_filters = {
    'Processor': ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'AMD Athlon', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Pentium'],
    'Ram': ['2GB', '4GB', '8GB', '16GB', '32GB'],
    'Storage': ['256GB', '512GB', '1TB', '1 TB'],
    'Graphics': ['Radeon', 'GTX1650', 'GTX1650', 'GTX 1660', 'RTX 2060', 'RTX 2070', 'RTX 2080', 'RTX 3050', 'RTX 3060', 'RTX 3070', 'RTX 3080', 'MX450', 'Integrated', 'Iris', 'UHD']
  };
  const menuData=JSON.parse(localStorage.getItem('MenuData'));
  console.log(Brands);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3 filter-section">
          <h2 className="filter-title">Filter</h2>
          <div className="mb-3">
            <h3>Price Range</h3>
            <div className="d-flex">
              <input
                type="number"
                className="form-control me-2"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              
            </div>
            <Slider
              range
              min={0}
              max={100000} 
              value={[minPrice, maxPrice]}
              onChange={(newRange) => {
                setMinPrice(newRange[0]);
                setMaxPrice(newRange[1]);
              }}
            />
          </div>
          {subcategory === 'DefaultSubcategory' ? <h3>Subcategory</h3>:''}
          {subcategory === 'DefaultSubcategory' ? 
              (menuData.find(item => item.category === category)?.subcategories || []).map(item1 => (
              <div className="filter-item" key={item1.subcategory}>
                
                <ul className="filter-list">
                    <li key={item1.subcategory}>
                      <input
                        type="checkbox"
                        id={item1.subcategory}
                        name={item1.subcategory}
                        value={item1.subcategory}
                        className="filter-checkbox"
                        onChange={handleSubcategoryChange}
                      />
                      <label htmlFor={item1.subcategory} className="filter-label">
                        {item1.subcategory}
                      </label>
                    </li>
                  
                </ul>
              </div>
            )):''
          }{(category!=='Monitor' && category!=='Tablet') && (
            <div>
          {subcategory==='DefaultSubcategory' || brand==='DefaultBrand'?
          <h3>Brand</h3>:""}
          {subcategory === 'DefaultSubcategory' ? 
              Brands.map(item1 => (
              <div className="filter-item" key={item1.BRAND}>
                
                <ul className="filter-list">
                    <li key={item1.BRAND}>
                      <input
                        type="checkbox"
                        id={item1.BRAND}
                        name={item1.BRAND}
                        value={item1.BRAND}
                        className="filter-checkbox"
                        onChange={handleBrandChange}
                      />
                      <label htmlFor={item1.BRAND} className="filter-label">
                        {item1.BRAND}
                      </label>
                    </li>
                  
                </ul>
              </div>
            )):''
          }</div>)}
          {(category!=='Monitor' && category!=='Tablet') && (
            <div>
          {brand === 'DefaultBrand' ? 
              (menuData.find(item => item.category === category)?.subcategories|| [])
              
              .find(ite=> ite.subcategory===subcategory && ite.brands[0]!==subcategory)?.brands
              .map(item1 => (
                
              <div className="filter-item" key={item1}>
                
                <ul className="filter-list">
                    <li key={item1}>
                      <input
                        type="checkbox"
                        id={item1}
                        name={item1}
                        value={item1}
                        className="filter-checkbox"
                        onChange={handleBrandChange}
                      />
                      <label htmlFor={item1} className="filter-label">
                        {item1}
                      </label>
                    </li>
                </ul>
              </div>
            )):''
          }</div>)}
          { (category === 'Laptop' || category === 'Desktop') && Object.keys(category === 'Laptop' ? laptop_filters : desktop_filters).map((item) => (
            <div className="filter-item" key={item}>
              <h3>{item}</h3>
              <ul className="filter-list">
                {category === 'Laptop' ? laptop_filters[item].map((option) => (
                  <li key={option}>
                    <input
                      type="checkbox"
                      id={option}
                      name={option}
                      value={option}
                      className="filter-checkbox"
                      onChange={(e) => handleCheckboxChange(e, item)}
                    />
                    <label htmlFor={option} className="filter-label">
                      {option}
                    </label>
                  </li>
                )) : desktop_filters[item].map((option) => (
                  <li key={option}>
                    <input
                      type="checkbox"
                      id={option}
                      name={option}
                      value={option}
                      className="filter-checkbox"
                      onChange={(e) => handleCheckboxChange(e, item)}
                    />
                    <label htmlFor={option} className="filter-label">
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button className="btn btn-primary" onClick={showfilteredproducts}>Apply</button>
        </div>
        <div className="col-md-9">
          {/* Right div for displaying products */}
          <h2>Showing results for : {category}{subcategory === 'DefaultSubcategory' ? '' :'/'+ subcategory}{brand === 'DefaultBrand' ? '' :'/'+ brand}</h2>
          <div className="Products">
            {data.info.length > 0 ? (
              data.info.map((item) => (
                <div className="Product" key={item.ID}>
                  <img src={require('../image/' + item.IMG_URL)} alt="ProductImage" style={{ width: '200px', height: '150px' }} />
                  <StarRating rating={item.RATING} />
                  <div className="Description">
                    <p>
                      <b>{item.NAME} </b>
                    </p>
                    
              {
                item.DISCOUNT > 0 ?(<p><b style={{ color: 'red' }}><del>&#2547;{item.BASE_PRICE}</del><b>{' '}</b>&#2547;{item.BASE_PRICE-(item.BASE_PRICE*(item.DISCOUNT/100))}</b></p>):(<p><b style={{ color: 'red' }}>&#2547;{item.BASE_PRICE}</b></p>)
              }
                    <button type="button" className="btn btn-outline-info" onClick={() => showDetails(item)}>
                      Product Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              'Loading...'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowMenuProducts;
