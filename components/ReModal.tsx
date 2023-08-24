"use client";

import { FormEvent, Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Category from "./Category";
import DatePicker from "./DayPicker";

const Modal = () => {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [
    taskCategory,
    setTaskCategory,
    taskDueDate,
    setTaskDueDate,
    taskToUpdate,
    setTaskToUpdate,
    isUpdating,
    updateTask,
    addTask,
    image,
    setImage,
    TaskInput,
    setTaskInput,
    TaskType,
    setTaskType,
  ] = useBoardStore((state) => [
    state.taskCategory,
    state.setTaskCategory,
    state.taskDueDate,
    state.setTaskDueDate,
    state.taskToUpdate,
    state.setTaskToUpdate,
    state.isUpdating,
    state.updateTask,
    state.addTask,
    state.image,
    state.setImage,

    state.TaskInput,
    state.setTaskInput,
    state.TaskType,
    state.setTaskType,
  ]);

  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);
  const [isDue, setIsDue] = useState<boolean>(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!TaskInput) return;
    if (isUpdating) {
      updateTask(taskToUpdate, TaskInput, TaskType, image);
    } else {
      addTask(TaskInput, TaskType, image);
    }
    setImage(null);
    closeModal();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="form"
        onSubmit={handleSubmit}
        className="relative z-10"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opiacty-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900/95 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="dark:text-slate-400 text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  {isUpdating ? "Task" : "Add a Task"}
                </Dialog.Title>

                <div className="mt-2">
                  <input
                    type="text"
                    value={TaskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter a task here..."
                    className="py-2 px-4 w-full border dark:text-slate-400 dark:placeholder:text-slate-400 bg-transparent border-slate-800 rounded-md outline-none "
                  />
                </div>

                <TaskTypeRadioGroup />
                <div className="text-sm rounded-md dark:bg-gray-800 dark:text-slate-300 py-2 px-4 flex flex-col gap-2">
                  <div className="relative flex justify-between w-full items-center">
                    <h2 className="w-full">Category</h2>
                    <Category />
                  </div>
                  <div className=" flex justify-between w-full items-center">
                    <h2 className="w-full">Due Date</h2>
                    <DatePicker />
                  </div>
                </div>
                <div className="mt-2">
                  <textarea
                    className="outline-none px-4 pt-2 text-sm dark:text-gray-300 w-full rounded-md dark:bg-gray-900"
                    id="note"
                    name="note"
                    placeholder="Write a note..."
                    rows={5}
                    cols={40}
                  />
                </div>
                {/* <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      imagePickerRef.current?.click();
                    }}
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                    Upload Image
                  </button>
                  {image && (
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Uploaded Image"
                      width={200}
                      height={200}
                      className="w-full h-44 obrject-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                      onClick={() => {
                        setImage(null);
                      }}
                    />
                  )}

                  <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImage(e.target.files![0]);
                    }}
                  />
                </div> */}
                <div className="mt-4 gap-4 flex justify-evenly w-full">
                  <div className="w-full flex dark:text-slate-300 items-center justify-center rounded-md dark:bg-gray-800 ">
                    <button
                      type="button"
                      onClick={() => {
                        imagePickerRef.current?.click();
                      }}
                    >
                      Upload Image
                    </button>
                    <input
                      type="file"
                      ref={imagePickerRef}
                      hidden
                      onChange={(e) => {
                        if (!e.target.files![0].type.startsWith("image/"))
                          return;
                        setImage(e.target.files![0]);
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!TaskInput}
                    className="rounded-md w-full   rounde-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Change Task" : "Add Task"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
