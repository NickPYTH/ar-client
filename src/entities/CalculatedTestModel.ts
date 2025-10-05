import {UserModel} from "entities/UserModel";
import {QuestionModel} from "entities/QuestionModel";
import {TestModel} from "entities/TestModel";
import {AnswerModel} from "entities/AnswerModel";

export type CalculatedTestModel = {
    id: number;
    user: UserModel;
    test: TestModel;
    test_user_question_answer_list: {
        id: number;
        user: UserModel;
        question: QuestionModel;
        answer: AnswerModel;
    }[];
}