import { apiSlice } from "./apiSlice";

const brandApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getBrands : builder.query({
            query: ()=>({
                url: "/brand/get-brands",
                method:"GET",
            })
        }),
        addBrand : builder.mutation({
            query: (payload)=>({
                url: "/brand/add-brand",
                method:"POST",
                body: payload,
            })
        }),
        updateBrand : builder.mutation({
            query: ({id, payload})=>({
                url: `/brand/update-brand/${id}`,
                method:"PUT",
                body: payload,
            })
        }),
        deleteBrand : builder.mutation({
            query: (data)=>({
                url: `/brand/delete-brand/${data._id}`,
                method:"DELETE",
            })
        }),
    })
});

export const {useAddBrandMutation, useGetBrandsQuery, useUpdateBrandMutation, useDeleteBrandMutation} = brandApiSlice;
