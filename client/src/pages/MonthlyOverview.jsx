import { groupBy, sumBy } from 'lodash';
import { TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Process data function
const processMonthlyData = (expenses) => {
  // Group expenses by month
  const groupedByMonth = groupBy(expenses, (expense) => {
    const date = new Date(expense.date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

  // Calculate total amount for each month
  return Object.entries(groupedByMonth).map(([monthKey, monthExpenses]) => {
    const [year, month] = monthKey.split('-');
    return {
      date: new Date(parseInt(year), parseInt(month) - 1, 1),
      amount: sumBy(monthExpenses, 'amount'),
      count: monthExpenses.length
    };
  }).sort((a, b) => a.date - b.date);
};

// Monthly Overview Component
const MonthlyOverview = ({ expenses }) => {
  const monthlyData = processMonthlyData(expenses);

  return (
    <div className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
        Monthly Overview
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              tickFormatter={(date) => {
                const d = new Date(date);
                return d.toLocaleDateString('en-US', { 
                  month: 'short',
                  year: '2-digit'
                });
              }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff'
              }}
              labelFormatter={(date) => {
                const d = new Date(date);
                return d.toLocaleDateString('en-US', { 
                  month: 'long',
                  year: 'numeric'
                });
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Total']}
            />
            <Legend />
            <Bar 
              dataKey="amount" 
              name="Monthly Total" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            >
              <LabelList 
                dataKey="count" 
                position="top" 
                content={({ x, y, width, value }) => (
                  <text
                    x={x + width / 2}
                    y={y - 10}
                    fill="#9CA3AF"
                    textAnchor="middle"
                    fontSize={12}
                  >
                    {`${value} items`}
                  </text>
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyOverview;