import {AnswerModel} from "entities/AnswerModel";

export type QuestionModel = {
    id: number;
    title: string;
    description: string;
    answers: AnswerModel[];
}