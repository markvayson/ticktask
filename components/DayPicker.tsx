"use client";

import { useBoardStore } from "@/store/BoardStore";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DatePicker = () => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [isOpenPicker, setIsOpenPicker] = useState<boolean>(false);
  const [taskDueDate, setTaskDueDate] = useBoardStore((state) => [
    state.taskDueDate,
    state.setTaskDueDate,
  ]);

  const handleDateClick = (date: Date | undefined) => {
    setTaskDueDate(date), setIsOpenPicker(false);
  };

  const handleClick = () => {
    setIsAdd(!isAdd);
    if (!taskDueDate) {
      setIsOpenPicker(true);
    }
    setTaskDueDate(undefined);
  };

  return (
    <div className=" flex h-10 w-full gap-2 items-center justify-end">
      {taskDueDate && (
        <button
          className="bg-slate-200/50 dark:bg-gray-700 p-2 rounded-md hover:dark:bg-gray-600"
          type="button"
          onClick={() => setIsOpenPicker(!isOpenPicker)}
        >
          {taskDueDate?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </button>
      )}

      {isOpenPicker && (
        <div>
          <DayPicker
            className="bg-slate-200/95 rounded-md p-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-gray-800"
            mode="single"
            selected={taskDueDate}
            onSelect={handleDateClick}
          />
        </div>
      )}

      <button type="button" onClick={handleClick}>
        {taskDueDate ? (
          <MinusCircleIcon className="w-6 h-6 text-red-400 hover:text-red-500" />
        ) : (
          <PlusCircleIcon className="w-6 h-6 text-green-400 hover:text-green-500" />
        )}
      </button>
    </div>
  );
};

export default DatePicker;
