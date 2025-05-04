import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants"
import {ArticleModel} from "entities/ArticleModel";
import {CourseModel} from "entities/CourseModel";

export const courseAPI = createApi({
    reducerPath: 'courseAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/courses`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['user'],
    endpoints: (build) => ({
        getAll: build.mutation<CourseModel[], void>({
            query: () => ({
                url: `/`,
                method: 'GET'
            }),
            invalidatesTags: ['user']
        }),
        get: build.mutation<CourseModel, number>({
            query: (id) => ({
                url: `/${id}/`,
                method: 'GET'
            }),
            invalidatesTags: ['user']
        }),
    })
});
