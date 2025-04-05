import { apiSlice } from "./apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        login : builder.mutation({
            query: (data)=>({
                url: "/user/signin",
                method:"POST",
                body: data,
            })
        }),
        register : builder.mutation({
            query: (data)=>({
                url: "/user/signup",
                method:"POST",
                body: data,
            })
        }),
        sendVerifyCode : builder.mutation({
            query: (data)=>({
                url: "/auth/send-code",
                method:"POST",
                body: data,
            })
        }),
        forgetPassword : builder.mutation({
            query: (data)=>({
                url: "/auth/verify-code",
                method:"POST",
                body: data,
            })
        }),
        logout : builder.mutation({
            query: ()=>({
                url:"/auth/sign-out",
                method:"POST",
            })
        })
    })
});

export const {useLoginMutation, useRegisterMutation,useSendVerifyCodeMutation,useForgetPasswordMutation, useLogoutMutation} = authApiSlice