import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./PeriodTracker.css";
import { useUser } from "../UserContext";

const PeriodTracker = ({ userEmail }) => {
  const { userId, userName } = useUser(); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isOnPeriod, setIsOnPeriod] = useState(false);
  const [mood, setMood] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [entries, setEntries] = useState({});

  useEffect(() => {
    const fetchEntries = async () => {
        try {
          console.log(userId)
          console.log(userName)
          if (!userId) return; 
          const formattedDate = selectedDate.toISOString().split("T")[0];
          const response = await axios.get(`http://127.0.0.1:5000/api/calendar-data?user_id=${userId}&date=${formattedDate}`);
          if (response.data) {
            console.log("hi ", response.data[0].notes)
            setNotes(response.data[0].notes || "");
            setIsOnPeriod(response.data[0].isOnPeriod || false);
            setMood(response.data[0].mood || 50);
            setEnergy(response.data[0].energy || 50);
          }
          console.log(response)
        } catch (error) {
          console.error("Error fetching entries:", error);
          setNotes("");
          setIsOnPeriod(false);
          setMood(50);
          setEnergy(50);
        }
      };
      

    fetchEntries();
  }, [selectedDate, userId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSaveNote = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    console.log(userId)
    try {
      await axios.post("http://127.0.0.1:5000/api/calendar-data", {
        user_id: userId,  
        date: formattedDate,
        notes,
        isOnPeriod,
        mood,
        energy,
      });
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };
  
  return (
    <div className="period-tracker">
      <div className="tracker-container">
        <div className="calendar-wrapper">
          <Calendar 
            onChange={handleDateChange} 
            value={selectedDate} 
            tileClassName={({ date }) => {
              const formattedDate = date.toISOString().split("T")[0];
              return entries[formattedDate]?.isOnPeriod ? "highlight-period" : "";
            }}
          />
        </div>
        <div className="details-card">
          <div className="card-content">
            <h2 className="details-title">Details for {selectedDate.toDateString()}</h2>
            <label className="form-label">
              On Period:
              <input
                type="checkbox"
                checked={isOnPeriod}
                onChange={(e) => setIsOnPeriod(e.target.checked)}
              />
            </label>
            <label className="form-label">
              Mood:
              <input
                type="range"
                min="0"
                max="100"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
              />
              <span>{mood}</span>
            </label>
            <label className="form-label">
              Energy:
              <input
                type="range"
                min="0"
                max="100"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
              />
              <span>{energy}</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for the day, e.g., energy levels, symptoms"
              className="note-input"
            />
            <button className="save-button" onClick={handleSaveNote}>
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;
