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
        getProfileInfo : builder.query({
            query: ()=>({
                url: "/user",
                method:"GET",
            })
        }),
        updateProfile : builder.mutation({
            query: (data)=>({
                url: "/user/update",
                method:"PUT",
                body: data,
            })
        }),
        updatePassword: builder.mutation({
            query: (data)=>({
                url: "/user/update-password",
                method: "PUT",
                body:data
            })
        }),
        logout : builder.mutation({
            query: ()=>({
                url:"/user/logout",
                method:"POST",
            })
        })
    })
});

export const {useLoginMutation, useRegisterMutation, useUpdateProfileMutation, useUpdatePasswordMutation, useLogoutMutation, useGetProfileInfoQuery} = authApiSlice