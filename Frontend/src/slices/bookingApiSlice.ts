import { apiSlice } from "./apiSlice";

const bookingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getAllBookings : builder.query({
            query: ()=>({
                url: "/booking/all",
                method:"GET",
            })
        }),
        getBookingById : builder.query({
            query: (id)=>({
                url: `/booking/info/${id}`,
                method:"GET",
            })
        }),
        getUserBookings : builder.query({
            query: ()=>({
                url: "/booking/history",
                method:"GET",
            })
        }),
        addBooking : builder.mutation({
            query: (payload)=>({
                url: "/booking/book",
                method:"POST",
                body: payload,
            })
        }),
        rateBooking : builder.mutation({
            query: ({id, payload})=>({
                url: `/booking/rate/${id}`,
                method:"POST",
                body: payload,
            })
        }),
        cancelBooking : builder.mutation({
            query: ({id, payload})=>({
                url: `/booking/cancel/${id}`,
                method:"PUT",
                body: payload,
            })
        }),
        updateBookingStatus : builder.mutation({
            query: ({id, payload})=>({
                url: `/booking/status/${id}`,
                method:"PUT",
                body: payload,
            })
        }),
        updatePaymentStatus : builder.mutation({
            query: ({id, payload})=>({
                url: `/booking/payment/${id}`,
                method:"PUT",
                body: payload,
            })
        })
    })
});

export const {useGetAllBookingsQuery, useGetUserBookingsQuery, useGetBookingByIdQuery, useAddBookingMutation, useRateBookingMutation, useCancelBookingMutation, useUpdateBookingStatusMutation, useUpdatePaymentStatusMutation} = bookingApiSlice;
