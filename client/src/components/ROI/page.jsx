import React, { useState } from "react";

const ROICalculator = () => {
    const [formData, setFormData] = useState({
        principal: "",
        rate: "",
        years: "",
        frequency: "yearly",
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateROI = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3001/api/calculate-roi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        setResult(data);
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Return on Investment Calculator
                </h2>

                {/* ✅ FORM FIXED: Now wraps all inputs & button */}
                <form className="space-y-6" onSubmit={calculateROI}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-gray-300 text-sm font-medium">
                                Initial Investment ($)
                            </label>
                            <input
                                type="number"
                                name="principal"
                                value={formData.principal}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-300 text-sm font-medium">
                                Expected Return Rate (%)
                            </label>
                            <input
                                type="number"
                                name="rate"
                                value={formData.rate}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-300 text-sm font-medium">
                                Investment Duration (Years)
                            </label>
                            <input
                                type="number"
                                name="years"
                                value={formData.years}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-300 text-sm font-medium">
                                Compounding Frequency
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="yearly">Yearly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 mt-8"
                    >
                        Calculate ROI
                    </button>
                </form>
                {/* ✅ FORM FIXED - Closing tag correctly placed */}

                {result && (
                    <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600">
                        <h3 className="text-2xl font-semibold text-white mb-4">Results</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-800 rounded-lg">
                                <p className="text-gray-400 text-sm">Final Amount</p>
                                <p className="text-2xl font-bold text-green-400">
                                    ${result.finalAmount}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-800 rounded-lg">
                                <p className="text-gray-400 text-sm">Interest Earned</p>
                                <p className="text-2xl font-bold text-blue-400">
                                    ${result.interestEarned}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ROICalculator;
