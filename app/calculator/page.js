"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Calculator() {
  const [year, setYear] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [error, setError] = useState(""); // For validation errors

  // Fetch available years from the backend
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await fetch("/api/getYears");
        const data = await res.json();
        setAvailableYears(data);
      } catch (error) {
        console.error("Failed to fetch years:", error);
      }
    };
    fetchYears();
  }, []);

  const calculate = async () => {
    // Validation
    if (!year) {
      setError("Please select a year.");
      return;
    }
    if (!income || isNaN(income)) {
      setError("Please enter a valid numerical income.");
      return;
    }

    // Reset error message
    setError("");

    // Perform calculation
    const res = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, income }),
    });
    const data = await res.json();
    setResult(data);
  };

  const handleRefresh = () => {
    setYear("");
    setIncome("");
    setResult(null);
    setError(""); // Clear errors
  };

  return (
    <div className="pt-4 px-4 min-h-screen bg-black">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-center mt-5">
          {/*<Link
            href="/taxparameters"
            className="mt-3 bg-slate-500 px-4 py-2 text-white rounded-md flex items-center justify-center gap-2 w-fit"
          >
             <span className="text-1xl">⬅️ </span>
            <span className="text-xs">
              <span className="flex justify-center">Add or Update</span>
              Tax & NI Parameters
            </span>
          </Link>*/}
        </div>

        {/* This section can be used if you want to expand the capability of this application */}
        {/*<Link
          className="mt-2 underline underline-offset-4 flex justify-center"
          href="/complextaxtabs"
        >
          Tabs
        </Link>*/}
      </div>

      {/* Calculator Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-lg font-bold flex justify-center">
          Basic Tax & NI Calculator
        </h1>
        <p className="text-xs flex justify-center">
          Excludes Scotland & Special Allowances
        </p>
        <div className="flex justify-center mt-2">
          <Link
            href="/taxparameters"
            className="mt-3 bg-slate-500 px-4 py-2 mb-5 text-white rounded-md flex items-center justify-center gap-2 w-fit"
          >
            {/* <span className="text-1xl">⬅️ </span>*/}
            <span className="text-xs">
              <span className="flex justify-center">Add or Update</span>
              Tax & NI Parameters
            </span>
          </Link>
        </div>

        {/* Year Dropdown */}
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            className="flex-1 border p-2 pr-6 rounded-md appearance-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          <input
            className="flex-1 border p-2 rounded-md"
            placeholder="Annual Income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-md w-1/2 md:w-auto ${
              year && income && !isNaN(income)
                ? "bg-slate-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={calculate}
            disabled={!year || !income || isNaN(income)} // Disable if invalid
          >
            Calculate
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md w-1/2 md:w-auto"
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="grid gap-4 mt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Tax Box */}
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow">
              <p className="font-bold text-slate-700">Annual Income Tax</p>
              <p>@ 20% = £{result.tax20.toFixed(2)}</p>
              <p>@ 40% = £{result.tax40.toFixed(2)}</p>
              <p>@ 45% = £{result.tax45.toFixed(2)}</p>
              <p className="mt-1">Total = £{result.incomeTax.toFixed(2)}</p>
            </div>

            {/* National Insurance Box */}
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow">
              <p className="font-bold text-slate-700">
                Annual National Insurance
              </p>
              <p>Employed: £{result.nationalInsurance.toFixed(2)}</p>
              <p>Self Employed: £{result.senationalInsurance.toFixed(2)}</p>
              <p>Pensioner: £0</p>
            </div>

            {/* Deductions Box */}
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow">
              <p className="font-bold text-slate-700">Annual Deductions</p>
              <p>
                Employed: £
                {(result.incomeTax + result.nationalInsurance).toFixed(2)}
              </p>
              <p>
                Self-Employed: £
                {(result.incomeTax + result.senationalInsurance).toFixed(2)}
              </p>
              <p>Pensioner: £{result.incomeTax.toFixed(2)}</p>
            </div>

            {/* Net Income Box */}
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow">
              <p className="font-bold text-slate-700">Net Income per month</p>
              <p>
                Employed: £
                {(
                  (result.income -
                    result.incomeTax -
                    result.nationalInsurance) /
                  12
                ).toFixed(2)}
              </p>
              <p>
                Self-Employed: £
                {(
                  (result.income -
                    result.incomeTax -
                    result.senationalInsurance) /
                  12
                ).toFixed(2)}
              </p>
              <p>
                Pensioner: £
                {((result.income - result.incomeTax) / 12).toFixed(2)}
              </p>
            </div>

            {/* Effective Tax Rate Box */}
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow">
              <p className="font-bold text-slate-700">Effective Tax Rate</p>
              <p>
                Employed:{" "}
                {(
                  ((result.incomeTax + result.nationalInsurance) / income) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p>
                Self-Employed:{" "}
                {(
                  ((result.incomeTax + result.senationalInsurance) / income) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p>
                Pensioner: {((result.incomeTax / income) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
