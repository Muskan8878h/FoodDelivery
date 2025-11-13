import React, { Children } from 'react'
import  {Navigate} from 'react-router-dom'

const PrivateRoute=({Children})=>{
    const isAuthenticatied =Boolean(localStorage.getItem('loginData'));
    return isAuthenticatied ? Children : <Navigate to='/login' replace />;
}

export default PrivateRoute;