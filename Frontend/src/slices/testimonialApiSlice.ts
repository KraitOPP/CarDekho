import { apiSlice } from "./apiSlice";

const testimonialApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        addTestimonial : builder.mutation({
            query: (data)=>({
                url: "/testimonial/add-testimonial",
                method:"POST",
                body: data,
            })
        }),
    })
});

export const {useAddTestimonialMutation} = testimonialApiSlice