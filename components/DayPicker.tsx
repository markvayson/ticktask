import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DatePicker = () => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [selected, setSelected] = useState<Date>();
  let footer = <p>Please pick a day.</p>;
  if (selected) {
    footer = <p>You picked {format(selected, "PP")}.</p>;
  }
  const date = selected;

  const handleClick = () => {
    setIsAdd(!isAdd);
    if (isAdd) {
      setSelected(new Date());
    } else {
      setSelected(undefined);
    }
  };

  return (
    <div className="flex h-10 w-full gap-2 items-center justify-end">
      {isAdd && selected ? (
        <span className="dark:bg-gray-700 px-2 py-1 rounded-md  shadow-md">
          {format(selected, "PP")}
        </span>
      ) : null}
      <button type="button" onClick={handleClick}>
        {isAdd ? (
          <MinusCircleIcon className="w-6 h-6 text-red-400" />
        ) : (
          <PlusCircleIcon className="w-6 h-6 text-green-400" />
        )}
      </button>
    </div>
  );
};

export default DatePicker;
