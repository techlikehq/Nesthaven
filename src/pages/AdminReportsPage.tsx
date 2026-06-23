import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flag, Lock, X, AlertTriangle, CheckCircle2, Clock, XCircle,
  MessageCircle, RefreshCw,
} from 'lucide-react';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

interface Report {
  id: string;
  conversation_id: string;
  reported_by: 'renter' | 'agent';
  reason: string;
  details: string | null;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  created_at: string;
  renter_name: string;
  conversation_status: string;
  agent_name: string;
  agent_agency: string;
  property_title: string | null;
}

interface ConvoMessage {
  id: string;
  sender_type: 'renter' | 'agent';
  body: string;
  created_at: string;
}

const REASON_LABELS: Record<string, string> = {
  asked_off_platform_contact: 'Asked to chat elsewhere',
  asked_off_platform_payment: 'Asked for off-platform payment',
  suspicious_behavior: 'Suspicious behavior',
  other: 'Other',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: 'Open', color: '#dc2626', icon: AlertTriangle },
  reviewing: { label: 'Reviewing', color: '#d97706', icon: Clock },
  resolved: { label: 'Resolved', color: '#16a34a', icon: CheckCircle2 },
  dismissed: { label: 'Dismissed', color: '#6b7280', icon: XCircle },
};

