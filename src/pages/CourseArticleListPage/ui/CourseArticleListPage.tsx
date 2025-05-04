import {Button, Card, Flex, Space} from "antd";
import {articleAPI} from "service/ArticleService";
import React, {useEffect, useState} from "react";
import {ArticleModel} from "entities/ArticleModel";
import {Navigate, useNavigate} from "react-router-dom";
import {courseAPI} from "service/CourseService";

const CourseArticleListPage = () => {

    // States
    const [shouldRedirectToCreate, setShouldRedirectToCreate] = useState(false);
    const navigate = useNavigate();
    const [id] = useState<number | null>(() => {
        let num = window.location.pathname.split('/')[2];
        if (Number.isNaN(Number(num))) return null;
        else return Number(num);
    });
    // -----

    // Web requests
    const [getCourseArticles, {
        data: course,
    }] = courseAPI.useGetMutation();
    // -----

    // Effects
    useEffect(() => {
        if (id)
            getCourseArticles(id);
    }, []);
    // -----

    if (shouldRedirectToCreate) return (<Navigate to="create" />);
    return(
        <Flex vertical align={'center'} style={{width: window.innerWidth}}>
            <Space direction={'vertical'} align={'center'}>
                <h3>{course?.title}</h3>
                {course?.theories.map((article:ArticleModel) => (
                    <Card style={{width: 350}}>
                        <Space direction={'vertical'}>
                            <div><strong>Тема:</strong> {article.title}</div>
                            <Button onClick={() => article.id && navigate(article.id.toString())}>Открыть</Button>
                        </Space>
                    </Card>
                ))}
                <Button type={'primary'} onClick={() => setShouldRedirectToCreate(true)}>Добавить статью</Button>
            </Space>
        </Flex>
    )
}

export default CourseArticleListPage;