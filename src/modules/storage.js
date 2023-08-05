export const setTask = (data) => {
  return localStorage.setItem("task", JSON.stringify(data));
};

export const getTask = () => {
  return JSON.parse(localStorage.getItem("task"));
};
