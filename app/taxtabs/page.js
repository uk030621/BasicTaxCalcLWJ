"use client";
import { useState } from "react";
import Link from "next/link";

export default function TaxTabsPage() {
  const [year, setYear] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("tab1");

  const calculate = async () => {
    const res = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, income }),
    });
    const data = await res.json();
    setResult(data);
  };

  const renderTabContent = () => (
    <div>
      <h1 className="text-2xl font-bold mt-3 mb-2">
        Employee Tax & NI Calculator
      </h1>
      <div>
        <input
          className="border p-2 mr-2 mb-3 rounded-md"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          className="border p-2 mr-2 mb-3 rounded-md"
          placeholder="Annual Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={calculate}
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="mt-4">
          <p className="mb-1 font-bold">Annual Income Tax...</p>
          <p>@ 20% = £{result.tax20.toFixed(2)}</p>
          <p>@ 40% = £{result.tax40.toFixed(2)}</p>
          <p>@ 45% = £{result.tax45.toFixed(2)}</p>

          <p className="mt-1 mb-3">Total = £{result.incomeTax.toFixed(2)}</p>

          <p>
            <span className="font-bold mb-3">Annual National Insurance...</span>
            <br></br>£{result.nationalInsurance.toFixed(2)}
          </p>
          <p className="font-bold mt-3">Annual Deductions...</p>
          <p className="mb-3">
            £{(result.incomeTax + result.nationalInsurance).toFixed(2)}
          </p>
          <p className="mt-3 font-bold">Take home pay per month...</p>
          <p className="mb-3">
            £
            {(
              (result.income - result.incomeTax - result.nationalInsurance) /
              12
            ).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 mt-3">
      <Link
        href="\" // Adjust as needed
        className="ml-4 bg-blue-500 px-6 py-3 text-white rounded-md flex items-center justify-center gap-2"
      >
        <span className="text-lg">Tax & NI Parameters</span>
        <span className="text-4xl"> ➡️📅</span>
      </Link>

      <div className="tabs mt-5">
        <button
          onClick={() => setActiveTab("tab1")}
          className={`mr-2 px-4 py-2 rounded-md ${
            activeTab === "tab1" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Tab 1
        </button>
        <button
          onClick={() => setActiveTab("tab2")}
          className={`mr-2 px-4 py-2 rounded-md ${
            activeTab === "tab2" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Tab 2
        </button>
        <button
          onClick={() => setActiveTab("tab3")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "tab3" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Tab 3
        </button>
      </div>

      <div className="tab-content mt-5">{renderTabContent()}</div>

      <style jsx>{`
        .tabs button {
          cursor: pointer;
          border: none;
        }
        .tab-content {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: #f9f9f9;
        }
      `}</style>
    </div>
  );
}
