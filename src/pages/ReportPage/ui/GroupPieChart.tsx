import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import {CalculatedTestModel} from "entities/CalculatedTestModel";

type PropsType = {
    data: CalculatedTestModel[]
}

export const GroupPieChart = (props:PropsType) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        let preparedRecords:{question: string, user: string, points: number}[] = [];
        props.data.forEach((record) => {
            record.test_user_question_answer_list.forEach((questionUserPoints) => {
                let preparedRecord = preparedRecords.find((preparedRecord) =>
                    preparedRecord.question === questionUserPoints.question.title &&
                    preparedRecord.user === questionUserPoints.user.username
                );
                if (preparedRecord == undefined) {
                    let preparedQuestionUserPoints = {
                        question: questionUserPoints.question.title,
                        user: questionUserPoints.user.username,
                        points: 0
                    };
                    if (questionUserPoints.answer.isCorrect) preparedQuestionUserPoints.points += 1;
                    preparedRecords.push(preparedQuestionUserPoints);
                } else {
                    if (questionUserPoints.answer.isCorrect) preparedRecord.points += 1;
                }
           });
        });
        setData(preparedRecords);
    }, []);

    console.log(data)

    const config = {
        data,
        xField: 'question',
        yField: 'points',
        seriesField: 'user',
        legend: {
            position: 'top',
        },
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };

    //@ts-ignore
    return <Line style={{width: "65vw"}} {...config} />;
};
