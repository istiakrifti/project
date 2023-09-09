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
                            Check Users
                    </Link>
                    <Link className="navbar-brand me-5" to="/addNewProduct">
                            Add New Product
                    </Link>
                    <Link className="navbar-brand me-5" to="/pendingPurchase">
                            Approve Purchase
                    </Link>
                    </div>
                </nav>
            ) : (
                <></> 
            )}
        </>
    );
}
