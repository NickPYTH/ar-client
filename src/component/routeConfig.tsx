import {RouteProps} from "react-router-dom";
import React from "react";
import UserPage from "pages/UserPage/ui/UserPage";
import {LoginPage} from "pages/LoginPage";
import {ArticleListPage} from "pages/ArticleListPage";
import {ArticlePage} from "pages/ArticlePage";

export enum AppRoutes {
    ARTICLE_LIST = 'ARTICLE_LIST',
    ARTICLE_CREATE = 'ARTICLE_CREATE',
    USER = 'USER',
    LOGIN = 'LOGIN',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.ARTICLE_LIST]: '/',
    [AppRoutes.ARTICLE_LIST]: '/article_list',
    [AppRoutes.ARTICLE_CREATE]: '/article_list/create',
    [AppRoutes.USER]: '/user',
    [AppRoutes.LOGIN]: '/login',
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.USER]: {
        path: RoutePath.USER,
        element: <UserPage/>
    },
    [AppRoutes.ARTICLE_LIST]: {
        path: RoutePath.ARTICLE_LIST,
        element: <ArticleListPage/>
    },
    [AppRoutes.ARTICLE_CREATE]: {
        path: RoutePath.ARTICLE_CREATE,
        element: <ArticlePage/>
    },
    [AppRoutes.LOGIN]: {
        path: RoutePath.LOGIN,
        element: <LoginPage/>
    },
}