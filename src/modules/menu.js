import { getTask } from "./storage";
import { displayTasks } from "./content.js";

const menuInterface = () => {
  tasksContainer();
};

const tasksContainer = () => {
  const tasks = getTask();
  const taskListContainer = document.getElementById("tasks-lists");

  const ul =
    taskListContainer?.querySelector("ul") ?? document.createElement("ul");
  const taskLists = filterTasks(tasks);
  const allList = document.createElement("li");
  allList.className =
    "tracking-wider items-center font-medium flex justify-between w-full p-2 rounded-lg";
  allList.textContent = "All";
  allList.addEventListener("click", () => displayTasks(tasks));
  const allSpan = document.createElement("span");
  allSpan.className = "bg-slate-100 px-3 py-1 rounded-lg";
  allSpan.textContent = tasks.length;
  allList.appendChild(allSpan);

  ul.appendChild(allList);
  for (let key in taskLists) {
    const li = document.createElement("li");
    li.className =
      "tracking-wider items-center font-medium flex justify-between w-full p-2 rounded-lg";

    li.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    const span = document.createElement("span");
    span.className = "bg-slate-100 px-3 py-1 rounded-lg";
    span.textContent = taskLists[key].length;
    li.appendChild(span);
    li.addEventListener("click", () => displayTasks(taskLists[key]));
    ul.appendChild(li);
  }
  taskListContainer.appendChild(ul);
};

const filterTasks = (array) => {
  const currentDate = new Date().toLocaleDateString();
  const tasks = array.map((item) => ({
    ...item,
    dateDue: new Date(item.dateDue).toLocaleDateString(),
  }));

  const upcomingTasks = tasks.filter((item) => item.dateDue >= currentDate);
  const todayTasks = tasks.filter((item) => item.dateDue === currentDate);
  const pastTasks = tasks.filter((item) => item.dateDue < currentDate);

  return {
    Upcoming: upcomingTasks,
    Today: todayTasks,
    Past: pastTasks,
  };
};

export default menuInterface();
