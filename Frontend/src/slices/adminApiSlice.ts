import { apiSlice } from "./apiSlice";

const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
       getDashboardInfo : builder.query({
            query: ()=>({
                url: "/admin/stats",
                method:"GET",
            })
        }),
    })
});

export const {useGetDashboardInfoQuery} = adminApiSlice