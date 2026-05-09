import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_projects: 0, completed: 0, in_progress: 0, completion_rate: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/dashboard/stats").then(res => {
      setStats(res.data.stats);
      setChartData(res.data.chart_data || []);
    }).catch(() => {});
  }, []);

  const pieData = [
    { name: "Completed", value: stats.completed || 1 },
    { name: "In Progress", value: stats.in_progress || 1 },
    { name: "Remaining", value: Math.max(1, stats.total_projects - stats.completed - stats.in_progress) },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-1">Welcome, {user?.full_name || "Student"}!</h1>
      <p className="text-gray-500 mb-6">Your Real-Time Study Group Finder project overview</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: stats.total_projects, color: "bg-blue-50 text-blue-600", icon: "📊" },
          { label: "Completed", value: stats.completed, color: "bg-green-50 text-green-600", icon: "✅" },
          { label: "In Progress", value: stats.in_progress, color: "bg-amber-50 text-amber-600", icon: "🔄" },
          { label: "Completion", value: stats.completion_rate + "%", color: "bg-purple-50 text-purple-600", icon: "🎯" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium opacity-70">{s.label}</p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-semibold mb-4">Project Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" strokeWidth={0} label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-semibold mb-4">Progress Timeline</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="progress" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-3">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          ["React","Supabase","WebSocket","Tailwind CSS"].map((tech: string) => (
            <span key={tech} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">{tech}</span>
          ))
        </div>
      </div>
    </div>
  );
}
