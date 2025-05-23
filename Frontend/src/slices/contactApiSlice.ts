import { apiSlice } from "./apiSlice";

const contactApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getContactInfo : builder.query({
            query: ()=>({
                url: "/contact-info/",
                method:"GET",
            })
        }),
        getContactQueries : builder.query({
            query: ()=>({
                url: "/contact/all",
                method:"GET",
            })
        }),
        addContactQuery : builder.mutation({
            query: (payload)=>({
                url: "/contact/submit",
                method:"POST",
                body: payload,
            })
        }),
        replyQuery : builder.mutation({
            query: ({id, payload})=>({
                url: `/contact/response/${id}`,
                method:"POST",
                body: payload,
            })
        }),
        updateContactQueryStatus: builder.mutation({
            query: ({id, payload})=>({
                url: `/contact/update-status/${id}`,
                method:"PUT",
                body: payload,
            })
        }),
        updateContactInfo : builder.mutation({
            query: (payload)=>({
                url: `/contact-info/update`,
                method:"PUT",
                body: payload,
            })
        }),
        deleteContactQuery : builder.mutation({
            query: (id)=>({
                url: `/contact/delete/${id}`,
                method:"DELETE",
            })
        })
    })
});

export const {useGetContactInfoQuery, useGetContactQueriesQuery, useAddContactQueryMutation, useUpdateContactInfoMutation, useUpdateContactQueryStatusMutation, useReplyQueryMutation, useDeleteContactQueryMutation} = contactApiSlice;
