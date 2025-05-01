import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";

export type GetTokenResponseType = {
    refresh?: string,
    access?: string,
    detail?: string
}

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/auth/token`,
    }),
    tagTypes: ['user'],
    endpoints: (build) => ({
        create: build.mutation<GetTokenResponseType, {username: string, password: string}>({
            query: (body) => ({
                url: `/`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['user']
        }),
    })
});
