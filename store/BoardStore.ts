import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateToDoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  taskToUpdate: any;
  setTaskToUpdate: (taskToUpdate: Todo) => void;
  setSearchString: (searchString: string) => void;
  TaskInput: string;
  setTaskInput: (input: string) => void;
  image: File | null;
  imageUrl: string | null;
  setImageUrl: (imageUrl: string | null) => void;

  setImage: (image: File | null) => void;
  TaskType: TypedColumn;
  setTaskType: (columnId: TypedColumn) => void;
  isUpdating: boolean;
  setIsUpdating: (input: boolean) => void;
  taskDueDate: Date | undefined;
  setTaskDueDate: (input: Date | undefined) => void;
  taskNote: string;
  setTaskNote: (input: string) => void;
  addTask: (
    todo: string,
    columnId: TypedColumn,
    image?: File | null,
    dueDate?: Date | undefined,
    note?: string
  ) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  updateTask: (
    todoId: Todo,
    name: string,
    id: TypedColumn,
    image?: File | null,
    dueDate?: Date | null,
    note?: string
  ) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  TaskInput: "",
  TaskType: "todo",
  image: null,
  isUpdating: false,
  setIsUpdating: (input: boolean) => set({ isUpdating: input }),

  imageUrl: "",
  setImageUrl: (imageUrl: string | null) => set({ imageUrl }),
  taskNote: "",
  setTaskNote: (input: string) => set({ taskNote: input }),

  taskDueDate: undefined,
  setTaskDueDate: (input: Date | undefined) => set({ taskDueDate: input }),

  taskToUpdate: "",
  setTaskToUpdate: (taskToUpdate: Todo) => set({ taskToUpdate }),
  setImage: (image: File | null) => set({ image }),

  setTaskType: (columnId: TypedColumn) => set({ TaskType: columnId }),

  setTaskInput: (input: string) => set({ TaskInput: input }),

  setSearchString: (searchString) => set({ searchString }),
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  updateToDoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId }
    );
  },

  updateTask: async (
    todo: Todo,
    name: string,
    id: TypedColumn,
    image?: File | null,
    due?: Date | null,
    taskNote?: string
  ) => {
    let file: Image | undefined;

    if (todo.image && image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
      console.log("deleted");
    }

    if (todo.image) {
      file = {
        bucketId: todo.image.bucketId,
        fileId: todo.image.fileId,
      };
    }

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    const updateTodo = {
      ...todo,
      title: name,
      status: id,
      dueDate: due ? due : null,
      note: taskNote,
      ...(file && { image: JSON.stringify(file) }),
    };

    set({ TaskInput: "" });
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      updateTodo
    );

    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  addTask: async (
    todo: string,
    columnId: TypedColumn,
    image?: File | null,
    due?: Date | undefined,
    taskNote?: string
  ) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        dueDate: due,
        note: taskNote,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ TaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        dueDate: due,
        note: taskNote,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
