"use client";
import { useState } from "react";

export default function TabsPage() {
  const [inputValue, setInputValue] = useState("");
  const [calculatedData, setCalculatedData] = useState(null);
  const [activeTab, setActiveTab] = useState("tab1");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    const num = Number(e.target.value);
    if (!isNaN(num)) {
      setCalculatedData(num);
    } else {
      setCalculatedData(null);
    }
  };

  const renderTabContent = () => {
    if (calculatedData === null) {
      return <p>Please enter a valid number to see calculations.</p>;
    }

    switch (activeTab) {
      case "tab1":
        return <p>Square: {calculatedData ** 2}</p>;
      case "tab2":
        return <p>Cube: {calculatedData ** 3}</p>;
      case "tab3":
        return <p>Square Root: {Math.sqrt(calculatedData).toFixed(2)}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h1>Tabs Example</h1>
      <div>
        <label htmlFor="inputValue">Enter a number:</label>
        <input
          id="inputValue"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a number"
        />
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("tab1")}
          className={activeTab === "tab1" ? "active" : ""}
        >
          Tab 1
        </button>
        <button
          onClick={() => setActiveTab("tab2")}
          className={activeTab === "tab2" ? "active" : ""}
        >
          Tab 2
        </button>
        <button
          onClick={() => setActiveTab("tab3")}
          className={activeTab === "tab3" ? "active" : ""}
        >
          Tab 3
        </button>
      </div>

      <div className="tab-content">{renderTabContent()}</div>

      <style jsx>{`
        .container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .tabs {
          margin-top: 20px;
        }

        .tabs button {
          margin-right: 10px;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          background: #f0f0f0;
          border-radius: 5px;
        }

        .tabs button.active {
          background: #0070f3;
          color: white;
        }

        .tab-content {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          background: #fafafa;
        }
      `}</style>
    </div>
  );
}
