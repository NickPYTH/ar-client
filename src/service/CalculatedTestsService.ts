import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants"
import {CalculatedTestModel} from "entities/CalculatedTestModel";

export const calculatedTestsAPI = createApi({
    reducerPath: 'calculatedTestsAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/calculatedTests`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['calculatedTests'],
    endpoints: (build) => ({
        getAll: build.mutation<CalculatedTestModel[], void>({
            query: () => ({
                url: `/`,
                method: 'GET'
            }),
            invalidatesTags: ['calculatedTests']
        }),
        get: build.mutation<CalculatedTestModel, number>({
            query: (id) => ({
                url: `/${id}/`,
                method: 'GET'
            }),
            invalidatesTags: ['calculatedTests']
        }),
        create: build.mutation<void, CalculatedTestModel>({
            query: (body) => ({
                url: `/`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['calculatedTests']
        }),
        delete: build.mutation<void, number>({
            query: (id) => ({
                url: `/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['calculatedTests']
        }),
    })
});
