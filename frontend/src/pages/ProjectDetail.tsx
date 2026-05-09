import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "sonner";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    api.get(`/projects/${id}`).then(r => setProject(r.data)).catch(() => navigate("/projects"));
  }, [id]);

  if (!project) return <div className="p-6 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;

  const handleStatusToggle = async () => {
    const newStatus = project.status === "completed" ? "active" : "completed";
    try {
      const { data } = await api.put(`/projects/${id}`, { status: newStatus });
      setProject(data);
      toast.success(`Marked as ${newStatus}`);
    } catch { toast.error("Failed to update"); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project permanently?")) return;
    try { await api.delete(`/projects/${id}`); toast.success("Deleted"); navigate("/projects"); }
    catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <button onClick={() => navigate("/projects")} className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to Projects</button>
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-gray-500 mt-2 leading-relaxed">{project.description || "No description"}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
            project.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          }`}>{project.status}</span>
          <button onClick={handleStatusToggle}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            Mark as {project.status === "completed" ? "Active" : "Completed"}
          </button>
          <button onClick={handleDelete}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
            Delete
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">Created: {new Date(project.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
