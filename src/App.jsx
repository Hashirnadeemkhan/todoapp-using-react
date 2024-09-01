import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  // Load todos from local storage when the app first loads
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  // Save todos to local storage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
  };

  const handleEdit = (e, id) => {
    let t = todos.filter(item => item.id === id);
    setTodo(t[0].todo);
    setTodos(todos.filter(item => item.id !== id));
  };

  const handleDelete = (e, id) => {
    let isConfirmed = window.confirm("Are you sure you want to delete this todo");
    isConfirmed && setTodos(todos.filter(item => item.id !== id));
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckBox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => item.id === id);
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
  };

  return (
    <>
      <div className='flex justify-center items-center flex-col min-h-screen bg-gray-100'>
        <Navbar />
        <div className='container bg-red-200 m-5 p-5 min-h-[70vh] w-full max-w-4xl rounded-lg shadow-lg'>
          <div className='addTodo'>
            <h2 className='text-3xl font-bold'>Add Todos</h2>
            <div className='flex flex-col md:flex-row md:items-center mt-4'>
              <input onChange={handleChange} value={todo} className='w-full md:w-3/4 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300' type="text" placeholder="Enter your todo..." />
              <button disabled={todo.length <= 3} onClick={handleAdd} className='font-bold text-lg p-2 m-2 border-zinc-400 bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed'>Save</button>
            </div>
          </div>
          <h2 className='text-lg font-bold mt-8'>Your Todos</h2>
          <div className='todos flex flex-col justify-between items-center text-center mt-10'>
            {todos.length === 0 && <div className='font-bold text-lg text-blue-600 underline'>No todo to display</div>}
            {todos.map(item => {
              return (
                <div key={item.id} className='todo flex flex-col md:flex-row w-full md:w-3/4 justify-between items-center bg-white p-4 rounded-lg shadow-md mt-4'>
                  <div className='flex items-center'>
                    <input name={item.id} onChange={handleCheckBox} type="checkbox" checked={item.isCompleted} className='mr-2'/>
                    <div className={`text ${item.isCompleted ? 'line-through' : ''}`}>{item.todo}</div>
                  </div>
                  <div className='buttons flex mt-4 md:mt-0'>
                    <button onClick={(e) => { handleEdit(e, item.id) }} className='font-bold text-lg p-2 m-2 border-zinc-400 bg-blue-500 text-white rounded-lg hover:bg-blue-600'><FaEdit /></button>
                    <button onClick={(e) => { handleDelete(e, item.id) }} className='font-bold text-lg p-2 m-2 border-zinc-400 bg-red-500 text-white rounded-lg hover:bg-red-600'><AiFillDelete /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
