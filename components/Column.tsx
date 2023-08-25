import { PlusCircleIcon } from "@heroicons/react/24/solid";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: object;
} = {
  todo: {
    name: "To Do",
    color: "bg-red-500",
  },
  inprogress: {
    name: "In Progress",
    color: "bg-yellow-500",
  },
  done: {
    name: "Done",
    color: "bg-green-500",
  },
};

function Column({ id, todos, index }: Props) {
  const [setImageUrl, setTaskInput, setIsUpdating, searchString, setTaskType] =
    useBoardStore((state) => [
      state.setImageUrl,
      state.setTaskInput,
      state.setIsUpdating,
      state.searchString,
      state.setTaskType,
    ]);
  const openModal = useModalStore((state) => state.openModal);

  const handleAddToDo = () => {
    setIsUpdating(false),
      setImageUrl(""),
      setTaskInput(""),
      setTaskType(id),
      openModal();
  };

  return (
    <div>
      <Droppable droppableId={index.toString()} type="card">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`relative p-2 rounded-2xl shadow-md ${
              snapshot.isDraggingOver
                ? (idToColumnText[id] as { color: string }).color
                : "bg-slate-300/50 dark:bg-gray-800/50"
            }`}
          >
            <h2
              className={`${
                (idToColumnText[id] as { color: string }).color
              } uppercase text-white rounded-md absolute -top-3 left-5 gap-5 flex items-center justify-between font-bold text-lg p-2`}
            >
              {(idToColumnText[id] as { name: string }).name}
              <span className="bg-white/20 font-medium text-white dark:bg-transparent dark:text-gray-300  rounded-full px-2 py-1 text-sm">
                {!searchString
                  ? todos.length
                  : todos.filter((todo) =>
                      todo.title.toLowerCase().includes(searchString)
                    ).length}
              </span>
            </h2>
            <div className="space-y-5 pt-10">
              {todos.map((todo, index) => {
                if (
                  searchString &&
                  !todo.title.toLowerCase().includes(searchString.toLowerCase())
                ) {
                  return null;
                }
                return (
                  <Draggable
                    key={todo.$id}
                    draggableId={todo.$id}
                    index={index}
                  >
                    {(provided) => (
                      <TodoCard
                        todo={todo}
                        index={index}
                        id={id}
                        innerRef={provided.innerRef}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}

              <div
                className={`flex items-center ${
                  todos.length === 0 ? "justify-between" : "justify-end"
                } p-2`}
              >
                {todos.length === 0 && (
                  <span className="text-gray-400 dark:text-gray-300">
                    No Task
                  </span>
                )}
                <button
                  onClick={handleAddToDo}
                  className="place-content-end text-blue-500 dark:text-cyan-400 dark:hover:text-blue-400 hover:text-blue-600"
                >
                  <PlusCircleIcon className="h-10 w-10" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
