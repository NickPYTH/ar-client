import {ArticleItemType} from "pages/ArticlePage/ui/ArticlePage";

export type ArticleModel = {
    id: number | null;
    title: string;
    body: string;
    pub_date: string;
    author: string;
    courseId: number;
    articleItemsList: ArticleItemType[];
}