import React, { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Board = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedSection, setSelectedSection] = useState("todo");

  const tasksCollectionRef = collection(db, "tasks");

  useEffect(() => {
    const q = query(tasksCollectionRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTasks = { todo: [], inProgress: [], completed: [] };
      snapshot.forEach((doc) => {
        const task = { id: doc.id, ...doc.data(), history: doc.data().history || [] };
        newTasks[task.status].push(task);
      });
      setTasks(newTasks);
    });
    return () => unsubscribe();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (newTaskTitle.trim()) {
      const newTask = {
        title: newTaskTitle,
        status: selectedSection,
        createdAt: new Date().toISOString(),
        history: [{ action: "Created", date: new Date().toISOString() }],
      };

      await addDoc(tasksCollectionRef, newTask);
      setNewTaskTitle("");
      setShowForm(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const taskDoc = doc(db, "tasks", taskId);
    const taskToUpdate = tasks[selectedSection].find((task) => task.id === taskId);

    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      status: newStatus,
      history: [...taskToUpdate.history, { action: `Moved to ${newStatus}`, date: new Date().toISOString() }],
    };

    await updateDoc(taskDoc, updatedTask);
  };

  const deleteTask = async (taskId) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination || source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceTasks = [...tasks[source.droppableId]];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;

    const destinationTasks = [...tasks[destination.droppableId]];
    destinationTasks.splice(destination.index, 0, movedTask);
console
    const newTasks = {
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destinationTasks,
    };

    setTasks(newTasks);
    await handleStatusChange(movedTask.id, movedTask.status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4">
        <div className="flex justify-between space-x-4 flex-col sm:flex-row">
          {["todo", "inProgress", "completed"].map((section) => (
            <Droppable droppableId={section} key={section}>
              {(provided) => (
                <div
                  className={`flex-1 rounded-lg p-4 ${
                    section === "todo"
                      ? "bg-blue-100"
                      : section === "inProgress"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2 className="text-xl font-bold mb-4">
                    {section === "todo"
                      ? "To Do"
                      : section === "inProgress"
                      ? "In Progress"
                      : "Completed"}
                  </h2>
                  <div>
                    {tasks[section].map((task, index) => {
                      console.log("id : ",task.id)
                     return <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            className={`mb-2 rounded shadow ${
                              section === "todo"
                                ? "bg-red-200"
                                : section === "inProgress"
                                ? "bg-blue-200"
                                : "bg-green-200"
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="flex justify-between items-center">
                              <div>{task.title}</div>
                              <div className="flex items-center">
                                <MdDeleteOutline
                                  onClick={() => deleteTask(task.id)}
                                  className="text-3xl text-red-500 cursor-pointer rounded"
                                />
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              <h4 className="font-semibold">History:</h4>
                              <ul className="list-disc ml-4">
                                {task.history.map((entry, idx) => (
                                  <li key={idx}>
                                    {entry.action} on {new Date(entry.date).toLocaleString()}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </Draggable>
})}
                    {provided.placeholder}
                  </div>
                  <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => {
                      setSelectedSection(section);
                      setShowForm(true);
                    }}
                  >
                    Add Task
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>

        {showForm && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
          >
            <div className="bg-white p-6 rounded shadow-lg md:w-1/3 w-1/2 transition-transform duration-300">
              <h2 className="text-xl font-bold mb-4">Add New Task</h2>
              <form onSubmit={addTask}>
                <div className="mb-4">
                  <label className="block text-gray-700">Task Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Add Task
                  </button>
                  <button
                    type="button"
                    className="ml-4 bg-gray-500 text-white py-2 px-4 rounded"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default Board;
