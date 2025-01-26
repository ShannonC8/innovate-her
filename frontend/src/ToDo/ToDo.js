import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import './ToDo.css';

const ToDo = () => {
  const { userId, userName } = useUser(); // Use context to fetch user data
  const [userTodos, setUserTodos] = useState([]); // This will hold fetched todos from the database
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [compiledTodos, setCompiledTodos] = useState([]); // All compiled todos will be saved
  const [prompt, setPrompt] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Fetch the to-do items from the backend when the component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/todos/${userId}`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setUserTodos(data); // Store fetched to-dos from Firestore
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, [userId]);

  const addUserTodo = async () => {
    if (newTodo.trim()) {
      const newTask = { 
        userId, 
        title: newTodo.trim(), 
        description: newDescription.trim() 
      };

      try {
        const response = await fetch('http://localhost:5000/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask), // Send the new task to the backend
        });
        if (response.ok) {
          const data = await response.json();
          setUserTodos([...userTodos, newTask]); // Update UI to reflect changes
          setNewTodo('');
          setNewDescription('');
        }
      } catch (error) {
        console.error('Error adding to-do:', error);
      }
    }
  };

  const deleteTodo = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the UI by removing the deleted todo
        setUserTodos(userTodos.filter(todo => todo.taskId !== taskId));
      } else {
        console.error('Error deleting to-do');
      }
    } catch (error) {
      console.error('Error deleting to-do:', error);
    }
  };

  const generateAiSuggestions = async () => {
    if (!prompt.trim()) return;
  
    try {
        console.log(userId)
        console.log(prompt)
      const response = await fetch('http://localhost:5000/api/generate-todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: prompt, user_id: userId, userName }), // Change "prompt" to "input"
      });
  
      const data = await response.json();
      const suggestions = data.todos || [];
      const formattedSuggestions = suggestions.map(task => ({
        title: task.title,
        description: task.description || '',
      }));
  
      // Store the formatted suggestions
      setAiSuggestions(formattedSuggestions || []);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
    }
  };
  

  const addAiSuggestion = async (suggestion) => {
    const newTask = { 
      userId, 
      title: suggestion.title, 
      description: suggestion.description 
    };

    // Add the task to the user's to-do list (send it to the backend)
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask), // Send the new task to the backend
      });
      if (response.ok) {
        // Add the task to the user's to-do list and remove from suggestions
        setUserTodos([...userTodos, newTask]);
        setAiSuggestions(aiSuggestions.filter(item => item.title !== suggestion.title));
      }
    } catch (error) {
      console.error('Error adding AI suggestion:', error);
    }
  };

  const clearSuggestions = () => {
    setAiSuggestions([]); // Clear all the AI suggestions
  };

  return (
    <div className="todo-app">
      {/* User's Todo Input */}
      <div className="todo-user-list">
        <h2>Your To-Dos</h2>
        <div className="add-todo">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new to-do"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add a description"
          />
          <button onClick={addUserTodo}>Add</button>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="ai-suggestions">
        <h2>AI Suggestions</h2>
        <div className="prompt">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to suggest tasks"
          />        
        
        </div>
        <button onClick={() => { clearSuggestions(); generateAiSuggestions(); }}>
                Generate
            </button>
        <ul>
          {aiSuggestions.map((suggestion, index) => (
            <li key={index}>
              <strong>{suggestion.title}</strong>: {suggestion.description}{' '}
              <button onClick={() => addAiSuggestion(suggestion)}>Add</button>
            </li>
          ))}
        </ul>
      </div>

      {/* User's To-Do List */}
      <div className="todo-main-list">
        <h2>To-Do List</h2>
        <ul>
          {userTodos.map((todo, index) => (
            <li key={index}>
              <strong>{todo.title}</strong>
              {todo.description && <p>{todo.description}</p>}
              <button onClick={() => deleteTodo(todo.taskId)}>X</button> {/* X for deleting the todo */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ToDo;
