import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createProject, fetchProjects } from '../api/projectApi';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await createProject(newProject);
      setProjects([...projects, created]);
      setShowModal(false);
      setNewProject({ title: '', description: '' });
    } catch (err) {
      alert("Only Admins can create new projects.");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Background decorations */}
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-5%] w-[35rem] h-[35rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[40rem] h-[40rem] bg-pink-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/60 px-8 py-4 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-40 group-hover:opacity-80 transition duration-500"></div>
            <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">TM</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight hidden sm:block">TaskMaster</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] leading-none mb-1">Logged In As</p>
            <p className="text-sm font-bold text-slate-700">{user?.name}</p>
          </div>
          <button 
            onClick={logout} 
            className="bg-pink-50/80 backdrop-blur-sm text-pink-600 border border-pink-100 px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-pink-100 hover:shadow-lg hover:shadow-pink-100 transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content area */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">Projects Dashboard</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage and track your team's work.</p>
          </div>
          
          {user?.role === 'Admin' && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
              <button 
                onClick={() => setShowModal(true)}
                className="relative px-8 py-3.5 bg-slate-900 text-white font-bold rounded-3xl hover:bg-slate-800 transition-all duration-300 transform group-hover:-translate-y-1 cursor-pointer flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span> New Project
              </button>
            </div>
          )}
        </div>

        {/* Project List */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-white/60 border-t-purple-600 rounded-full animate-spin shadow-xl"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse mt-4">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((p) => (
                <div 
                  key={p._id} 
                  onClick={() => navigate(`/project/${p._id}`)}
                  className="relative overflow-hidden bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 hover:bg-white/60 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="w-14 h-14 bg-gradient-to-br from-white to-blue-50 rounded-2xl mb-6 flex items-center justify-center shadow-sm border border-white group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-purple-600 to-blue-600">{p.title.charAt(0).toUpperCase()}</span>
                  </div>
                  
                  <h3 className="font-black text-2xl mb-3 text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 font-medium">{p.description}</p>
                  
                  <div className="flex items-center text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mt-auto">
                    View Tasks <span className="ml-2 group-hover:ml-4 group-hover:text-purple-500 transition-all">→</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-28 text-center bg-white/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-white/80 shadow-sm">
                <p className="text-slate-400 font-bold text-lg">No projects found. Create one to get started.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="relative bg-white/60 backdrop-blur-3xl rounded-[3rem] p-10 w-full max-w-md shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/80 overflow-hidden">
            
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/30 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">Create Project</h2>
            <p className="text-sm text-slate-500 mb-8 font-medium">Add details for your new project.</p>
            
            <form onSubmit={handleCreate} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Project Name</label>
                <input 
                  type="text" placeholder="e.g. Website Redesign" required
                  className="w-full px-6 py-4 bg-white/50 border border-white/80 rounded-3xl focus:bg-white focus:ring-4 focus:ring-purple-100/50 focus:outline-none transition-all shadow-inner text-slate-700 font-bold placeholder-slate-400"
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Description</label>
                <textarea 
                  placeholder="Enter project goals..." rows="3"
                  className="w-full px-6 py-4 bg-white/50 border border-white/80 rounded-3xl focus:bg-white focus:ring-4 focus:ring-purple-100/50 focus:outline-none transition-all shadow-inner text-slate-700 font-bold placeholder-slate-400"
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-black hover:bg-white/50 rounded-3xl transition-colors">Cancel</button>
                
                <div className="flex-1 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                  <button type="submit" className="relative w-full py-4 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all transform group-hover:-translate-y-1">
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;