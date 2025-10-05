import {RouteProps} from "react-router-dom";
import React from "react";
import UserPage from "pages/UserPage/ui/UserPage";
import {LoginPage} from "pages/LoginPage";
import {CoursePage} from "pages/CoursePage";
import {ArticlePage} from "pages/ArticlePage";
import {CourseListPage} from "pages/CourseListPage";
import {ReportPage} from "pages/ReportPage";

export enum AppRoutes {
    COURSE_LIST = 'COURSE_LIST',
    ARTICLE_LIST = 'ARTICLE_LIST',
    ARTICLE_CREATE = 'ARTICLE_CREATE',
    ARTICLE_UPDATE = 'ARTICLE_UPDATE',
    REPORT = 'REPORT',
    USER = 'USER',
    LOGIN = 'LOGIN',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.COURSE_LIST]: '/',
    [AppRoutes.COURSE_LIST]: '/course_list',
    [AppRoutes.ARTICLE_LIST]: '/course_list/:id',
    [AppRoutes.ARTICLE_UPDATE]: '/course_list/:id/:id',
    [AppRoutes.ARTICLE_CREATE]: '/article_list/create',
    [AppRoutes.REPORT]: '/report',
    [AppRoutes.USER]: '/user',
    [AppRoutes.LOGIN]: '/login',
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.USER]: {
        path: RoutePath.USER,
        element: <UserPage/>
    },
    [AppRoutes.COURSE_LIST]: {
        path: RoutePath.COURSE_LIST,
        element: <CourseListPage/>
    },
    [AppRoutes.ARTICLE_LIST]: {
        path: RoutePath.ARTICLE_LIST,
        element: <CoursePage/>
    },
    [AppRoutes.ARTICLE_CREATE]: {
        path: RoutePath.ARTICLE_CREATE,
        element: <ArticlePage/>
    },
    [AppRoutes.ARTICLE_UPDATE]: {
        path: RoutePath.ARTICLE_UPDATE,
        element: <ArticlePage/>
    },
    [AppRoutes.LOGIN]: {
        path: RoutePath.LOGIN,
        element: <LoginPage/>
    },
    [AppRoutes.REPORT]: {
        path: RoutePath.REPORT,
        element: <ReportPage/>
    },
}