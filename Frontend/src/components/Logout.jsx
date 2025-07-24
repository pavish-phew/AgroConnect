import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('currentuser');
        navigate("/login");
    }, [navigate]); 

    return null; 
}

export default Logout;
