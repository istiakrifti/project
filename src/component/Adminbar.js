import React, { useState } from 'react';
import { Link, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { useUser } from './UserCntxt'; 

export default function AdminBar(props) {
    const { userRole } = useUser();

    return (
        <>
            {userRole === 'admin' ? (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid d-flex justify-content-center">
                    <Link className="navbar-brand me-5" to="/checkUsers">
                    <b style = {{color:'yellow'}}> Check Users</b>
                    </Link>
                    <Link className="navbar-brand me-5" to="/addNewProduct">
                            <b style = {{color:'yellow'}}>Add New Product</b>
                    </Link>
                    <Link className="navbar-brand me-5" to="/pendingPurchase">
                    <b style = {{color:'yellow'}}> Approve Purchase</b>
                    </Link>
                    </div>
                </nav>
            ) : (
                <></> 
            )}
        </>
    );
}