function AdminGate({ onUnlock }: { onUnlock: (key: string) => void }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/admin/reports`, {
      headers: { 'x-admin-key': key },
    });
    if (res.ok) {
      sessionStorage.setItem('nh_admin_key', key);
      onUnlock(key);
    } else {
      setError(true);
    }
  };

  return (
    <main className="bg-[#F9F6F0] min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-8 w-full max-w-sm">
        <div className="w-11 h-11 bg-neutral-900 flex items-center justify-center mb-5">
          <Lock size={18} className="text-white" />
        </div>
        <h1 className="font-serif text-2xl font-medium text-neutral-900 mb-2">Admin Access</h1>
        <p className="text-sm text-neutral-500 mb-6">Enter the admin key to view reports.</p>
        <input
          type="password"
          value={key}
          onChange={e => { setKey(e.target.value); setError(false); }}
          placeholder="Admin key"
          className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors mb-2"
        />
        {error && <p className="text-xs text-red-600 mb-3">Incorrect key. Try again.</p>}
        <button type="submit" className="w-full py-3.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold tracking-widest uppercase transition-colors mt-3">
          Unlock
        </button>
      </form>
    </main>
  );
}

export default function AdminReportsPage() {
  const [adminKey, setAdminKey] = useState<string | null>(() => sessionStorage.getItem('nh_admin_key'));
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('open');
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [convoMessages, setConvoMessages] = useState<ConvoMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchReports = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/reports`, { headers: { 'x-admin-key': key } });
      if (!res.ok) {
        sessionStorage.removeItem('nh_admin_key');
        setAdminKey(null);
        return;
      }
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) fetchReports(adminKey);
  }, [adminKey, fetchReports]);

  const openReport = async (report: Report) => {
    setActiveReport(report);
    setLoadingMessages(true);
    setConvoMessages([]);
    try {
      const res = await fetch(`${API_URL}/api/admin/reports/${report.id}/messages`, {
        headers: { 'x-admin-key': adminKey! },
      });
      const data = await res.json();
      setConvoMessages(data);
    } catch (err) {
      console.error('Failed to fetch conversation', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const updateStatus = async (reportId: string, status: string) => {
    try {
      await fetch(`${API_URL}/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey! },
        body: JSON.stringify({ status }),
      });
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: status as Report['status'] } : r));
      if (activeReport?.id === reportId) {
        setActiveReport(prev => prev ? { ...prev, status: status as Report['status'] } : prev);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (!adminKey) {
    return <AdminGate onUnlock={setAdminKey} />;
  }

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);
  const counts = {
    open: reports.filter(r => r.status === 'open').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length,
  };

  return (
    <main className="bg-[#F9F6F0] min-h-screen pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase mb-2">// TRUST &amp; SAFETY</p>
            <h1 className="font-serif text-3xl font-medium text-neutral-900">Reports</h1>
          </div>
          <button
            onClick={() => fetchReports(adminKey)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-300 hover:border-neutral-900 text-xs font-bold tracking-widest uppercase text-neutral-700 transition-colors"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {['open', 'reviewing', 'resolved', 'dismissed', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-[11px] font-bold tracking-widest uppercase border transition-colors ${
                filter === status ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-500 border-neutral-300 hover:border-neutral-900'
              }`}
            >
              {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
              {status !== 'all' && counts[status as keyof typeof counts] > 0 && (
                <span className="ml-1.5">({counts[status as keyof typeof counts]})</span>
              )}
            </button>
          ))}
        </div>

        {loading && <p className="text-sm text-neutral-400">Loading reports...</p>}

        {!loading && filtered.length === 0 && (
          <div className="bg-white border border-neutral-200 p-12 text-center">
            <Flag size={28} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No {filter !== 'all' ? STATUS_CONFIG[filter]?.label.toLowerCase() : ''} reports.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(report => {
            const config = STATUS_CONFIG[report.status];
            const Icon = config.icon;
            return (
              <button
                key={report.id}
                onClick={() => openReport(report)}
                className="text-left bg-white border border-neutral-200 hover:border-amber-300 hover:shadow-lg transition-all p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase px-2 py-1 border"
                    style={{ color: config.color, borderColor: `${config.color}40`, backgroundColor: `${config.color}0D` }}
                  >
                    <Icon size={10} /> {config.label}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-neutral-900 mb-1">{REASON_LABELS[report.reason] ?? report.reason}</p>
                <p className="text-xs text-neutral-500 mb-3">
                  Reported by <span className="font-medium">{report.reported_by}</span>
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-3 border-t border-neutral-100">
                  <span>{report.renter_name} ↔ {report.agent_name}</span>
                </div>
                {report.property_title && (
                  <p className="text-[10px] text-neutral-400 mt-1 truncate">{report.property_title}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeReport && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[100]"
              onClick={() => setActiveReport(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white z-[101] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                <h2 className="font-serif text-lg font-medium text-neutral-900">Report Details</h2>
                <button onClick={() => setActiveReport(null)} className="p-2 text-neutral-400 hover:text-neutral-700">
                  <X size={18} />
                </button>
              </div>

              <div className="px-5 py-4 border-b border-neutral-200 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Reason</p>
                  <p className="text-sm font-semibold text-neutral-900">{REASON_LABELS[activeReport.reason] ?? activeReport.reason}</p>
                </div>
                {activeReport.details && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Details</p>
                    <p className="text-sm text-neutral-600">{activeReport.details}</p>
                  </div>
                )}
                <div className="flex gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Renter</p>
                    <p className="text-sm text-neutral-900">{activeReport.renter_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Agent</p>
                    <p className="text-sm text-neutral-900">{activeReport.agent_name}</p>
                    <p className="text-[10px] text-neutral-400">{activeReport.agent_agency}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(STATUS_CONFIG).map(status => (
                      <button
                        key={status}
                        onClick={() => updateStatus(activeReport.id, status)}
                        className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border transition-colors ${
                          activeReport.status === status
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-500 border-neutral-300 hover:border-neutral-900'
                        }`}
                      >
                        {STATUS_CONFIG[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-b border-neutral-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <MessageCircle size={11} /> Full Conversation
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F9F6F0]">
                {loadingMessages && <p className="text-sm text-neutral-400 text-center py-8">Loading conversation...</p>}
                {!loadingMessages && convoMessages.map(m => (
                  <div key={m.id} className={`flex ${m.sender_type === 'renter' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-snug ${
                      m.sender_type === 'renter'
                        ? 'bg-neutral-900 text-white rounded-2xl rounded-br-sm'
                        : 'bg-white border border-neutral-200 text-neutral-800 rounded-2xl rounded-bl-sm'
                    }`}>
                      <p className="text-[9px] opacity-60 mb-1 uppercase tracking-wider">{m.sender_type}</p>
                      {m.body}
                      <div className={`mt-1 text-[9px] ${m.sender_type === 'renter' ? 'text-white/50' : 'text-neutral-400'}`}>
                        {new Date(m.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
