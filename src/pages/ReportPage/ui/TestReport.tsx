import {CalculatedTestModel} from "entities/CalculatedTestModel";
import {Divider, Flex, Table, TableProps, Typography} from "antd";
import React, {useEffect} from "react";
import {GroupPieChart} from "./GroupPieChart";

type PropsType = {
    data: CalculatedTestModel[];
    selectedGroupId: number;
    selectedTestId: number;
};

const {Text} = Typography;

export const TestReport = (props: PropsType) => {

    const [filteredData, setFilteredData] = React.useState<CalculatedTestModel[]>([]);

    useEffect(() => {
        setFilteredData(props.data.filter((record) => {
            if (record.user.groups.length == 0) return false;
            return record.user.groups[0].id == props.selectedGroupId && record.test.id == props.selectedTestId.toString();
        }));
    }, []);

    const columns: TableProps<CalculatedTestModel>['columns'] = [
        {
            title: 'Пользователь',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => (<div>{record.user.username}</div>),
        },
        {
            title: 'Группа',
            dataIndex: 'user',
            key: 'group',
            render: (_, record) => (<div>{record.user.groups.length > 0 ? record.user.groups[0].name : ""}</div>),
        },
        {
            title: 'Экзамен',
            dataIndex: 'title',
            key: 'title',
            render: (_, record) => (<div>{record.test.title}</div>),
        },
        {
            title: 'Результат',
            dataIndex: 'test_user_question_answer_list',
            key: 'mark',
            render: (_, record) => {
                let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                    if (result.answer.isCorrect) return acc + 1;
                    return acc;
                }, 0);
                return (<div>{(goodAnswersCount / record.test.questions.length * 100)}%</div>);
            },
        },
    ];

    return (
        <Flex vertical gap={'small'}>
            <Table
                bordered
                style={{width: '100vw'}}
                columns={columns}
                pagination={false}
                dataSource={filteredData}
            />
            <Divider />
            <Flex justify={'space-between'}>
                <Flex vertical gap={'small'} style={{height: 300}}>
                    <Text strong>Общий итог по учебной группе</Text>
                    <Text>Количество человек в группе: {filteredData.length}</Text>
                    <Text>Количество сдавших экзамен: {
                        filteredData.filter((record) => {
                            let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                                if (result.answer.isCorrect) return acc + 1;
                                return acc;
                            }, 0);
                            return goodAnswersCount / record.test.questions.length >= 0.6;
                        }).length
                    }</Text>
                    <Text>Количество не сдавших экзамен: {
                        filteredData.filter((record) => {
                            let goodAnswersCount = record.test_user_question_answer_list.reduce((acc: number, result) => {
                                if (result.answer.isCorrect) return acc + 1;
                                return acc;
                            }, 0);
                            return goodAnswersCount / record.test.questions.length < 0.6;
                        }).length
                    }</Text>
                </Flex>
                {filteredData.length > 0 &&
                    <GroupPieChart data={filteredData}/>
                }
            </Flex>
        </Flex>
    )
}