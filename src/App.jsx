import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';
import React from 'react';

// TodoItem component
function TodoItem({ todo, index, completeHandler, deleteHandler, editHandler }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.title);

  const editTodo = () => {
    editHandler(index, todoMsg);
    setIsTodoEditable(false);
  };

  const toggleCompleted = () => {
    completeHandler(index);
  };

  return (
    <li className="mb-5">
      <div
        className={`flex border border-black/10 rounded-lg px-4 py-2 gap-x-3 shadow-sm shadow-white/50 duration-300 text-[17px] text-black ${
          todo.completed ? 'bg-[#c6e9a7]' : 'bg-[#ccbed7]'
        }`}
      >
        <input type="checkbox" className="cursor-pointer w-6 h-6 mt-1" checked={todo.completed} onChange={toggleCompleted} />
        <input
          type="text"
          className={`border outline-none w-full bg-transparent rounded-lg ${
            isTodoEditable ? 'border-black/10 px-2' : 'border-transparent'
          } ${todo.completed ? 'line-through' : ''}`}
          value={todoMsg}
          onChange={(e) => setTodoMsg(e.target.value)}
          readOnly={!isTodoEditable}
        />
        {/* Edit, Save Button */}
        <button
          className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
          onClick={() => {
            if (todo.completed) return;
            if (isTodoEditable) {
              editTodo();
            } else setIsTodoEditable((prev) => !prev);
          }}
          disabled={todo.completed}
        >
          {isTodoEditable ? '📁' : '✏️'}
        </button>
        {/* Delete Todo Button */}
        <button
          className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
          onClick={() => deleteHandler(index)}
        >
          ❌
        </button>
      </div>
    </li>
  );
}

// Separate TaskList component
const TaskList = ({ tasks, completeHandler, deleteHandler, editHandler }) => (
  <ul className="list-none w-full md:w-[35%] px-4">
    {tasks.length > 0 ? (
      tasks.map((task, index) => (
        <TodoItem
          key={task.id}
          todo={task}
          index={index}
          completeHandler={completeHandler}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
        />
      ))
    ) : (
      <h1 className="mt-10 w-full text-center text-orange-600 text-3xl">No Pending Tasks</h1>
    )}
  </ul>
);

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (title.trim()) {
      if (editIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex].title = title.trim();
        setTasks(updatedTasks);
        setEditIndex(-1);
      } else {
        const newTask = { id: nanoid(), title: title.trim(), completed: false };
        setTasks([...tasks, newTask]);
      }
      setTitle('');
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  };

  const completeHandler = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteHandler = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const editHandler = (index, newTitle) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].title = newTitle;
    setTasks(updatedTasks);
    setEditIndex(-1);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="overflow-x-hidden border-t-2 w-screen min-h-[100vh] bg-zinc-800 flex items-center flex-col">
      <div className="mt-[3%] w-full md:w-[35%] h-[20vh] border rounded-3xl flex justify-around items-center">
        <div className="text-yellow-100">
          <h1 className="text-3xl font-bold">LET'S TODO</h1>
          <p>Keeps doing things</p>
        </div>
        <div className="text-3xl font-extrabold flex justify-center items-center w-[8vmax] h-[8vmax] rounded-full bg-orange-600">
          {tasks.filter((t) => t.completed).length}/{tasks.length}
        </div>
      </div>
      <form onSubmit={submitHandler} className="w-full md:w-[35%] flex justify-between px-5 my-[2%]">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder={editIndex !== -1 ? 'Edit task' : 'Write your next task...'}
          className="px-5 py-2 text-yellow-100 outline-none w-[80%] rounded-xl bg-zinc-700"
          type="text"
        />
        <button
          type="submit"
          className="outline-none text-4xl font-extrabold flex justify-center items-center w-[5vmax] h-[5vmax] rounded-full bg-orange-600"
        >
          {editIndex !== -1 ? <i className="ri-edit-line"></i> : <i className="ri-add-fill"></i>}
        </button>
      </form>
      <TaskList
        tasks={tasks}
        completeHandler={completeHandler}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
      />
    </div>
  );
};

export default App;