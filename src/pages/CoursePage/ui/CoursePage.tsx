import {
    Button,
    Card,
    Empty,
    Flex,
    FloatButton,
    Input,
    NotificationArgsProps,
    Popconfirm,
    Skeleton,
    Space,
    Spin
} from "antd";
import React, {useEffect, useState} from "react";
import {ArticleModel} from "entities/ArticleModel";
import {Navigate, useNavigate} from "react-router-dom";
import {courseAPI} from "service/CourseService";
import {ArrowLeftOutlined, EditOutlined, PlusCircleOutlined, SaveOutlined} from "@ant-design/icons";
import {CourseModel} from "entities/CourseModel";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {articleAPI} from "service/ArticleService";

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
        isLoading: isCourseLoading,
    }] = courseAPI.useGetMutation();
    const [updateCourse, {
        isSuccess: isSuccessUpdateCourse
    }] = courseAPI.useCreateMutation();
    const [deleteArticle, {
        isSuccess: isDeleteArticleSuccess
    }] = articleAPI.useDeleteMutation();
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
    useEffect(() => {
        if (isDeleteArticleSuccess && id){
            showSuccessNotification('topRight', 'Статья удалена.')
            getCourseArticles(id);
        }
    }, [isDeleteArticleSuccess])
    // -----

    // Handlers
    const saveTitleHandler = () => {
        setEditModeTitle(prev => !prev);
        if (id && editModeTitle) {
            let course: CourseModel = {description: "", id, theories: [], title}
            updateCourse(course);
        }
    };
    const deleteArticleHandler = (id: number) => {
        deleteArticle(id);
    }
    // -----

    if (shouldRedirectToCreate) return (<Navigate to="create" />);
    if (isCourseLoading) return (<Flex vertical align={'center'} style={{width: window.innerWidth}}>
                                    <Spin size='large' style={{margin: 50}} />
                                </Flex>)
    return(
        <Flex vertical align={'center'} style={{width: window.innerWidth}}>
            <Space direction={'vertical'} align={'center'}>
                <Flex align={'center'} justify={'center'}>
                    <Button icon={<ArrowLeftOutlined />} style={{marginRight: 15}} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    {editModeTitle && <Input style={{width: 400}} value={title} onChange={(e) => setTitle(e.target.value)}/>}
                    {!editModeTitle &&  <h3>{title}</h3>}
                    <Button onClick={saveTitleHandler} style={{marginLeft: 5}} size={'small'} variant={'outlined'} color={'primary'} icon={editModeTitle ? <SaveOutlined /> : <EditOutlined />}/>
                </Flex>
                {(course?.theories?.length == 0 && !isCourseLoading) && <Empty style={{margin: 15}}/>}
                {course?.theories.map((article:ArticleModel) => (
                    <Card style={{width: 350}}>
                        <Space direction={'vertical'} style={{width: '100%'}}>
                            <div><strong>Тема:</strong> {article.title}</div>
                            <Flex justify={'end'}>
                                <Button onClick={() => article.id && navigate(article.id.toString())}>Открыть</Button>
                                <Popconfirm title={"Вы точно хотите удалить статью? Это действие необратимо."}
                                            onConfirm={()=>article.id && deleteArticleHandler(article.id)}>
                                    <Button style={{marginLeft: 5}} danger>Удалить</Button>
                                </Popconfirm>
                            </Flex>
                        </Space>
                    </Card>
                ))}
                <FloatButton type="primary" icon={<PlusCircleOutlined />} onClick={() => setShouldRedirectToCreate(true)}/>
            </Space>
        </Flex>
    )
}

export default CoursePage;