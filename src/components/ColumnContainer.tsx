import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Task } from "../type";
import TrashIcon from "./icons/TrashIcon";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import Plusicon from "./icons/Plusicon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: string | number, newName: string) => void;
  createTask: (id: string | number) => void;
  deleteTask: (id: string | number) => void;
  updateTask: (id: string | number, content: string) => void;
  tasks: Task[];
}
const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 border-2 border-rose-500 bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* TITLE */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md p-3 rounded-b-none font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex rounded-full justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm">
            {tasks.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black outline-none border rounded px-2 focus:border-rose-500"
              value={column.title}
              autoFocus
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-y-auto overflow-x-hidden  ">
        {tasks.map((task) => (
          <SortableContext items={tasks.map((task) => task.id)}>
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          </SortableContext>
        ))}
      </div>
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-red-500 active:bg-black"
        onClick={() => createTask(column.id)}
      >
        <Plusicon />
        Add Task
      </button>
    </div>
  );
};

export default ColumnContainer;
