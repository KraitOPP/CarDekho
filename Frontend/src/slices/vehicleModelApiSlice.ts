import { apiSlice } from "./apiSlice";

const vehicleModelApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getVehicleModels : builder.query({
            query: ()=>({
                url: "/vehicle-model/get-vehicle-models",
                method:"GET",
            })
        }),
        addVehicleModel : builder.mutation({
            query: (payload)=>({
                url: "/vehicle-model/add-vehicle-model",
                method:"POST",
                body: payload,
            })
        }),
        updateVehicleModel : builder.mutation({
            query: ({id, payload})=>({
                url: `/vehicle-model/update-vehicle-model/${id}`,
                method:"PUT",
                body: payload,
            })
        }),
        deleteVehicleModel : builder.mutation({
            query: (data)=>({
                url: `/vehicle-model/delete-vehicle-model/${data._id}`,
                method:"DELETE",
            })
        }),
    })
});

export const {useAddVehicleModelMutation, useGetVehicleModelsQuery, useUpdateVehicleModelMutation, useDeleteVehicleModelMutation} = vehicleModelApiSlice;
