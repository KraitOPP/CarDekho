import { apiSlice } from "./apiSlice";

const vehicleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getVehicles : builder.query({
            query: ()=>({
                url: "/vehicle/get-vehicles",
                method:"GET",
            })
        }),
        addVehicle : builder.mutation({
            query: (payload)=>({
                url: "/vehicle/add-vehicle",
                method:"POST",
                body: payload,
            })
        }),
        updateVehicle : builder.mutation({
            query: ({id, payload})=>({
                url: `/vehicle/update-vehicle/${id}`,
                method:"PUT",
                body: payload,
            })
        }),
        deleteVehicle : builder.mutation({
            query: (data)=>({
                url: `/vehicle/delete-vehicle/${data._id}`,
                method:"DELETE",
            })
        }),
    })
});

export const {useGetVehiclesQuery, useAddVehicleMutation, useUpdateVehicleMutation, useDeleteVehicleMutation} = vehicleApiSlice;
