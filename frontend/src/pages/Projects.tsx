import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "sonner";

interface Project { id: string; title: string; description: string; status: string; created_at: string; }

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => { api.get("/projects").then(r => setProjects(r.data)).catch(() => {}); }, []);

  const handleCreate = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setCreating(true);
    try {
      const { data } = await api.post("/projects", { title, description: desc });
      setProjects([data, ...projects]);
      setTitle("");
      setDesc("");
      toast.success("Project created!");
    } catch { toast.error("Failed to create project"); }
    setCreating(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <h3 className="font-semibold mb-3">Create New Project</h3>
        <input placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <textarea placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border mb-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} />
        <button onClick={handleCreate} disabled={creating}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {creating ? "Creating..." : "Create Project"}
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📁</p>
          <p className="font-medium">No projects yet</p>
          <p className="text-sm">Create your first project above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`}
              className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow">
              <h4 className="font-semibold">{p.title}</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  p.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                }`}>{p.status}</span>
                <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
