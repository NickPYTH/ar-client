import {ArticleModel} from "entities/ArticleModel";

export type CourseModel = {
    id: number | null;
    title: string;
    description: string;
    theories: ArticleModel[];
}