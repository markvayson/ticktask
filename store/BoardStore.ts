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
  setImage: (image: File | null) => void;
  TaskType: TypedColumn;
  setTaskType: (columnId: TypedColumn) => void;
  isUpdating: boolean;
  setIsUpdating: (input: boolean) => void;
  taskCategory: string;
  setTaskCategory: (input: string) => void;
  taskDueDate: Date | null;
  setTaskDueDate: (input: Date | null) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  updateTask: (
    todoId: Todo,
    name: string,
    id: TypedColumn,
    image?: File | null
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

  taskCategory: "",
  setTaskCategory: (input: string) => set({ taskCategory: input }),

  taskDueDate: new Date(),
  setTaskDueDate: (input: Date | null) => set({ taskDueDate: input }),

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
    image?: File | null
  ) => {
    let file: Image | undefined;
    if (todo.image && image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
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

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
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
