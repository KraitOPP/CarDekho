import { apiSlice } from "./apiSlice";

const testimonialApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getActiveTestimonials : builder.query({
            query: ()=>({
                url: "/testimonial/active-testimonials",
                method:"GET",
            })
        }),
        getTestimonials : builder.query({
            query: ()=>({
                url: "/testimonial/all-testimonials",
                method:"GET",
            })
        }),
        addTestimonial : builder.mutation({
            query: (payload)=>({
                url: "/testimonial/add-testimonial",
                method:"POST",
                body: payload,
            })
        }),
        updateTestimonial : builder.mutation({
            query: ({id, payload})=>({
                url: `/testimonial/modify-status/${id}`,
                method:"PUT",
                body: payload,
            })
        }),
        deleteTestimonial : builder.mutation({
            query: (data)=>({
                url: `/testimonial/admin-delete-testimonial/${data._id}`,
                method:"DELETE",
            })
        }),
    })
});

export const {useGetActiveTestimonialsQuery, useGetTestimonialsQuery, useAddTestimonialMutation, useUpdateTestimonialMutation, useDeleteTestimonialMutation} = testimonialApiSlice;
