import { useState } from "react";
import { Task } from "../type";
import TrashIcon from "./icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: number | string) => void;
  updateTask: (id: number | string, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const toogleEditMode = () => {
    setEditMode((prev) => !prev);
    setIsMouseOver(false);
  };

  const {
    listeners,
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
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
        {...listeners}
        {...attributes}
        className="task bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl
        cursor-grab relative border-2 border-rose-500
        opacity-20"
      />
    );
  }
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="task bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2
            hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <textarea
          name=""
          id=""
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          placeholder=" Task content here"
          autoFocus
          onBlur={toogleEditMode}
          onChange={(e) => updateTask(task.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.shiftKey) toogleEditMode();
          }}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      {...listeners}
      {...attributes}
      style={style}
      ref={setNodeRef}
      onClick={toogleEditMode}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      className="task bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px]  flex text-left rounded-xl hover:ring-2
        hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-auto whitespace-pre-wrap">
        {task.content}
      </p>
      {isMouseOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColorp-2 rounded opacity-60 hover:opacity-100 p-2"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
