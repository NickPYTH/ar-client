import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants"
import {ArticleModel} from "entities/ArticleModel";
import {ArticleItemType} from "pages/ArticlePage/ui/ArticlePage";

export const articleAPI = createApi({
    reducerPath: 'articleAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/api/theories`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access');
            if (token)
                headers.set('authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['user'],
    endpoints: (build) => ({
        getAll: build.mutation<ArticleModel[], number>({
            query: (id) => ({
                url: `/${id}/`,
                method: 'GET'
            }),
            invalidatesTags: ['user']
        }),
        get: build.mutation<ArticleModel, number>({
            query: (id) => ({
                url: `/${id}/`,
                method: 'GET'
            }),
            invalidatesTags: ['user']
        }),
        create: build.mutation<void, ArticleModel>({
            query: (body) => ({
                url: `/`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['user']
        }),
        delete: build.mutation<void, number>({
            query: (id) => ({
                url: `/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['user']
        }),
    })
});
