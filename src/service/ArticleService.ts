import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants"
import {ArticleModel} from "entities/ArticleModel";

export const articleAPI = createApi({
    reducerPath: 'articleAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/articles`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['user'],
    endpoints: (build) => ({
        getAll: build.mutation<ArticleModel[], void>({
            query: () => ({
                url: `/`,
                method: 'GET'
            }),
            invalidatesTags: ['user']
        }),
    })
});
