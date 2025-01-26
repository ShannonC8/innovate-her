import React, { useState } from 'react';
import axios from 'axios';


function ToDo() {
  // State for the input string and the response
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Function to handle the input change
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // Function to handle the form submit
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

    try {
      // Send the input to the Flask API
      const response = await axios.post('http://127.0.0.1:5000/complete', { input });

      // Update the result state with the API response
      setResult(response.data.completed_text);
      setError('');
    } catch (error) {
      // Handle error from API
      setError('There was an error processing your request. Please try again.');
      setResult('');
    }
  };

  return (
    <div className="Todo">
      <h1>Complete String with AI</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your string here"
          rows="4"
          cols="50"
        />
        <br />
        <button type="submit">Complete</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div>
          <h2>Completed Text:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default ToDo;
