"use client";

import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "@hello-pangea/dnd";
import ClosePop from "./ClosePop";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  useEffect(() => {
    if (todo.dueDate) {
      const date = new Date(todo.dueDate);
      setDueDate(
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [todo]);

  return (
    <div
      className="w-full relative flex  flex-col gap-2  bg-white/50 dark:bg-slate-700/50  rounded-md  drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex absolute -top-4 left-1/2 md:left-auto md:transform-none transform -translate-x-1/2 md:right-0 py-2 pr-2 items-center  justify-end ">
        {dueDate && (
          <span className="bg-red-500 font-medium text-slate-100 p-2 rounded-md text-end text-sm ">
            Due in {dueDate}
          </span>
        )}
      </div>
      <div className={`${dueDate && "pt-8"} w-full px-2 pt-2 flex md:flex-col`}>
        {imageUrl && (
          <div className=" md:w-full   w-48 md:h-32 h-24 flex items-center justify-center">
            <Image
              src={imageUrl}
              alt="Task Image"
              width={200}
              height={200}
              priority
              loading="eager"
              className="object-contain w-full h-full"
            />
          </div>
        )}
        <div className="flex justify-between w-full gap-5 py-3 px-2 ">
          <div className="flex  w-full flex-col  justify-between">
            <div className="flex justify-between">
              <h1 className="font-medium text-lg capitalize">{todo.title}</h1>
              <ClosePop key={id} id={id} todo={todo} index={index} />
            </div>
            <p className="break-words whitespace-normal">{todo.note}</p>
          </div>
        </div>
      </div>
      {/* <div className="flex w-full gap-2  bg-red-300 md:flex-col">
        {imageUrl && (
          <div className="p-2 w-full bg-violet-300  items-center flex justify-center  ">
            <Image
              src={imageUrl}
              alt="Task image"
              width={100}
              height={200}
              loading="eager"
              priority
              className="rounded-md  w-32 h-24 object-contain "
            />
          </div>
        )}

        <div className="flex-1 bg-green-300 w-full p-2  flex justify-between ">
          <div className="flex flex-col">
            <h1 className="text-lg capitalize font-bold text-gray-900 dark:text-slate-200">
              {todo.title}
            </h1>
            <p className="w-full overflow-auto text-gray-700  dark:text-slate-300">
              {todo.note}
            </p>
            {dueDate && <span className="text-sm">Due in: {dueDate}</span>}
          </div>
          <div className="flex justify-start ">
            <ClosePop key={id} id={id} todo={todo} index={index} />d
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default TodoCard;
