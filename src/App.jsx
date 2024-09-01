import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [todo, setTodo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, dueDate, priority, category, tags: tags.split(',').map(tag => tag.trim()), isCompleted: false }]);
    setTodo("");
    setDueDate("");
    setPriority("low");
    setCategory("General");
    setTags("");
    toast.success("Todo added successfully!");
  };

  const handleEdit = (e, id) => {
    let t = todos.find(item => item.id === id);
    setTodo(t.todo);
    setDueDate(t.dueDate);
    setPriority(t.priority);
    setCategory(t.category);
    setTags(t.tags.join(', '));
    setTodos(todos.filter(item => item.id !== id));
  };

  const handleDelete = (e, id) => {
    let isConfirmed = window.confirm("Are you sure you want to delete this todo");
    if (isConfirmed) {
      setTodos(todos.filter(item => item.id !== id));
      toast.error("Todo deleted!");
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleCheckBox = (e) => {
    let id = e.target.name;
    setTodos(todos.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const filteredTodos = todos
    .filter(todoItem => {
      if (filter === "completed") return todoItem.isCompleted;
      if (filter === "incomplete") return !todoItem.isCompleted;
      return true; // Show all todos
    })
    .filter(todoItem => todoItem.todo.toLowerCase().includes(searchTerm.toLowerCase()));

  const sortedTodos = filteredTodos.sort((a, b) => {
    // Sorting by dueDate
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  const clearCompleted = () => {
    if (window.confirm("Are you sure you want to clear all completed todos?")) {
      setTodos(todos.filter(item => !item.isCompleted));
      toast.info("Cleared completed todos!");
    }
  };

  const notifyReminder = () => {
    if (Notification.permission === "granted") {
      new Notification("Todo Reminder", {
        body: "Don't forget to complete your todo!",
      });
    }
  };

  return (
    
    <div className={`flex justify-center items-center flex-col min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <Navbar />
      <div className={`container ${darkMode ? 'bg-gray-700' : 'bg-red-200'} m-5 p-5 min-h-[70vh] w-full max-w-4xl rounded-lg shadow-lg`}>
        <div className='flex justify-between items-center'>
          <h2 className='text-3xl font-bold'>{darkMode ? 'Dark Mode Todos' : 'Add Todos'}</h2>
          <button onClick={() => setDarkMode(!darkMode)} className='p-2 m-2 border rounded bg-gray-300 hover:bg-gray-400'>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className='flex flex-col md:flex-row md:items-center mt-4'>
          <input 
            onChange={handleChange} 
            value={todo} 
            className='w-full md:w-2/5 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300' 
            type="text" 
            placeholder="Enter your todo..." 
          />
          <input 
            type="date" 
            value={dueDate} 
            onChange={handleDueDateChange} 
            className='w-full md:w-1/5 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 mt-2 md:mt-0' 
          />
          <select 
            value={priority} 
            onChange={handlePriorityChange} 
            className='w-full md:w-1/5 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 mt-2 md:mt-0'
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select 
            value={category} 
            onChange={handleCategoryChange} 
            className='w-full md:w-1/5 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 mt-2 md:mt-0'
          >
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
          <input 
            type="text" 
            value={tags} 
            onChange={handleTagsChange} 
            className='w-full md:w-1/5 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 mt-2 md:mt-0' 
            placeholder="Tags (comma separated)" 
          />
          <button 
            disabled={todo.length <= 3} 
            onClick={handleAdd} 
            className='font-bold text-lg p-2 m-2 border-zinc-400 bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed'
          >
            Save
          </button>
        </div>
        <div className='flex flex-col md:flex-row md:items-center mt-4'>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className='w-full md:w-3/4 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300' 
            placeholder="Search todos..." 
          />
          <button 
            onClick={clearCompleted} 
            className='font-bold text-lg p-2 m-2 border-zinc-400 bg-red-500 rounded-lg hover:bg-red-600'
          >
            Clear Completed
          </button>
        </div>
        <h2 className='text-lg font-bold mt-8'>Your Todos</h2>
        <div className='flex mb-4'>
          <button onClick={() => setFilter("all")} className='p-2 m-2 border rounded bg-gray-300 hover:bg-gray-400'>All</button>
          <button onClick={() => setFilter("completed")} className='p-2 m-2 border rounded bg-green-300 hover:bg-green-400'>Completed</button>
          <button onClick={() => setFilter("incomplete")} className='p-2 m-2 border rounded bg-yellow-300 hover:bg-yellow-400'>Incomplete</button>
        </div>
        <div className='todos flex flex-col justify-between items-center text-center mt-10'>
          {sortedTodos.length === 0 && <div className='font-bold text-lg text-blue-600 underline'>No todo to display</div>}
          {sortedTodos.map(item => (
            <div key={item.id} className='todo flex flex-col md:flex-row w-full md:w-3/4 justify-between items-center bg-white p-4 rounded-lg shadow-md mt-4'>
              <div className='flex items-center'>
                <input 
                  name={item.id} 
                  onChange={handleCheckBox} 
                  type="checkbox" 
                  checked={item.isCompleted} 
                  className='mr-2' 
                />
                <div className={`text ${item.isCompleted ? 'line-through' : ''}`}>
                  {item.todo}
                  {item.dueDate && <span className='text-sm text-gray-500'> (Due: {new Date(item.dueDate).toLocaleDateString()})</span>}
                </div>
                <span className={`priority ml-2 px-2 py-1 rounded ${item.priority === 'high' ? 'bg-red-500 text-white' : item.priority === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
                <span className='category ml-2 px-2 py-1 border rounded'>{item.category}</span>
              </div>
              <div className='buttons flex mt-4 md:mt-0'>
                <button 
                  onClick={(e) => handleEdit(e, item.id)} 
                  className='font-bold text-lg p-2 m-2 border-zinc-400 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={(e) => handleDelete(e, item.id)} 
                  className='font-bold text-lg p-2 m-2 border-zinc-400 bg-red-500 text-white rounded-lg hover:bg-red-600'
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  
}

export default App;
