import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ category, subcategories }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [showSubSubmenu, setShowSubSubmenu] = useState(false);

  const handleMouseEnter = () => {
    setShowSubmenu(true);
    
  };

  const handleMouseLeave = () => {
    setShowSubmenu(false);
  };
  const handleMouseEnter1 = () => {
    setShowSubSubmenu(true);
  };

  const handleMouseLeave1 = () => {
    setShowSubSubmenu(false);
  };

  return (
    <li
      className="menu-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link className='menu-link' to = {`/showmenuproducts?category=${category}`}>{category}</Link>
      {subcategories && subcategories.length > 0 && showSubmenu && (
        <ul className="submenu">
          {subcategories.map((item) => (
            <li key={`${category}-${subcategories.subcategory}`} 
                className="submenu-item"
                onMouseEnter={handleMouseEnter1}
                onMouseLeave={handleMouseLeave1}
            ><Link className='submenu-link' to = {`/showmenuproducts?category=${category}&subcategory=${item.subcategory}`}>
              {item.subcategory}</Link>
              {item.brands && item.brands.length > 0 && showSubSubmenu && item.brands[0] !== item.subcategory && (
                <ul className='subsubmenu'>
                    {
                        item.brands
                        .map((item1)=>(
                            <li key={`${category}-${subcategories.subcategory}-${item1}`} className='subsubmenu-item'><Link className='subsubmenu-link' to = {`/showmenuproducts?category=${category}&subcategory=${item.subcategory}&brand=${item1}`}>{item1}</Link></li>
                        ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
