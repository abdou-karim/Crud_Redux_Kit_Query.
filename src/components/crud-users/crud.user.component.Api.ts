import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {UsersModel} from "../../models/Users.model";

// Define a service using a base URL and expected endpoints
export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({ baseUrl: ' http://localhost:3000/'}),
    endpoints: (builder) => ({
        getAllUsers: builder.query<UsersModel[] | any, string>({
            query: () => `users`,
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllUsersQuery } = usersApi