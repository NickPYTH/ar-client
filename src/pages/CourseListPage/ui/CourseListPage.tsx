import {Button, Card, Flex, NotificationArgsProps, Popconfirm, Space, Spin} from "antd";
import React, {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {courseAPI} from "service/CourseService";
import {CourseModel} from "entities/CourseModel";
import {RootStateType} from "store/store";
import {useSelector} from "react-redux";

type NotificationPlacement = NotificationArgsProps['placement'];

const CourseListPage = () => {

    // Store
    const notificationAPI = useSelector((state: RootStateType) => state.currentUser.notificationContextApi);
    // -----

    // Notifications
    const showErrorNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.error({
            message: `Ошибка`,
            description: msg,
            placement,
        });
    };
    const showSuccessNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.success({
            message: `ОК`,
            description: msg,
            placement,
        });
    };
    const showInfoNotification = (placement: NotificationPlacement, msg: string) => {
        notificationAPI?.info({
            message: `Внимание`,
            description: msg,
            placement,
        });
    };
    // -----

    // States
    const [shouldRedirectToCreate, setShouldRedirectToCreate] = useState(false);
    const navigate = useNavigate();
    // -----

    // Web requests
    const [getCourses, {
        data: courses,
        isLoading: isCoursesLoading
    }] = courseAPI.useGetAllMutation();
    const [createCourse, {
        data: createdCourse
    }] = courseAPI.useCreateMutation();
    const [deleteCourse, {
        isSuccess: isSuccessDeleteCourse
    }] = courseAPI.useDeleteMutation();
    // -----

    // Effects
    useEffect(() => {
        getCourses();
    }, []);
    useEffect(() => {
        if (createdCourse)
            if (createdCourse.id) {
                navigate(createdCourse.id.toString())
            }
    }, [createdCourse]);
    useEffect(() => {
        if (isSuccessDeleteCourse) {
            showSuccessNotification("topRight", "Курс удален.");
            getCourses();
        }
    }, [isSuccessDeleteCourse])
    // -----

    // Handlers
    const createCourseHandler = () => {
        let course: CourseModel = {description: "", id: null, theories: [], title: "Новый курс"};
        createCourse(course);
    };
    const deleteCourseHandler = (id:number) => {
        deleteCourse(id);
    };
    // -----

    if (shouldRedirectToCreate) return (<Navigate to="create" />);
    return(
        <Flex vertical align={'center'} style={{width: window.innerWidth}}>
            <Space direction={'vertical'} align={'center'}>
                {isCoursesLoading && <Spin size={'large'} style={{margin: 50}}/>}
                {courses?.map((course:CourseModel) => (
                    <Card style={{width: 350}}>
                        <Space direction={'vertical'} style={{width: '100%'}}>
                            <div><strong>Тема:</strong> {course.title}</div>
                            <Flex justify={'end'}>
                                <Button onClick={() => course.id && navigate(course.id.toString())}>Открыть</Button>
                                <Popconfirm title={"Вы точно хотите удалить курс? Это действие необратимо."}
                                            onConfirm={()=>course.id && deleteCourseHandler(course.id)}>
                                    <Button style={{marginLeft: 5}} danger>Удалить</Button>
                                </Popconfirm>
                            </Flex>
                        </Space>
                    </Card>
                ))}
                <Button type={'primary'} onClick={createCourseHandler}>Добавить курс</Button>
            </Space>
        </Flex>
    )
}

export default CourseListPage;