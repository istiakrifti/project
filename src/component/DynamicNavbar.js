import React,{useEffect,useState} from 'react';
import MenuItem from './MenuItem';
import './DynamicNavbar.css'
import axios from 'axios';

const Navbar = () => {
    const [data, setData] = useState({
        info: []
      });
    
      useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/');
          setData({ info: response.data.result1 });
        } catch (error) {
          console.log(error);
        }
      };

      
    const [menuData, setMenuData] = useState([]); 

    
    useEffect(() => {
        const processedMenuData = processData(data.info);
        setMenuData(processedMenuData);
      }, [data]);
      
    const processData = (rawData) => {
        const processedData = [];
        rawData.forEach((item) => {
          const { CATEGORY, SUBCATEGORY, BRAND } = item;
    
          const existingCategory = processedData.find((group) => group.category === CATEGORY);
          if (!existingCategory) {
            processedData.push({ category: CATEGORY, subcategories: [{ subcategory: SUBCATEGORY, brands: [BRAND] }] });
          } else {
            const existingSubcategory = existingCategory.subcategories.find(
              (sub) => sub.subcategory === SUBCATEGORY
            );
            if (!existingSubcategory) {
              existingCategory.subcategories.push({ subcategory: SUBCATEGORY, brands: [BRAND] });
            } else {
                const existingBrand = existingSubcategory.brands.includes(BRAND);
                
                if (!existingBrand ) {
                  existingSubcategory.brands.push(BRAND);
                
            }
            }
          }
          
        });
        
        return processedData;
      };
      localStorage.setItem('MenuData',JSON.stringify(menuData));
      
  return (
    
    <nav className="navbar ">
      <ul className="main-menu">
        {menuData.map((item, index) => (
          <MenuItem key={index} category={item.category} subcategories={item.subcategories}  />
        ))}
      </ul>
    </nav>

  );
};

export default Navbar;
