import { useMemo, useState } from "react";
import Plusicon from "./icons/Plusicon";
import { Column, Task } from "../type";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { INITIAL_COLUMN,INITIAL_TASK } from "../const";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMN);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASK);
  const sensores = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  );

  return (
    <div
      className="m-auto flex min-h-screen w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]"
    >
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensores}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  column={column}
                  deleteTask={deleteTask}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  updateTask={updateTask}
                  key={column.id}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId == column.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor
          p-4 ring-rose-500 hover:ring-2 flex gap-4"
            onClick={createNewColumn}
          >
            <Plusicon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteTask={deleteTask}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                updateTask={updateTask}
                key={activeColumn.id}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                deleteTask={deleteTask}
                updateTask={updateTask}
                task={activeTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
  function createNewColumn() {
    const columnToAdd: Column = {
      id: Math.floor(Math.random() * 10000),
      title: `Column ${columns.length + 1}`,
    };
    setColumns((prev) => [...prev, columnToAdd]);
  }

  function deleteColumn(id: string | number) {
    setColumns((prev) => prev.filter((col) => col.id != id));
    setTasks(tasks => tasks.filter(t => t.columnId != id))
  }

  function updateColumn(id: string | number, title: string) {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === id) return { ...col, title };
        return col;
      })
    );
  }

  function createTask(id: string | number) {
    const newTask: Task = {
      id: Math.floor(Math.random() * 10000),
      columnId: id,
      content: `Click to edit task`,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: string | number) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function updateTask(id: string | number, content: string) {
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id == id) return { ...task, content };
        return task;
      })
    );
  }

  function onDragStart(event: DragStartEvent) {
    console.log(event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    const activeColumnId = active.id;
    const overColumnId = over?.id;
    if (!over) return;
    if (activeColumnId !== overColumnId) {
      const activeColumnIndex = columns.findIndex((col) => col.id == active.id);
      const overColumnIndex = columns.findIndex((col) => col.id == over.id);

      setColumns((columns) =>
        arrayMove(columns, activeColumnIndex, overColumnIndex)
      );
    }
  }
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    if(isActiveTask && !isOverTask){
      const activeIndex = tasks.findIndex(t => t.id === activeId);
      setTasks(tasks => {
        tasks[activeIndex].columnId = overId;
        return [...tasks];
      })
    }
  }
};

export default KanbanBoard;
