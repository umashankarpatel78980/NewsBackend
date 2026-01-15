import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import News from '../models/News.js';
import ModerationReport from '../models/ModerationReport.js';

export const getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(50);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createLog = async (action, user, details) => {
    try {
        const newLog = new ActivityLog({ action, user, details });
        await newLog.save();
    } catch (error) {
        console.error("Log Creation Error:", error);
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalNews = await News.countDocuments();
        const pendingNewsCount = await News.countDocuments({ status: 'Pending' });
        const publishedNews = await News.countDocuments({ status: 'Published' });
        const reportedNews = await ModerationReport.countDocuments({ status: 'Pending' });
        const totalUsers = await User.countDocuments();
        const reporters = await User.countDocuments({ role: 'Reporter' });

        const pendingArticles = await News.find({ status: 'Pending' }).limit(5);

        res.status(200).json({
            stats: [
                { label: 'Total News', value: totalNews, change: '+0%', icon: 'Newspaper' },
                { label: 'Pending News', value: pendingNewsCount, change: '+0', icon: 'Clock' },
                { label: 'Published News', value: publishedNews, change: '+0', icon: 'CheckCircle2' },
                { label: 'Reported News', value: reportedNews, change: '+0', icon: 'AlertCircle' },
                { label: 'Total Users', value: totalUsers, change: '+0%', icon: 'Users' },
                { label: 'Reporters', value: reporters, change: '+0', icon: 'UserCheck' }
            ],
            pendingNews: pendingArticles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
