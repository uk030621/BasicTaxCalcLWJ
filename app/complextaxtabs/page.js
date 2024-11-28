// complextaxtabs/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TaxTabsPage() {
  const [activeTab, setActiveTab] = useState("tab1"); // Default to "tab1"

  // State for each tab's inputs and results
  const [tab1, setTab1] = useState({ year: "", income: "", result: null });
  const [tab2, setTab2] = useState({ hours: "", rate: "", result: null });
  const [tab3, setTab3] = useState({ revenue: "", expenses: "", result: null });

  const [availableYears, setAvailableYears] = useState([]); // Must be an array

  // Fetch available years from the backend
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await fetch("/api/getYears");
        if (!res.ok) throw new Error("Failed to fetch years");
        const data = await res.json();
        console.log("Fetched years:", data); // Debugging
        setAvailableYears(data); // Ensure this is an array
      } catch (error) {
        console.error("Failed to fetch years:", error);
      }
    };
    fetchYears();
  }, []);

  const handleCalculateTab1 = async () => {
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: tab1.year, income: tab1.income }),
      });
      const data = await res.json();
      console.log("Tab1 Calculation Result:", data); // Debugging
      setTab1((prev) => ({ ...prev, result: data }));
    } catch (error) {
      console.error("Calculation failed:", error);
    }
  };

  const handleCalculateTab2 = () => {
    const grossPay = tab2.hours * tab2.rate;
    setTab2((prev) => ({ ...prev, result: { grossPay } }));
  };

  const handleCalculateTab3 = () => {
    const profit = tab3.revenue - tab3.expenses;
    setTab3((prev) => ({ ...prev, result: { profit } }));
  };

  const renderTab1Content = () => (
    <div>
      <h2 className="text-lg font-bold mb-2">Annual Income Tax Calculator</h2>
      {/* Year Dropdown */}
      <select
        className="border p-2 pr-6 mr-2 mb-3 rounded-md appearance-none"
        value={tab1.year}
        onChange={(e) => {
          const year = e.target.value;
          console.log("Selected year:", year); // Debug log
          setTab1((prev) => ({ ...prev, year })); // Update state
        }}
      >
        <option value="">Select Year</option>
        {availableYears.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
      <input
        className="border p-2 mr-2 mb-3 rounded-md"
        placeholder="Annual Income"
        value={tab1.income}
        onChange={(e) =>
          setTab1((prev) => ({ ...prev, income: e.target.value }))
        }
      />
      <button
        className="bg-slate-500 text-white px-4 py-2 rounded-md"
        onClick={handleCalculateTab1}
      >
        Calculate
      </button>
      {tab1.result && (
        <div className="mt-4">
          <p className="mb-1 font-bold">Annual Income Tax...</p>
          <p>@ 20% = £{tab1.result.tax20.toFixed(2)}</p>
          <p>@ 40% = £{tab1.result.tax40.toFixed(2)}</p>
          <p>@ 45% = £{tab1.result.tax45.toFixed(2)}</p>
          <p className="mt-1 mb-3">
            Total = £{tab1.result.incomeTax.toFixed(2)}
          </p>
          <p>
            <span className="font-bold mb-3">Annual National Insurance...</span>
            <br />
            Employed: £{tab1.result.nationalInsurance.toFixed(2)}
            <br />
            Self Employed: £{tab1.result.senationalInsurance.toFixed(2)}
          </p>
          <p className="font-bold mt-3">Annual Deductions...</p>
          <p className="mb-3">
            Employed: £
            {(tab1.result.incomeTax + tab1.result.nationalInsurance).toFixed(2)}
            <br />
            Self Employed: £
            {(tab1.result.incomeTax + tab1.result.senationalInsurance).toFixed(
              2
            )}
          </p>
          <p className="mt-3 font-bold">Take home pay per month...</p>
          <p className="mb-3">
            Employed: £
            {(
              (tab1.result.income -
                tab1.result.incomeTax -
                tab1.result.nationalInsurance) /
              12
            ).toFixed(2)}
            <br></br>
            Self-Employed: £
            {(
              (tab1.result.income -
                tab1.result.incomeTax -
                tab1.result.senationalInsurance) /
              12
            ).toFixed(2)}
          </p>

          <p className="mt-3 font-bold">Effective Tax Rate...</p>
          <p>
            Employed:{" "}
            {(
              ((tab1.result.incomeTax + tab1.result.nationalInsurance) /
                tab1.income) *
              100
            ).toFixed(1)}
            %<br></br>
            Self-Employed:{" "}
            {(
              ((tab1.result.incomeTax + tab1.result.senationalInsurance) /
                tab1.income) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      )}
    </div>
  );

  const renderTab2Content = () => (
    <div>
      <h2 className="text-lg font-bold mb-2">Hourly Wage Calculator</h2>
      <input
        className="border p-2 mr-2 mb-3 rounded-md"
        placeholder="Hours Worked"
        value={tab2.hours}
        onChange={(e) =>
          setTab2((prev) => ({ ...prev, hours: e.target.value }))
        }
      />
      <input
        className="border p-2 mr-2 mb-3 rounded-md"
        placeholder="Hourly Rate"
        value={tab2.rate}
        onChange={(e) => setTab2((prev) => ({ ...prev, rate: e.target.value }))}
      />
      <button
        className="bg-slate-500 text-white px-4 py-2 rounded-md"
        onClick={handleCalculateTab2}
      >
        Calculate
      </button>
      {tab2.result && (
        <div className="mt-4">
          <p>Gross Pay: £{tab2.result.grossPay.toFixed(2)}</p>
        </div>
      )}
    </div>
  );

  const renderTab3Content = () => (
    <div>
      <h2 className="text-lg font-bold mb-2">Business Profit Calculator</h2>
      <input
        className="border p-2 mr-2 mb-3 rounded-md"
        placeholder="Revenue"
        value={tab3.revenue}
        onChange={(e) =>
          setTab3((prev) => ({ ...prev, revenue: e.target.value }))
        }
      />
      <input
        className="border p-2 mr-2 mb-3 rounded-md"
        placeholder="Expenses"
        value={tab3.expenses}
        onChange={(e) =>
          setTab3((prev) => ({ ...prev, expenses: e.target.value }))
        }
      />
      <button
        className="bg-slate-500 text-white px-4 py-2 rounded-md"
        onClick={handleCalculateTab3}
      >
        Calculate
      </button>
      {tab3.result && (
        <div className="mt-4">
          <p>Profit: £{tab3.result.profit.toFixed(2)}</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "tab1":
        return renderTab1Content();
      case "tab2":
        return renderTab2Content();
      case "tab3":
        return renderTab3Content();
      default:
        return <p>No content available</p>; // Default fallback
    }
  };

  return (
    <div className="p-4 mt-3 grid place-content-start bg-slate-100 min-h-screen">
      <Link
        href="/calculator"
        className=" bg-slate-500 px-6 py-2 text-white rounded-md flex items-center justify-center gap-2 w-fit"
      >
        <span className="text-lg">⬅️ Home</span>
      </Link>

      <div className="tabs mt-5">
        <button
          onClick={() => setActiveTab("tab1")}
          className={`mb-2 mr-2 px-4 py-2 rounded-md ${
            activeTab === "tab1" ? "bg-slate-500 text-white" : "bg-gray-200"
          }`}
        >
          Tax Calculator
        </button>
        <button
          onClick={() => setActiveTab("tab2")}
          className={`mr-2 px-4 py-2 rounded-md ${
            activeTab === "tab2" ? "bg-slate-500 text-white" : "bg-gray-200"
          }`}
        >
          Hourly Wage Calculator
        </button>
        <button
          onClick={() => setActiveTab("tab3")}
          className={`mt-2 px-4 py-2 rounded-md ${
            activeTab === "tab3" ? "bg-slate-500 text-white" : "bg-gray-200"
          }`}
        >
          Business Profit Calculator
        </button>
      </div>

      <div className="content mt-5">{renderContent()}</div>
    </div>
  );
}
