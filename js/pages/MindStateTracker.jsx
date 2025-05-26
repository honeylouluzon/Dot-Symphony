import React, { useState } from "react";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function MindStateTracker() {
  const [selectedHour, setSelectedHour] = useState(null);
  const [journal, setJournal] = useState("");
  const [log, setLog] = useState({});

  function handleHourClick(hour) {
    setSelectedHour(hour);
    setJournal(log[hour]?.journal || "");
  }

  function handleSave() {
    setLog((prev) => ({
      ...prev,
      [selectedHour]: { journal },
    }));
    setSelectedHour(null);
    setJournal("");
  }

  return (
    <div>
      <h2>Mind State Tracker</h2>
      <div className="ds-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)", marginBottom: 24 }}>
        {HOURS.map((h) => (
          <Button
            key={h}
            className={selectedHour === h ? "active" : ""}
            aria-label={`Log mind state for hour ${h}`}
            onClick={() => handleHourClick(h)}
          >
            {h}:00
          </Button>
        ))}
      </div>
      {selectedHour !== null && (
        <div className="ds-card">
          <h3>Log for {selectedHour}:00</h3>
          <InputField
            label="Journal Entry"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="How did you feel this hour?"
            required
          />
          <Button onClick={handleSave}>Save Entry</Button>
        </div>
      )}
      <div style={{ marginTop: 32 }}>
        <h3>Today's Log</h3>
        <ul>
          {Object.entries(log).map(([hour, entry]) => (
            <li key={hour}>
              <strong>{hour}:00</strong>: {entry.journal}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
