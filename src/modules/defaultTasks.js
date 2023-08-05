const ListofTask = [
  {
    name: "Renew Driver's License",
    description: "Need to renew license for 10 years",
    project: "Personal",
    dateCreated: "02-08-2023",
    dateDue: "01-12-2023",
    subtasks: [],
    completed: false,
  },
  {
    name: "Create a database of guest authors",
    description: "to prepare for the calling",
    project: "Work",
    dateCreated: "03-08-2023",
    dateDue: "08-06-2024",
    subtasks: [],
    completed: true,
  },
  {
    name: "Buy Groceries",
    description: "Buy fruits and vegetables",
    project: "Personal",
    dateCreated: "08-08-2023",
    dateDue: "08-04-2023",
    subtasks: ["Ice Cream", "Coke", "Chicken", "Meat", "Rice"],
    completed: false,
  },
  {
    name: "Prepare Presentation",
    description: "Prepare slides for the upcoming meeting",
    project: "Work",
    dateCreated: "12-08-2023",
    dateDue: "06-08-2023",
    subtasks: [],
    completed: false,
  },
];

export default ListofTask;
