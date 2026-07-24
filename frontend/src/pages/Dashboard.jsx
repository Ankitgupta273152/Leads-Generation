import React, { useState, useEffect } from 'react';
import LeadCard from '../components/LeadCard';
import api from '../services/api';

export default function Dashboard({ stats }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('new');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLeads();
  }, [status, page]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const url = search ? `/search?q=${search}` : `/?status=${status}&page=${page}`;
      const res = await api.get(url);
      setLeads(res.data.data);
    } catch (err) {
      console.error('Error:', err);
      setLeads([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleRunNow = async () => {
    try {
      await api.post('/run');
      setTimeout(() => fetchLeads(), 1000);
    } catch (err) {
      alert('Error running now');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await api.patch(`/${id}`, data);
      fetchLeads();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🎯 Lead Generator</h1>
            <p className="text-blue-100 mt-1">Automated HackerNews & GitHub leads</p>
          </div>
          <button
            onClick={handleRunNow}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            ▶ Run Now
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500 mt-1">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-green-600">{stats.newLeads}</div>
            <div className="text-sm text-gray-500 mt-1">New</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.contacted}</div>
            <div className="text-sm text-gray-500 mt-1">Contacted</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.interested}</div>
            <div className="text-sm text-gray-500 mt-1">Interested</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-red-600">{stats.avgScore?.toFixed(0) || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Avg Score</div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="new">🆕 New</option>
          <option value="contacted">📧 Contacted</option>
          <option value="interested">⭐ Interested</option>
          <option value="rejected">❌ Rejected</option>
        </select>
      </div>

      {/* Leads Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-blue-600 text-4xl">⏳</div>
            <p className="text-gray-500 mt-2">Loading...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No leads found</p>
            <p className="text-gray-400 text-sm mt-1">Click "Run Now" to fetch latest leads</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map(lead => (
              <LeadCard key={lead._id} lead={lead} onUpdate={handleUpdate} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {leads.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
