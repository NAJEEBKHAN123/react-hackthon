import React, { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";

import { db } from "../firebaseConfig"; // Adjust the import according to your Firebase config
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc, // Import deleteDoc
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

  // Firestore reference
  const tasksCollectionRef = collection(db, "tasks");

  // Fetch tasks from Firestore on component mount
  useEffect(() => {
    const q = query(tasksCollectionRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTasks = { todo: [], inProgress: [], completed: [] };
      snapshot.forEach((doc) => {
        const task = {
          id: doc.id,
          ...doc.data(),
          history: doc.data().history || [],
        };
        newTasks[task.status].push(task);
      });
      setTasks(newTasks);
    });
    return () => unsubscribe();
  }, []);

  // Function to add a new task
  const addTask = async (e) => {
    e.preventDefault();

    if (newTaskTitle.trim()) {
      const newTask = {
        title: newTaskTitle,
        status: selectedSection,
        createdAt: new Date().toISOString(),
        history: [
          {
            action: "Created",
            date: new Date().toISOString(),
          },
        ],
      };

      // Add task to Firestore
      await addDoc(tasksCollectionRef, newTask);

      // Reset form
      setNewTaskTitle("");
      setShowForm(false);
    }
  };

  // Function to handle changing the status of a task
  const handleStatusChange = async (taskId, newStatus) => {
    // Find the task in the current state
    const taskToUpdate = Object.values(tasks)
      .flat()
      .find((task) => task.id === taskId);

    if (!taskToUpdate) {
      console.error("Task not found");
      return;
    }

    const taskDoc = doc(db, "tasks", taskId);

    // Update the task with new status and history
    const updatedTask = {
      status: newStatus,
      history: [
        ...taskToUpdate.history,
        {
          action: `Moved to ${newStatus}`,
          date: new Date().toISOString(),
        },
      ],
    };

    await updateDoc(taskDoc, updatedTask);
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      // Delete task from Firestore
      const taskDoc = doc(db, "tasks", taskId);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between space-x-4 flex-col  sm:flex-row">
        {/* Section Components */}
        {["todo", "inProgress", "completed"].map((section) => (
          <div
            className={`flex-1 rounded-lg p-4 ${
              section === "todo"
                ? "bg-blue-100"
                : section === "inProgress"
                ? "bg-yellow-100"
                : "bg-green-100"
            }`}
            key={section}
          >
            <h2 className="text-xl font-bold mb-4">
              {section === "todo"
                ? "To Do"
                : section === "inProgress"
                ? "In Progress"
                : "Completed"}
            </h2>
            <div className="">
              {tasks[section].map((task, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded shadow ${
                    section === "todo"
                      ? "bg-blue-200"
                      : section === "inProgress"
                      ? "bg-yellow-200"
                      : "bg-green-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>{task.title}</div>
                    <div className="flex items-center">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                        className={`ml-2 outline-none border border-black  rounded-sm ${section === "todo"
                          ? "bg-blue-200"
                          : section === "inProgress"
                          ? "bg-yellow-200"
                          : "bg-green-200"}`}
                      >
                        {["todo", "inProgress", "completed"].map((status) => (
                          <option key={status} value={status}>
                            {status === "todo"
                              ? "To Do"
                              : status === "inProgress"
                              ? "In Progress"
                              : "Completed"}
                          </option>
                        ))}
                      </select>
                      {/* Delete Button */}

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
                          {entry.action} on{" "}
                          {new Date(entry.date).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
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
        ))}
      </div>

      {/* Task Form Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
          showForm ? "opacity-100" : "opacity-0"
        } ${showForm ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`bg-white p-6 rounded shadow-lg md:w-1/3 w-1/2 transition-transform duration-300 ${
            showForm ? "scale-100" : "scale-95"
          }`}
        >
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
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
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
    </div>
  );
};

export default Board;
