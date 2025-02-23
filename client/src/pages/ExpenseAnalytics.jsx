import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, TrendingUp, AlertTriangle, Download, Loader2 } from 'lucide-react';

const ExpenseAnalytics = ({ expenses, stats, categories }) => {
  const [analysisReport, setAnalysisReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAnalysisPrompt = () => {
    const expenseData = {
      total: stats.total,
      averageDaily: stats.avgDaily,
      categoryTotals: stats.categoryTotals,
      categories: categories.map(cat => ({
        ...cat,
        spent: stats.categoryTotals?.[cat.id] || 0,
        percentageOfBudget: ((stats.categoryTotals?.[cat.id] || 0) / cat.budget) * 100
      }))
    };

    return {
      role: "user",
      content: `Analyze this expense data and provide insights:
        Total Spent: $${expenseData.total}
        Daily Average: $${expenseData.averageDaily}
        Category Breakdown: ${JSON.stringify(expenseData.categories)}
        
        Please provide:
        1. Key spending insights
        2. Budget compliance analysis
        3. Saving opportunities
        4. Risk areas
        5. Recommendations for improvement`
    };
  };

  const analyzeExpenses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate Groq API call with analysis logic
      const analysis = {
        insights: generateInsights(),
        budgetAnalysis: analyzeBudget(),
        savingOpportunities: findSavingOpportunities(),
        risks: identifyRisks(),
        recommendations: generateRecommendations()
      };

      setAnalysisReport(analysis);
    } catch (error) {
      setError('Failed to generate expense analysis');
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = () => {
    const highestCategory = Object.entries(stats.categoryTotals || {})
      .sort((a, b) => b[1] - a[1])[0];
    const categoryName = categories.find(cat => cat.id === highestCategory?.[0])?.label;

    return {
      topSpending: categoryName,
      spendingAmount: highestCategory?.[1],
      dailyAverage: stats.avgDaily,
      totalExpenses: stats.total
    };
  };

  const analyzeBudget = () => {
    return categories.map(cat => ({
      category: cat.label,
      budget: cat.budget,
      spent: stats.categoryTotals?.[cat.id] || 0,
      status: ((stats.categoryTotals?.[cat.id] || 0) > cat.budget) ? 'over' : 'within'
    }));
  };

  const findSavingOpportunities = () => {
    return categories
      .map(cat => ({
        category: cat.label,
        potential: Math.max(0, (stats.categoryTotals?.[cat.id] || 0) - cat.budget),
        percentage: ((stats.categoryTotals?.[cat.id] || 0) / cat.budget) * 100
      }))
      .filter(opp => opp.potential > 0)
      .sort((a, b) => b.potential - a.potential);
  };

  const identifyRisks = () => {
    return categories
      .filter(cat => (stats.categoryTotals?.[cat.id] || 0) > cat.budget * 1.2)
      .map(cat => ({
        category: cat.label,
        overagePercentage: (((stats.categoryTotals?.[cat.id] || 0) - cat.budget) / cat.budget) * 100
      }));
  };

  const generateRecommendations = () => {
    const recommendations = [];
    const overBudgetCategories = categories.filter(
      cat => (stats.categoryTotals?.[cat.id] || 0) > cat.budget
    );

    overBudgetCategories.forEach(cat => {
      recommendations.push({
        category: cat.label,
        action: `Reduce ${cat.label} expenses by ${(((stats.categoryTotals?.[cat.id] || 0) - cat.budget) / stats.categoryTotals?.[cat.id] * 100).toFixed(1)}%`,
        impact: 'High'
      });
    });

    return recommendations;
  };

  useEffect(() => {
    analyzeExpenses();
  }, [expenses, stats, categories]);

  if (isLoading) {
    return (
      <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl border border-gray-700 p-6 flex items-center justify-center h-96">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          <p className="text-white">Generating AI Analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <div className="text-red-400 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!analysisReport) return null;

  return (
    <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-400" />
          AI Expense Analysis Report
        </h2>
        <button className="p-2 text-blue-400 hover:text-blue-300 transition-colors">
          <Download className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Key Insights */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Top Spending Category</span>
                <span className="text-white font-medium">
                  {analysisReport.insights.topSpending}
                </span>
              </div>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Daily Average</span>
                <span className="text-white font-medium">
                  ${analysisReport.insights.dailyAverage?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Analysis */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Budget Compliance</h3>
          <div className="space-y-3">
            {analysisReport.budgetAnalysis.map((item, index) => (
              <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${
                      item.status === 'over' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      ${item.spent.toFixed(2)} / ${item.budget}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">AI Recommendations</h3>
          <div className="space-y-3">
            {analysisReport.recommendations.map((rec, index) => (
              <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium">{rec.category}</span>
                    <p className="text-gray-400 text-sm mt-1">{rec.action}</p>
                  </div>
                  <span className="text-yellow-400 text-sm">{rec.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Areas */}
        {analysisReport.risks.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Risk Areas</h3>
            <div className="space-y-3">
              {analysisReport.risks.map((risk, index) => (
                <div key={index} className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400">{risk.category}</span>
                    <span className="text-red-400">
                      {risk.overagePercentage.toFixed(1)}% over budget
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseAnalytics;