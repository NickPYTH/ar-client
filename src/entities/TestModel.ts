import {QuestionModel} from "entities/QuestionModel";

export type TestModel = {
    id: string;
    title: string;
    description: string;
    questions: QuestionModel[];
}