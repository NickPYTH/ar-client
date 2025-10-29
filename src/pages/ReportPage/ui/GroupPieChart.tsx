import React, { useState, useEffect } from 'react';
import {Line, Pie} from '@ant-design/plots';
import {CalculatedTestModel} from "entities/CalculatedTestModel";

type PropsType = {
    data: CalculatedTestModel[]
}

export const GroupPieChart = (props:PropsType) => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        let preparedRecords:{type: string, value: number}[] = [
            {type: "Не сдал", value: 0},
            {type: "Удов", value: 0},
            {type: "Хорошо", value: 0},
            {type: "Отлично", value: 0}
        ];
        props.data.forEach((record) => {
            let correctAnswers = record.test_user_question_answer_list.filter((a) => a.answer.isCorrect).length;
            let percent = correctAnswers / record.test_user_question_answer_list.length;
            if (preparedRecords.find((pr) => pr.type == "Не сдал") && percent < 0.5){
                let preparedRecord = preparedRecords.find((pr) => pr.type == "Не сдал");
                if (preparedRecord) preparedRecord.value += 1;
            }
            if (preparedRecords.find((pr) => pr.type == "Удов") && percent > 0.5 && percent < 0.61){
                let preparedRecord = preparedRecords.find((pr) => pr.type == "Удов");
                if (preparedRecord) preparedRecord.value += 1;
            }
            if (preparedRecords.find((pr) => pr.type == "Хорошо") && percent > 0.61 && percent < 0.81){
                let preparedRecord = preparedRecords.find((pr) => pr.type == "Хорошо");
                if (preparedRecord) preparedRecord.value += 1;
            }
            if (preparedRecords.find((pr) => pr.type == "Отлично") && percent > 0.61 && percent < 0.81){
                let preparedRecord = preparedRecords.find((pr) => pr.type == "Отлично");
                if (preparedRecord) preparedRecord.value += 1;
            }
        });
        setData(preparedRecords);
    }, [props]);

    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'type',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: true,
                position: 'left',
                rowPadding: 5,
            },
        },
    };

    return <Pie {...config} />;
};
