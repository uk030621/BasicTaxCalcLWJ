//app/page.js
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

export default function TaxParameters() {
  const [params, setParams] = useState([]); // Existing tax parameters
  const [errors, setErrors] = useState({});
  const [newParam, setNewParam] = useState({
    year: "",
    incomeTax: {
      personalAllowance: "",
      basicRate: "",
      higherRate: "",
      additionalRate: "",
      basicThreshold: "",
      higherThreshold: "",
      taperThreshold: "",
    },
    nationalInsurance: {
      primaryThreshold: "",
      upperEarningsLimit: "",
      primaryRate: "",
      upperRate: "",
      selfPrimaryRate: "",
      selfUpperRate: "",
    },
  });

  // Fetch existing parameters
  useEffect(() => {
    fetch("/api/tax-parameters")
      .then((res) => res.json())
      .then(setParams)
      .catch((err) => console.error("Error loading parameters:", err));
  }, []);

  // Add or update parameter
  const handleAddOrUpdate = async () => {
    // Validation logic
    const validateFields = () => {
      let validationErrors = {};
      // Validate income tax fields
      for (const key in newParam.incomeTax) {
        if (!newParam.incomeTax[key]) {
          validationErrors[`incomeTax.${key}`] = `${key} is required`;
        }
      }
      // Validate national insurance fields
      for (const key in newParam.nationalInsurance) {
        if (!newParam.nationalInsurance[key]) {
          validationErrors[`nationalInsurance.${key}`] = `${key} is required`;
        }
      }

      if (!newParam.year) {
        validationErrors.year = "Year is required";
      }

      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0; // Return true if no errors
    };

    // Perform validation before proceeding
    if (!validateFields()) {
      console.error("Validation failed");
      return;
    }

    const method = newParam._id ? "PUT" : "POST";
    const url = newParam._id
      ? `/api/tax-parameters/${newParam._id}` // Target dynamic route for PUT
      : "/api/tax-parameters"; // Standard POST route

    // Ensure all fields are properly structured
    const payload = {
      year: newParam.year,
      incomeTax: {
        personalAllowance: +newParam.incomeTax.personalAllowance || 0,
        basicRate: +newParam.incomeTax.basicRate || 0,
        higherRate: +newParam.incomeTax.higherRate || 0,
        additionalRate: +newParam.incomeTax.additionalRate || 0,
        basicThreshold: +newParam.incomeTax.basicThreshold || 0,
        higherThreshold: +newParam.incomeTax.higherThreshold || 0,
        taperThreshold: +newParam.incomeTax.taperThreshold || 0,
      },
      nationalInsurance: {
        primaryThreshold: +newParam.nationalInsurance.primaryThreshold || 0,
        upperEarningsLimit: +newParam.nationalInsurance.upperEarningsLimit || 0,
        primaryRate: +newParam.nationalInsurance.primaryRate || 0,
        upperRate: +newParam.nationalInsurance.upperRate || 0,
        selfPrimaryRate: +newParam.nationalInsurance.selfPrimaryRate || 0,
        selfUpperRate: +newParam.nationalInsurance.selfUpperRate || 0,
      },
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${method}`);
      }

      const updatedParam = await response.json();

      // Update the state with the new or updated parameter
      if (method === "PUT") {
        setParams((prev) =>
          prev.map((param) =>
            param._id === updatedParam._id ? updatedParam : param
          )
        );
      } else {
        setParams((prev) => [...prev, updatedParam]);
      }

      // Reset the form
      setNewParam({
        year: "",
        incomeTax: {
          personalAllowance: "",
          basicRate: "",
          higherRate: "",
          additionalRate: "",
          basicThreshold: "",
          higherThreshold: "",
          taperThreshold: "",
        },
        nationalInsurance: {
          primaryThreshold: "",
          upperEarningsLimit: "",
          primaryRate: "",
          upperRate: "",
          selfPrimaryRate: "",
          selfUpperRate: "",
        },
      });
      setErrors({});
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  // Delete parameter
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tax-parameters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete parameter");
      }

      setParams((prev) => prev.filter((param) => param._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleReload = () => {
    // Reset the form fields to their default state
    setNewParam({
      _id: "",
      year: "",
      incomeTax: {
        personalAllowance: "",
        basicRate: "",
        higherRate: "",
        additionalRate: "",
        basicThreshold: "",
        higherThreshold: "",
        taperThreshold: "",
      },
      nationalInsurance: {
        primaryThreshold: "",
        upperEarningsLimit: "",
        primaryRate: "",
        upperRate: "",
        selfPrimaryRate: "",
        selfUpperRate: "",
      },
    });
    setErrors({}); // Clear all errors
  };

  return (
    <div className="bg-black p-2 min-h-screen">
      {/* Wrapper for Calculate Tax button */}
      {/*<div className="flex justify-center mt-5">
        <Link
          href="\calculator"
          className="bg-slate-500 mt-3 mb-3 px-6 py-3 text-white rounded-md flex items-center justify-center gap-2 w-fit"
        >
          <span className="text-xs">Tax Calculator</span>
          {/*<span className="text-2xl"> ➡️</span>
        </Link>
      </div>*/}

      {/* Wrapper for Title Section */}
      <div className="flex flex-col items-center space-y-2 mt-3">
        {/* Title Section */}
        <h1 className="text-white text-lg font-bold text-center">
          Manage Tax & NI Parameters
        </h1>

        {/* Info Icon with Tooltip */}
        <div className="relative group inline-block">
          {/* Heroicons Info Symbol */}
          <InformationCircleIcon className="h-6 w-6 text-blue-500 cursor-pointer" />

          {/* Tooltip */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-64 bg-gray-700 text-white text-sm rounded-md px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Go to Official GOV.UK:
            <a
              href="https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2024-to-2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline ml-1 hover:text-blue-300"
            >
              Guidance - Rates and thresholds for employers 2024 to 2025
            </a>
            <br />
            <br />
            Go to Official GOV.UK:
            <a
              href="https://www.gov.uk/estimate-income-tax"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline ml-1 hover:text-blue-300"
            >
              Estimate your Income Tax for the current year
            </a>
          </div>
        </div>
      </div>
      {/*<div className="flex justify-center mt-5">
        <Link
          href="\calculator"
          className="bg-slate-500 mt-3 mb-3 px-6 py-3 text-white rounded-md flex items-center justify-center gap-2 w-fit"
        >
          <span className="text-xs">Tax Calculator</span>
          {/*<span className="text-2xl"> ➡️</span>*
        </Link>
      </div>*/}
      {/* Form Section */}
      <div className="bg-gray-100 p-4 mb-8 mt-3 rounded">
        <h2 className="font-bold mb-4">
          {newParam._id
            ? "Edit Tax & NI Parameters"
            : "Add New Tax & NI Parameters"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Year */}
          <div>
            <label className="block font-bold mb-1 text-sm">Tax Year</label>
            <input
              className="border p-2 w-full text-xs"
              type="number"
              placeholder="Year"
              value={newParam.year}
              onChange={(e) =>
                setNewParam({ ...newParam, year: +e.target.value })
              }
            />
          </div>

          {/* Income Tax Fields */}
          {Object.keys(newParam.incomeTax).map((key) => (
            <div key={key}>
              <label className="block font-bold mb-1 text-sm">
                {key
                  .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                  .toLowerCase() // Convert the entire string to lowercase
                  .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
              </label>
              <input
                className={`border p-2 w-full text-xs ${
                  errors[`incomeTax.${key}`] ? "border-red-500" : ""
                }`}
                type="number"
                placeholder={key
                  .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                  .toLowerCase() // Convert the entire string to lowercase
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                value={newParam.incomeTax[key]}
                onChange={(e) =>
                  setNewParam({
                    ...newParam,
                    incomeTax: {
                      ...newParam.incomeTax,
                      [key]: +e.target.value,
                    },
                  })
                }
              />
              {errors[`incomeTax.${key}`] && (
                <p className="text-red-500 text-xs">
                  {errors[`incomeTax.${key}`]}
                </p>
              )}
            </div>
          ))}

          {/* National Insurance Fields */}
          {Object.keys(newParam.nationalInsurance).map((key) => (
            <div key={key}>
              <label className="block font-bold mb-1 text-sm">
                {key
                  .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                  .toLowerCase() // Convert the entire string to lowercase
                  .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
              </label>
              <input
                className={`border p-2 w-full text-xs ${
                  errors[`nationalInsurance.${key}`] ? "border-red-500" : ""
                }`}
                type="number"
                placeholder={key
                  .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                  .toLowerCase() // Convert the entire string to lowercase
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                value={newParam.nationalInsurance[key]}
                onChange={(e) =>
                  setNewParam({
                    ...newParam,
                    nationalInsurance: {
                      ...newParam.nationalInsurance,
                      [key]: +e.target.value,
                    },
                  })
                }
              />
              {errors[`nationalInsurance.${key}`] && (
                <p className="text-red-500 text-xs">
                  {errors[`nationalInsurance.${key}`]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-center items-center mt-4">
          {/* Add/Update Button */}
          <button
            className="bg-slate-500 text-white px-4 py-2 rounded-md text-sm flex-1 text-center"
            onClick={handleAddOrUpdate}
          >
            {newParam._id ? "Update" : "Add"}
          </button>

          {/* Refresh/Reload Button */}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm flex-1 text-center"
            onClick={handleReload}
          >
            Refresh
          </button>

          {/* Link to Tax Calculator */}
          <Link
            href="/calculator"
            className="bg-slate-500 px-4 py-2 text-white rounded-md text-sm flex-1 text-center"
          >
            Calculator
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto max-h-96">
        <table className="table-auto w-full border-collapse">
          <thead className="text-left text-sm sticky top-0 bg-white z-10">
            <tr>
              <th className="border px-4 py-2 bg-gray-100">Tax Year</th>
              <th className="border px-4 py-2 bg-gray-100">Income Tax</th>
              <th className="border px-4 py-2 bg-gray-100">
                National Insurance
              </th>
              <th className="border px-4 py-2 bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {params
              .sort((a, b) => a.year - b.year) // Sort the parameters by year
              .map((p) => (
                <tr key={p._id} className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-4 py-2">
                    {p.year} / {+p.year + 1}
                  </td>
                  <td className="border px-4 py-2">
                    <ul>
                      {Object.entries(p.incomeTax).map(([key, value]) => (
                        <li className="mb-3" key={key}>
                          <strong>
                            {key
                              .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                              .toLowerCase() // Convert the entire string to lowercase
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
                            :
                          </strong>{" "}
                          {value}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    <ul>
                      {Object.entries(p.nationalInsurance).map(
                        ([key, value]) => (
                          <li className="mb-3" key={key}>
                            <strong>
                              {key
                                .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
                                .toLowerCase() // Convert the entire string to lowercase
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                              :
                            </strong>{" "}
                            {value}
                          </li>
                        )
                      )}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex flex-col">
                      <button
                        className="text-left mb-10"
                        onClick={() => setNewParam(p)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="text-left"
                        onClick={() => handleDelete(p._id)}
                      >
                        🗑️ Trash
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
