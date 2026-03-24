import { useState } from "react";

function Controls({ onSearch }) {
  const [purpose, setPurpose] = useState("quick_bite");
  const [budget, setBudget] = useState("medium");

  const handleSearch = () => {
    if (onSearch && typeof onSearch === 'function') {
      onSearch(purpose, budget);
    }
  };

  return (
    <div className="controls">
      <div className="control-group">
        <label htmlFor="purpose">Purpose:</label>
        <select 
          id="purpose"
          value={purpose} 
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="quick_bite">Quick Bite 🍔</option>
          <option value="workout">Workout 💪</option>
          <option value="date">Date Night 🌹</option>
          <option value="work">Work/Study 📚</option>
          <option value="budget">Budget Friendly 💰</option>
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="budget">Budget:</label>
        <select 
          id="budget"
          value={budget} 
          onChange={(e) => setBudget(e.target.value)}
        >
          <option value="low">Low ($)</option>
          <option value="medium">Medium ($$)</option>
          <option value="high">High ($$$)</option>
        </select>
      </div>

      <button onClick={handleSearch} className="search-btn">
        🔍 Find Places Near Me
      </button>
    </div>
  );
}

export default Controls;