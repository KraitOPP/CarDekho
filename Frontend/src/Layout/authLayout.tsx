import { useEffect } from 'react';
import { toast, Toaster } from "sonner"
import { selectUser } from '@/slices/authSlice';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'

export default function AuthLayout(){

    const navigate = useNavigate();
    const userInfo = useSelector(selectUser);

    useEffect(() => {
        if (userInfo){
            toast.warning("Already Signed In");
            navigate('/', { replace: true });
        }
    }, [userInfo, navigate]);

    return (
        <>
            <Toaster />
            <Outlet />
        </>
    )
}