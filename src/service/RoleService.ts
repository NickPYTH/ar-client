import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {UserModel} from "entities/UserModel";

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/user`,
    }),
    tagTypes: ['user'],
    endpoints: (build) => ({
        getAll: build.mutation<UserModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['user']
        }),
        get: build.mutation<UserModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['user']
        }),
        update: build.mutation<UserModel, UserModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['user']
        }),
        create: build.mutation<UserModel, UserModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['user']
        }),
    })
});
