import unchecked from "./images/unchecked.png";
import calendar from "./images/calendar.png";
import checked from "./images/checked.png";
import { setTask, getTask } from "./storage.js";
import ListofTask from "./defaultTasks";
import trash from "./images/delete.png";
const mainInterface = () => {
  const tasks = getTask();
  displayTasks(tasks);
  displayTaskDetails(1);
};

const changeTaskStatus = (task) => {
  const tasks = getTask().map((item) => {
    if (item.name === task.name) {
      return { ...item, completed: !item.completed };
    }

    return item;
  });
  setTask(tasks);
  return displayTasks(tasks);
};

const filterDate = (date) => {
  const inputDate = date.slice(0, 5);
  const [month, day] = date.split("-");

  const dateObj = new Date(`2000-${month}-${day}`);
  const monthName = dateObj.toLocaleString("default", { month: "short" });

  const outputDate = `${monthName} ${day}`;

  return outputDate;
};

export const displayTasks = (list) => {
  const listContainer = document.getElementById("list-container");
  listContainer.innerHTML = "";
  if (list.length < 1) return (listContainer.textContent = "No Task");
  const ul = document.createElement("ul");
  ul.className = "flex flex-col text-base w-full";
  for (let i in list) {
    const li = document.createElement("li");
    li.className =
      "last:border-none cursor-pointer gap-10 border-b p-2 border-gray-300 flex gap-2 items-center";

    const imgDiv = document.createElement("div");

    const checkbox = new Image();
    checkbox.className = "w-6 h-6";
    if (list[i].completed) checkbox.src = checked;
    else checkbox.src = unchecked;
    imgDiv.addEventListener("click", () => {
      changeTaskStatus(list[i]);
      checkbox.src = checkbox.src === checked ? unchecked : checked;
    });
    imgDiv.appendChild(checkbox);
    li.appendChild(imgDiv);

    const project = document.createElement("span");
    project.textContent = list[i].project;
    project.className =
      "w-32 font-medium tracking-wider text-center px-2 py-1 text-white rounded-lg";
    if (project.textContent === "Personal") project.classList.add("bg-red-500");
    else project.classList.add("bg-cyan-500");

    li.appendChild(project);

    const textDiv = document.createElement("div");
    textDiv.className = "flex items-center gap-2 w-full";
    textDiv.addEventListener("click", () => displayTaskDetails(i));

    const name = document.createElement("span");
    name.textContent = list[i].name;
    name.className = " font-semibold ";
    textDiv.appendChild(name);

    const description = document.createElement("span");
    description.textContent = " - " + list[i].description;
    description.className = "font-light flex-1 text-sm text-gray-700";
    textDiv.appendChild(description);

    const status = document.createElement("span");
    status.textContent = "Pending";
    status.className = "bg-gray-300 px-2 py-1 w-24 text-center";
    textDiv.appendChild(status);

    if (list[i].completed) {
      name.classList.add("line-through");
      description.classList.add("line-through");
      status.textContent = "Completed";
    }
    const dateDiv = document.createElement("div");
    dateDiv.className = "flex gap-2 items-center justify-center w-24 ";

    const dateImage = new Image();
    dateImage.src = calendar;
    dateImage.className = "w-6 h-6";
    dateDiv.appendChild(dateImage);

    const dateText = document.createElement("span");
    dateText.textContent = filterDate(list[i].dateDue);
    dateText.className = "";
    dateDiv.appendChild(dateText);

    textDiv.appendChild(dateDiv);

    li.appendChild(textDiv);
    ul.appendChild(li);
  }

  listContainer.appendChild(ul);
};

const displayTaskDetails = (index) => {
  const tasks = getTask();
  const task = tasks[index];
  const mainContainer = document.getElementById("main-container");
  const listContainer = document.getElementById("list-container");
  listContainer.classList.add("basis-1/2");

  const detailsContainer = document.createElement("div");
  detailsContainer.id = "details-container";
  detailsContainer.className =
    "w-full basis-1/2 rounded-lg bg-slate-50 p-2 flex gap-2 flex-col";
  detailsContainer.appendChild(createElement("Title", task.name));
  detailsContainer.appendChild(createElement("Description", task.description));

  const addDiv = document.createElement("div");
  addDiv.className = "w-full flex";
  const addInput = document.createElement("input");
  addInput.className = "flex-1 border border-gray-300 p-2";
  addInput.placeholder = "add sub task";
  addInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && addInput.value.trim() !== "") {
      event.preventDefault();
      task.subtasks.push(addInput.value.trim());
      addInput.value = "";
      setTask(tasks);
      detailsContainer.appendChild(subTasks(task));
    }
  });
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add";
  addBtn.className = "bg-gray-300 p-2";
  addBtn.addEventListener("click", () => {
    if (addInput.value.trim() === "") return;
    task.subtasks.push(addInput.value.trim());
    addInput.value = "";
    setTask(tasks);
    detailsContainer.appendChild(subTasks(task));
  });
  addDiv.appendChild(addInput);
  addDiv.appendChild(addBtn);
  detailsContainer.appendChild(addDiv);
  detailsContainer.appendChild(subTasks(task));
  mainContainer.appendChild(detailsContainer);
};

const subTasks = (task) => {
  const detailsContainer = document.getElementById("details-container");
  if (detailsContainer) {
    const ulElement = detailsContainer.querySelector("ul");
    if (ulElement) detailsContainer.removeChild(ulElement);
  }
  if (task.subtasks.length <= 0) {
    const span = document.createElement("span");
    span.textContent = "No Sub Tasks";
    span.className = "text-center text-gray-400";
    return span;
  }

  const ul = document.createElement("ul");
  ul.className = "flex flex-col gap-2 p-2";
  task.subtasks.forEach((sub) => {
    const li = document.createElement("li");
    li.className = "flex justify-between border-b p-1 last:border-none";
    const span = document.createElement("span");
    span.textContent = sub;
    const image = new Image();
    image.src = trash;
    image.className = "w-6 h-6";
    li.appendChild(span);
    li.appendChild(image);

    ul.appendChild(li);
  });

  return ul;
};

const createElement = (title, text) => {
  const div = document.createElement("div");
  div.className = "flex gap-1 items-center";
  const span = document.createElement("span");
  span.textContent = title;
  span.className = "text-lg font-medium";
  div.appendChild(span);
  const input = document.createElement("input");
  input.placeholder = text;
  input.className =
    "placeholder:text-gray-700 bg-slate-50 w-full rounded-sm p-2 border border-gray-100";

  div.appendChild(input);

  return div;
};

export default mainInterface();
