import { useEffect } from 'react';
import { toast, Toaster } from "sonner"
import { Outlet, useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux';
// import { selectUser } from '@/slices/authSlice';

export default function AuthLayout(){

    const navigate = useNavigate();
    // const userInfo = useSelector(selectUser);

    // useEffect(() => {
    //     if (userInfo){
    //         toast("Already Signed In",{
    //            description: "Redirecting to Menu",
    //            action:{

    //            } 
    //         });
    //         navigate('/menu', { replace: true });
    //     }
    // }, []);

    return (
        <>
            <Toaster />
            <Outlet />
        </>
    )
}