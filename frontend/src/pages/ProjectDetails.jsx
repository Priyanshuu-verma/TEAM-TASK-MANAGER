import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '', dueDate: '', status: 'To Do', assignedTo: ''
    });

    const config = { headers: { Authorization: `Bearer ${user?.token}` } };

    const fetchData = async () => {
        try {
            const taskRes = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/${id}`, config);
            setTasks(taskRes.data);
            if (user?.role === 'Admin') {
                const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`, config);
                setUsers(userRes.data);
            }
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, [id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, { ...newTask, projectId: id }, config);
            setShowTaskModal(false);
            setNewTask({ title: '', dueDate: '', status: 'To Do', assignedTo: '' });
            fetchData();
        } catch (err) {
            alert("Error creating task. Please try again.");
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        try {
            setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${taskId}/status`, { status: newStatus }, config);
            fetchData();
        } catch (err) {
            alert("Only the assigned user or Admin can update status");
            fetchData();
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
        e.currentTarget.style.opacity = "0.4";
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = "1";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const task = tasks.find(t => t._id === taskId);
        if (task && task.status !== newStatus) {
            await updateStatus(taskId, newStatus);
        }
    };

    const columns = ['To Do', 'In Progress', 'Review', 'Completed'];

    return (
        <div className="relative min-h-screen bg-slate-50 font-sans overflow-hidden p-4 sm:p-8">

            {/* Background gradients */}
            <div className="fixed top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 max-w-[90rem] mx-auto">

                {/* Back Navigation */}
                <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-lg transition-all duration-300 mb-8">
                    <span>←</span> Back to Workspace
                </Link>

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">Project Board</h2>
                        <p className="text-sm font-medium text-slate-500 mt-2">Drag and drop tasks to update progress.</p>
                    </div>
                    {user?.role === 'Admin' && (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                            <button
                                onClick={() => setShowTaskModal(true)}
                                className="relative px-8 py-3.5 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all duration-300 transform group-hover:-translate-y-1 flex items-center gap-2 shadow-xl"
                            >
                                <span className="text-lg leading-none">+</span> Add Task
                            </button>
                        </div>
                    )}
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {columns.map(col => {
                        const columnTasks = tasks.filter(t => t.status === col);
                        return (
                            <div
                                key={col}
                                className="bg-white/40 backdrop-blur-2xl p-5 rounded-[2.5rem] flex flex-col max-h-[75vh] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, col)}
                            >
                                {/* Column Header */}
                                <div className="flex justify-between items-center mb-6 px-3">
                                    <h3 className="font-black text-slate-700 uppercase text-xs tracking-[0.2em]">{col}</h3>
                                    <span className="bg-white/60 text-slate-800 px-3 py-1 rounded-full text-[10px] font-black shadow-sm border border-white/50">
                                        {columnTasks.length}
                                    </span>
                                </div>

                                {/* Task List */}
                                <div className="space-y-4 overflow-y-auto kanban-scroll flex-1 pr-2 pb-4">
                                    {columnTasks.map(task => (
                                        <div
                                            key={task._id}
                                            draggable
                                            onDragStart={(e) => {
                                                handleDragStart(e, task._id);
                                                e.currentTarget.classList.add('scale-95', 'rotate-2', 'shadow-2xl');
                                            }}
                                            onDragEnd={(e) => {
                                                handleDragEnd(e);
                                                e.currentTarget.classList.remove('scale-95', 'rotate-2', 'shadow-2xl');
                                            }}
                                            className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/80 cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-200 group"
                                        >
                                            <h4 className="font-black text-slate-800 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">{task.title}</h4>

                                            <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-sm
                                                    ${task.assignedTo?.name?.charAt(0).toUpperCase() > 'M' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}
                                                `}>
                                                    {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <span className="text-xs text-slate-600 font-bold tracking-wide">
                                                    {task.assignedTo?.name || 'Unassigned'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Empty State */}
                                    {columnTasks.length === 0 && (
                                        <div className="border-2 border-dashed border-slate-300/50 bg-white/20 rounded-[2rem] h-32 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest transition-colors hover:border-blue-300 hover:bg-blue-50/30">
                                            Drop Here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* New Task Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xl flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in duration-300">
                    <div className="relative bg-white/90 backdrop-blur-2xl rounded-[3.5rem] p-12 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60">

                        <div className="mb-10">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">New Task</h2>
                            <p className="text-slate-500 font-semibold text-sm">Assign a task to your team member.</p>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-8">

                            <div className="space-y-3">
                                <label className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.15em] ml-2">Task Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter task title"
                                    required
                                    className="w-full px-8 py-5 bg-slate-50/80 border-none rounded-[2rem] shadow-inner focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all duration-300 text-slate-700 font-bold placeholder-slate-400"
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.15em] ml-2">Deadline</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-8 py-5 bg-slate-50/80 border-none rounded-[2rem] shadow-inner focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all duration-300 text-slate-600 font-bold"
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.15em] ml-2">Assignee</label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full px-8 py-5 bg-slate-50/80 border-none rounded-[2rem] shadow-inner focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all duration-300 text-slate-700 font-bold appearance-none cursor-pointer"
                                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                    >
                                        <option value="">Select Team Member</option>
                                        {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowTaskModal(false)}
                                    className="px-8 py-4 text-slate-500 font-black text-sm hover:text-slate-800 transition-colors uppercase tracking-widest"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-12 py-5 bg-[#0f172a] text-white font-black rounded-[2rem] shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:bg-slate-800 hover:shadow-[0_15px_30px_rgba(15,23,42,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
                                >
                                    Assign Task
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;