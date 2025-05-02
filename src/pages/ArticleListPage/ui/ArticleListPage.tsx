import {Button, Card, Flex, Space} from "antd";
import {articleAPI} from "service/ArticleService";
import React, {useEffect, useState} from "react";
import {ArticleModel} from "entities/ArticleModel";
import {Navigate} from "react-router-dom";

const ArticleListPage = () => {

    // States
    const [shouldRedirectToCreate, setShouldRedirectToCreate] = useState(false);
    // -----

    // Web requests
    const [getArticles, {
        data: articles,
    }] = articleAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getArticles();
    }, []);
    // -----

    if (shouldRedirectToCreate) return (<Navigate to="create" />);
    return(
        <Flex vertical align={'center'} style={{width: window.innerWidth}}>
            <Space direction={'vertical'} align={'center'}>
                {articles?.map((article:ArticleModel) => (
                    <Card>
                        <Space direction={'vertical'}>
                            <div><strong>Тема:</strong> {article.title}</div>
                            <div><strong>Дата создания:</strong> {article.pub_date}</div>
                            <Button>Открыть</Button>
                        </Space>
                    </Card>
                ))}
                <Button type={'primary'} onClick={() => setShouldRedirectToCreate(true)}>Добавить статью</Button>
            </Space>
        </Flex>
    )
}

export default ArticleListPage;