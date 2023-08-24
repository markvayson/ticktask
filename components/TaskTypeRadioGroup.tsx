"use client";

import { useBoardStore } from "@/store/BoardStore";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const types = [
  {
    id: "todo",
    name: "Todo",
    color: "bg-red-500",
  },
  {
    id: "inprogress",
    name: "In progress",
    color: "bg-yellow-500",
  },
  {
    id: "done",
    name: "Done",
    color: "bg-green-500",
  },
];

function TaskTypeRadioGroup() {
  const [setTaskType, TaskType] = useBoardStore((state) => [
    state.setTaskType,
    state.TaskType,
  ]);
  return (
    <div className="w-full py-5">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup
          value={TaskType}
          onChange={(e) => {
            setTaskType(e);
          }}
        >
          <div className="flex w-full items-center justify-evenly space-x-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ active, checked }) =>
                  `
                ${
                  checked
                    ? `${type.color} bg-opacity-75 text-slate-400`
                    : "bg-slate-400 dark:bg-white/20"
                }
                relative  w-full flex pr-2 pl-4 cursor-pointer rounded-lg py-4 shadow-md focus:outline-none
                `
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium 
                          ${
                            checked
                              ? "text-slate-200"
                              : "dark:text-white text-gray-900"
                          }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-slate-200">
                          <CheckCircleIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default TaskTypeRadioGroup;
