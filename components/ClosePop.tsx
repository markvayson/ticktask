import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { Popover, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Fragment } from "react";

type Props = {
  todo: Todo;
  id: TypedColumn;
  index: number;
};

const ClosePop = ({ todo, index, id }: Props) => {
  const [setImage, setUpdateTask, setNewTaskInput, setNewTaskType, deleteTask] =
    useBoardStore((state) => [
      state.setImage,
      state.setUpdateTask,
      state.setNewTaskInput,
      state.setNewTaskType,
      state.deleteTask,
    ]);
  const openModal = useModalStore((state) => state.openModal);

  const handleEditClick = () => {
    setUpdateTask(todo.$id),
      setNewTaskInput(todo.title),
      setNewTaskType(todo.status),
      openModal();
  };

  return (
    <Popover className="relative ">
      {({ open }) => (
        <>
          <Popover.Button className="outline-none">
            <EllipsisVerticalIcon className=" w-8 h-8" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute  right-0">
              <div className="relative bg-white grid  ">
                <button
                  onClick={handleEditClick}
                  className="flex items-center justify-end gap-2 px-7 py-2 hover:bg-blue-500/20"
                >
                  Edit <PencilSquareIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => deleteTask(index, todo, id)}
                  className="flex items-center justify-end gap-2 px-7 py-2 hover:bg-red-500/20"
                >
                  Delete <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ClosePop;
