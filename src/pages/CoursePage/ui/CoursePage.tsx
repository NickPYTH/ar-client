import {Button, Card, Flex, Input, NotificationArgsProps, Space} from "antd";
import React, {useEffect, useState} from "react";
import {ArticleModel} from "entities/ArticleModel";
import {Navigate, useNavigate} from "react-router-dom";
import {courseAPI} from "service/CourseService";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {CourseModel} from "entities/CourseModel";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";

type NotificationPlacement = NotificationArgsProps['placement'];

const CoursePage = () => {

    // Store
    const api = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // Notifications
    const showErrorNotification = (placement: NotificationPlacement, msg: string) => {
        api?.error({
            message: `Ошибка`,
            description: msg,
            placement,
        });
    };
    const showSuccessNotification = (placement: NotificationPlacement, msg: string) => {
        api?.success({
            message: `ОК`,
            description: msg,
            placement,
        });
    };
    const showInfoNotification = (placement: NotificationPlacement, msg: string) => {
        api?.info({
            message: `Внимание`,
            description: msg,
            placement,
        });
    };
    // -----

    // States
    const [title, setTitle] = useState<string>("Заголовок статьи");
    const [editModeTitle, setEditModeTitle] = useState(false);
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
    const [updateCourse, {
        isSuccess: isSuccessUpdateCourse
    }] = courseAPI.useCreateMutation();
    // -----

    // Effects
    useEffect(() => {
        if (isSuccessUpdateCourse) {
            showSuccessNotification('topRight', 'Название сохранено')
        }
    }, [isSuccessUpdateCourse]);
    useEffect(() => {
        if (id)
            getCourseArticles(id);
    }, []);
    useEffect(() => {
        if (course){
            setTitle(course.title)
        }
    }, [course]);
    // -----

    // Handlers
    const saveTitleHandler = () => {
        setEditModeTitle(prev => !prev);
        if (id && editModeTitle) {
            let course: CourseModel = {description: "", id, theories: [], title}
            updateCourse(course);
        }
    }
    // -----

    if (shouldRedirectToCreate) return (<Navigate to="create" />);
    return(
        <Flex vertical align={'center'} style={{width: window.innerWidth}}>
            <Space direction={'vertical'} align={'center'}>
                <Flex align={'center'}>
                    {editModeTitle && <Input style={{width: 400}} value={title} onChange={(e) => setTitle(e.target.value)}/>}
                    {!editModeTitle &&  <h3>{title}</h3>}
                    <Button onClick={saveTitleHandler} style={{marginLeft: 5}} size={'small'} variant={'outlined'} color={'primary'} icon={editModeTitle ? <SaveOutlined /> : <EditOutlined />}/>
                </Flex>
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

export default CoursePage;