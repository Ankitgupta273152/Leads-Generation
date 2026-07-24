import React, { useState } from 'react';

export default function LeadCard({ lead, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatus = async (status) => {
    await onUpdate(lead._id, { status, notes: lead.notes });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{lead.title}</h3>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">{lead.source}</span> • {new Date(lead.posted_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
          {lead.score}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div><span className="font-semibold">Type:</span> {lead.type}</div>
        <div><span className="font-semibold">Status:</span> {lead.status}</div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full bg-gray-100 hover:bg-gray-200 p-2 rounded text-sm font-semibold text-gray-700"
      >
        {expanded ? '▼ Hide Contact' : '▶ Show Contact'}
      </button>

      {expanded && (
        <div className="mt-3 bg-gray-50 p-3 rounded space-y-2 text-sm">
          {lead.emails?.length > 0 && (
            <div>
              <strong>📧 Email:</strong>
              {lead.emails.map((email, i) => (
                <div key={i} className="flex items-center gap-2 ml-4 mt-1">
                  <code className="text-xs bg-white p-1 rounded flex-1">{email}</code>
                  <button onClick={() => copy(email)} className="text-blue-500 hover:text-blue-700">
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {lead.phones?.length > 0 && (
            <div>
              <strong>📱 Phone:</strong>
              {lead.phones.map((phone, i) => (
                <div key={i} className="flex items-center gap-2 ml-4 mt-1">
                  <code className="text-xs bg-white p-1 rounded flex-1">{phone}</code>
                  <button onClick={() => copy(phone)} className="text-blue-500 hover:text-blue-700">
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {lead.website && (
            <div>
              <strong>🌐 Website:</strong>
              <a href={lead.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline ml-2">
                {lead.website}
              </a>
            </div>
          )}

          {lead.discord && (
            <div>
              <strong>💬 Discord:</strong> <code className="text-xs bg-white p-1">{lead.discord}</code>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <select
          value={lead.status}
          onChange={(e) => handleStatus(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="interested">Interested</option>
          <option value="rejected">Rejected</option>
        </select>

        <a href={lead.url} target="_blank" rel="noreferrer" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
          View
        </a>
      </div>
    </div>
  );
}
