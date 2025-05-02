import {Card, Flex, Space} from "antd";
import React from "react";
import {useDrag} from 'react-dnd'

const ArticlePage = () => {

    // States
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'text',
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))
    // -----

    // Web requests

    // -----

    // Effects

    // -----


    return(
        <Flex justify={'center'} style={{width: window.innerWidth, height: window.innerHeight}}>
            <Space direction={'vertical'} style={{width: '20%', marginRight: 20}}>
                <Card ref={drag}>
                    TEXT
                </Card>
                <Card>
                    IMG
                </Card>
            </Space>
            <Card style={{height: '90%', width: '60%'}}>
                WORK ZONE
            </Card>
        </Flex>
    )
}

export default ArticlePage;