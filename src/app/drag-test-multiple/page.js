"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import DragTestMultipleContainer from "src/components/dragTestMultipleContainer/dragTestMultipleContainer.js";

const DragTest = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragTestMultipleContainer />
    </DndProvider>
  );
};

export default DragTest;
