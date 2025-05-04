import {Button, Card, Flex, Space} from "antd";
import React, {useEffect, useState} from "react";
import {ArticleModel} from "entities/ArticleModel";
import {Navigate, useNavigate} from "react-router-dom";
import {courseAPI} from "service/CourseService";
import {CourseModel} from "entities/CourseModel";

const CourseListPage = () => {

    // States
    const [shouldRedirectToCreate, setShouldRedirectToCreate] = useState(false);
    const navigate = useNavigate();
    // -----

    // Web requests
    const [getCourses, {
        data: courses,
    }] = courseAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getCourses();
    }, []);
    // -----

    if (shouldRedirectToCreate) return (<Navigate to="create" />);
    return(
        <Flex vertical align={'center'} style={{width: window.innerWidth}}>
            <Space direction={'vertical'} align={'center'}>
                {courses?.map((article:CourseModel) => (
                    <Card style={{width: 350}}>
                        <Space direction={'vertical'}>
                            <div><strong>Тема:</strong> {article.title}</div>
                            <Button onClick={() => navigate(article.id.toString())}>Открыть</Button>
                        </Space>
                    </Card>
                ))}
                <Button type={'primary'} onClick={() => setShouldRedirectToCreate(true)}>Добавить курс</Button>
            </Space>
        </Flex>
    )
}

export default CourseListPage;