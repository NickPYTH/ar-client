import React, {FC} from "react";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

const DragAndDropProvider: FC = ({children}) => {
    return (
        <DndProvider backend={HTML5Backend}>
            {children}
        </DndProvider>
    )
}

export default DragAndDropProvider;