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
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

function Column({ id, todos, index }: Props) {
  const [setNewTaskInput, setUpdateTask, searchString, setNewTaskType] =
    useBoardStore((state) => [
      state.setNewTaskInput,
      state.setUpdateTask,
      state.searchString,
      state.setNewTaskType,
    ]);
  const openModal = useModalStore((state) => state.openModal);

  const handleAddToDo = () => {
    setUpdateTask(""), setNewTaskInput(""), setNewTaskType(id), openModal();
  };

  return (
    <div>
      <Droppable droppableId={index.toString()} type="card">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`p-2 rounded-2xl shadow-sm ${
              snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
            }`}
          >
            <h2 className="flex justify-between font-bold text-xl p-2">
              {idToColumnText[id]}{" "}
              <span className="text-gray-500 font-normal bg-gray-200 rounded-full px-2 py-2 text-sm">
                {!searchString
                  ? todos.length
                  : todos.filter((todo) =>
                      todo.title.toLowerCase().includes(searchString)
                    ).length}
              </span>
            </h2>
            <div className="space-y-2">
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
                {todos.length === 0 && <span>Add task</span>}
                <button
                  onClick={handleAddToDo}
                  className="place-content-end text-green-500 hover:text-green-600"
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
