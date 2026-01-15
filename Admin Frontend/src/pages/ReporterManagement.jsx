import { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Eye, Check, X, FileText } from 'lucide-react';
import { getReportersAPI, updateUserStatusAPI } from '../services/userApi';

export default function ReporterManagement() {
    const [reporters, setReporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReporter, setSelectedReporter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchReporters();
    }, []);

    const fetchReporters = async () => {
        try {
            setLoading(true);
            const res = await getReportersAPI();
            setReporters(res.data);
        } catch (error) {
            console.error("Fetch Reporters Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (reporter) => {
        setSelectedReporter(reporter);
        setIsModalOpen(true);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await updateUserStatusAPI(id, newStatus);
            fetchReporters();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Update Status Error:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'danger';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Reporter Management</h1>
                <p className="text-secondary">Review applications and manage reporter access</p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Articles</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reporters.length > 0 ? reporters.map((reporter) => (
                        <TableRow key={reporter._id}>
                            <TableCell>
                                <div style={{ fontWeight: 500 }}>{reporter.fullName}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{reporter.email}</div>
                            </TableCell>
                            <TableCell>{new Date(reporter.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{reporter.articlesCount || 0}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusColor(reporter.status)}>{reporter.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(reporter)}>
                                    <Eye size={18} style={{ marginRight: '4px' }} /> View
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                {loading ? 'Loading...' : 'No reporters found.'}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Reporter Application Details"
            >
                {selectedReporter && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%',
                                background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                            }}>
                                {selectedReporter.fullName?.charAt(0) || '?'}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{selectedReporter.fullName}</h3>
                                <p style={{ color: '#64748b', margin: 0 }}>{selectedReporter.email}</p>
                                <Badge variant={getStatusColor(selectedReporter.status)} className="mt-2">
                                    {selectedReporter.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio / Experience</label>
                            <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
                                {selectedReporter.bio || "No bio provided."}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Submitted Documents</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button variant="ghost" size="sm" disabled>
                                    <FileText size={16} /> ID Proof
                                </Button>
                            </div>
                        </div>

                        <div className="form-actions">
                            {selectedReporter.status === 'Pending' && (
                                <>
                                    <Button variant="danger" onClick={() => updateStatus(selectedReporter._id, 'Rejected')}>
                                        <X size={18} /> Reject
                                    </Button>
                                    <Button variant="primary" onClick={() => updateStatus(selectedReporter._id, 'Active')}>
                                        <Check size={18} /> Approve Reporter
                                    </Button>
                                </>
                            )}
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
