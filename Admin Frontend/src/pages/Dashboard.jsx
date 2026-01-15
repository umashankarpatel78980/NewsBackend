import { useState, useMemo, useEffect } from 'react';
import {
    Users,
    Newspaper,
    UserCheck,
    Activity,
    Clock,
    AlertCircle,
    CheckCircle2,
    PlusCircle,
    Settings,
    FileText,
    TrendingUp,
    MessageSquare,
    Eye,
    ThumbsUp,
    XCircle,
    Calendar,
    Filter
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    ScatterChart,
    Scatter,
    ZAxis,
    Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import './Dashboard.css';

const INITIAL_STATS = [
    { label: 'Total News', value: '1,280', change: '+12%', icon: Newspaper, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending News', value: '42', change: '+5', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Published News', value: '1,120', change: '+8%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Reported News', value: '18', change: '+2', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Total Users', value: '12,345', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Reporters', value: '86', change: '+3', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const MOCK_PENDING_NEWS = [
    { id: 1, title: 'Major Tech Breakthrough in AI', author: 'John Doe', date: '2023-10-25', status: 'Pending' },
    { id: 2, title: 'Local Sports Team Wins Finals', author: 'Jane Smith', date: '2023-10-24', status: 'Pending' },
    { id: 3, title: 'New Economic Policy Announced', author: 'Mike Ross', date: '2023-10-24', status: 'Pending' },
];

// Comprehensive data for charts across different timeframes
const TIME_DATA = {
    Today: {
        wave: [
            { name: '6am', val: 40 }, { name: '8am', val: 80 }, { name: '10am', val: 150 },
            { name: '12pm', val: 300 }, { name: '2pm', val: 240 }, { name: '4pm', val: 320 },
            { name: '6pm', val: 450 }, { name: '8pm', val: 380 }, { name: '10pm', val: 200 }
        ],
        bar: [
            { name: 'Pol', val: 12 }, { name: 'Sports', val: 8 }, { name: 'Tech', val: 15 },
            { name: 'Ent', val: 5 }, { name: 'World', val: 10 }, { name: 'Biz', val: 7 },
            { name: 'Style', val: 9 }, { name: 'Health', val: 4 }, { name: 'Loc', val: 11 }
        ],
        pie: [
            { name: 'Politics', value: 45 }, { name: 'Sports', value: 32 }, { name: 'Tech', value: 51 },
            { name: 'Entertainment', value: 24 }, { name: 'World', value: 38 }, { name: 'Business', value: 31 },
            { name: 'Lifestyle', value: 29 }, { name: 'Health', value: 21 }, { name: 'Local', value: 39 },
        ],
        dot: [
            { x: 10, y: 20 }, { x: 25, y: 45 }, { x: 40, y: 15 }, { x: 55, y: 85 },
            { x: 70, y: 40 }, { x: 85, y: 95 }, { x: 95, y: 60 }
        ]
    },
    Week: {
        wave: [
            { name: 'Mon', val: 400 }, { name: 'Tue', val: 300 }, { name: 'Wed', val: 600 },
            { name: 'Thu', val: 800 }, { name: 'Fri', val: 500 }, { name: 'Sat', val: 900 }, { name: 'Sun', val: 700 }
        ],
        bar: [
            { name: 'Pol', val: 85 }, { name: 'Sports', val: 60 }, { name: 'Tech', val: 110 },
            { name: 'Ent', val: 45 }, { name: 'World', val: 75 }, { name: 'Biz', val: 55 },
            { name: 'Style', val: 65 }, { name: 'Health', val: 40 }, { name: 'Loc', val: 80 }
        ],
        pie: [
            { name: 'Politics', value: 450 }, { name: 'Sports', value: 320 }, { name: 'Tech', value: 510 },
            { name: 'Entertainment', value: 240 }, { name: 'World', value: 380 }, { name: 'Business', value: 310 },
            { name: 'Lifestyle', value: 290 }, { name: 'Health', value: 210 }, { name: 'Local', value: 390 },
        ],
        dot: [
            { x: 100, y: 200 }, { x: 130, y: 150 }, { x: 160, y: 350 }, { x: 190, y: 280 },
            { x: 220, y: 450 }, { x: 250, y: 320 }, { x: 280, y: 500 }
        ]
    },
    Month: {
        wave: [
            { name: 'W1', val: 2000 }, { name: 'W2', val: 3500 }, { name: 'W3', val: 2800 }, { name: 'W4', val: 4200 }
        ],
        bar: [
            { name: 'Pol', val: 450 }, { name: 'Sports', val: 320 }, { name: 'Tech', val: 560 },
            { name: 'Ent', val: 210 }, { name: 'World', val: 380 }, { name: 'Biz', val: 300 },
            { name: 'Style', val: 340 }, { name: 'Health', val: 220 }, { name: 'Loc', val: 410 }
        ],
        pie: [
            { name: 'Politics', value: 2450 }, { name: 'Sports', value: 1320 }, { name: 'Tech', value: 2510 },
            { name: 'Entertainment', value: 1240 }, { name: 'World', value: 1380 }, { name: 'Business', value: 1310 },
            { name: 'Lifestyle', value: 1290 }, { name: 'Health', value: 1210 }, { name: 'Local', value: 1390 },
        ],
        dot: [
            { x: 500, y: 1200 }, { x: 800, y: 900 }, { x: 1100, y: 1500 }, { x: 1400, y: 1100 },
            { x: 1700, y: 1800 }, { x: 2000, y: 1400 }, { x: 2300, y: 2100 }
        ]
    }
};

const CATEGORY_DATA = [
    { name: 'Politics', value: 450 },
    { name: 'Sports', value: 320 },
    { name: 'Tech', value: 510 },
    { name: 'Entertainment', value: 240 },
    { name: 'World', value: 380 },
    { name: 'Business', value: 310 },
    { name: 'Lifestyle', value: 290 },
    { name: 'Health', value: 210 },
    { name: 'Local', value: 390 },
];

const COLORS = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16', // Lime
];

import { getDashboardStatsAPI, updateNewsStatusAPI, getDashboardAnalyticsAPI } from '../services/userApi';

export default function Dashboard() {
    const navigate = useNavigate();
    const [pendingNews, setPendingNews] = useState([]);
    const [stats, setStats] = useState(INITIAL_STATS);
    const [loading, setLoading] = useState(true);
    const [timeFrame, setTimeFrame] = useState('Week');
    const [analyticsData, setAnalyticsData] = useState(null);

    const activeData = useMemo(() => {
        if (analyticsData) return analyticsData;
        return TIME_DATA[timeFrame];
    }, [timeFrame, analyticsData]);

    useEffect(() => {
        fetchDashboardData();
        fetchAnalytics();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await getDashboardStatsAPI();
            setStats(res.data.stats.map(s => {
                const original = INITIAL_STATS.find(i => i.label === s.label);
                return { ...original, ...s, value: s.value.toLocaleString() };
            }));
            setPendingNews(res.data.pendingNews);
        } catch (error) {
            console.error("Fetch Dashboard Error:", error);
        }
    };

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await getDashboardAnalyticsAPI();
            setAnalyticsData(res.data);
        } catch (error) {
            console.error("Fetch Analytics Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const status = action === 'approve' ? 'Published' : 'Rejected';
            await updateNewsStatusAPI(id, status);
            fetchDashboardData();
            alert(`Succesfully ${status} article.`);
        } catch (error) {
            console.error("Update Status Error:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Dashboard</h1>
                    <p className="text-secondary">System Overview & Quick Controls</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="time-filter glass-panel">
                        {['Today', 'Week', 'Month'].map(t => (
                            <button
                                key={t}
                                className={clsx('filter-btn', { active: timeFrame === t })}
                                onClick={() => setTimeFrame(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="admin-status glass-panel" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        <div style={{ fontWeight: 600 }}>Admin: {JSON.parse(localStorage.getItem('adminUser'))?.name || 'Admin'}</div>
                        <div style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Last Login: Recently</div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card glass-panel">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">{stat.label}</p>
                                <h3 className="stat-value">{stat.value}</h3>
                            </div>
                            <div className={clsx('stat-icon', stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="stat-footer">
                            <span className={clsx('stat-change', stat.color)}>{stat.change}</span>
                            <span className="text-secondary text-sm">{timeFrame.toLowerCase()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Interactive Analytics Hub (New Section) */}
            <div className="analytics-hub glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div className="hub-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Interactive Analytics Hub</h2>
                        <p className="text-secondary">Full visual breakdown of platform performance</p>
                    </div>
                    <TrendingUp size={24} color="var(--primary-500)" />
                </div>

                <div className="hub-grid">
                    {/* 1. Wave Graph (Area) */}
                    <div className="hub-card">
                        <div className="chart-header">
                            <h3>Traffic Trends (Wave)</h3>
                            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Active Sessions</span>
                        </div>
                        <div style={{ height: '220px', minHeight: '220px', minWidth: '0' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activeData.wave}>
                                    <defs>
                                        <linearGradient id="waveColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} width={30} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="val" stroke="var(--primary-500)" fillOpacity={1} fill="url(#waveColor)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. Bar Graph */}
                    <div className="hub-card">
                        <div className="chart-header">
                            <h3>News Distribution (Bar)</h3>
                            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>By Category</span>
                        </div>
                        <div style={{ height: '220px', minHeight: '220px', minWidth: '0' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activeData.bar}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} width={30} />
                                    <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                    <Bar dataKey="val" fill="var(--primary-400)" radius={[4, 4, 0, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3. Pie Graph */}
                    <div className="hub-card">
                        <div className="chart-header">
                            <h3>Category Split (Pie)</h3>
                            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Market Share</span>
                        </div>
                        <div style={{ height: '220px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ flex: 1, minHeight: '150px', height: '150px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={activeData.pie}
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {activeData.pie.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Custom Scrollable Legend */}
                            <div className="custom-legend-container">
                                <div className="scroll-legend">
                                    {activeData.pie.map((entry, index) => (
                                        <div key={index} className="legend-item">
                                            <span className="legend-box" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                            <span className="legend-label">{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Dot Graph (Scatter) */}
                    <div className="hub-card">
                        <div className="chart-header">
                            <h3>Engagement Depth (Dot)</h3>
                            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>User Retention</span>
                        </div>
                        <div style={{ height: '220px', minHeight: '220px', minWidth: '0' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis type="number" dataKey="x" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis type="number" dataKey="y" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} width={30} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                    <Scatter name="Engagement" data={activeData.dot} fill="#10b981">
                                        {activeData.dot.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid">
                {/* Left Column: Charts and Activities */}
                <div className="dashboard-left">
                    <div className="content-card glass-panel">
                        <div className="card-header">
                            <h3>Pending Approvals</h3>
                            <button className="text-link" onClick={() => navigate('/news')}>View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="summary-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingNews.length > 0 ? (
                                        pendingNews.map(news => (
                                            <tr key={news._id}>
                                                <td className="title-cell">{news.title}</td>
                                                <td>{news.author}</td>
                                                <td>{new Date(news.date).toLocaleDateString()}</td>
                                                <td>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}>
                                                        <button
                                                            className="btn-approve"
                                                            title="Approve"
                                                            onClick={() => handleAction(news._id, 'approve')}
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                        <button
                                                            className="btn-reject"
                                                            title="Reject"
                                                            onClick={() => handleAction(news._id, 'reject')}
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>
                                                No pending approvals
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions & Feeds */}
                <div className="dashboard-right">
                    <div className="content-card glass-panel" style={{ marginBottom: '1.5rem' }}>
                        <h3>Quick Actions</h3>
                        <div className="quick-actions-grid">
                            <button className="action-btn" onClick={() => navigate('/news')}>
                                <PlusCircle size={20} />
                                <span>Add News</span>
                            </button>
                            <button className="action-btn" onClick={() => navigate('/users')}>
                                <Users size={20} />
                                <span>Manage Users</span>
                            </button>
                            <button className="action-btn" onClick={() => navigate('/reports')}>
                                <AlertCircle size={20} />
                                <span>View Reports</span>
                            </button>
                            <button className="action-btn" onClick={() => navigate('/activity')}>
                                <Activity size={20} />
                                <span>Site Logs</span>
                            </button>
                        </div>
                    </div>

                    <div className="content-card glass-panel">
                        <div className="card-header">
                            <h3>Popular Content</h3>
                        </div>
                        <div className="popular-list">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="popular-item">
                                    <div className="popular-info">
                                        <div className="popular-title">Top Headline for the day {i}</div>
                                        <div className="popular-meta">
                                            <span><Eye size={12} /> 1.2k</span>
                                            <span><ThumbsUp size={12} /> 450</span>
                                            <span><MessageSquare size={12} /> 89</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
