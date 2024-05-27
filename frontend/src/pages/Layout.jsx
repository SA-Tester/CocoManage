import React from 'react';
import Navbar2 from '../components/navbar/Navbar2';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar2 />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}

export default Layout;