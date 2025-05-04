import {ArticleModel} from "entities/ArticleModel";

export type CourseModel = {
    id: number;
    title: string;
    description: string;
    theories: ArticleModel[];
}