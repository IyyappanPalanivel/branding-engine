import React from 'react'

function LogsPanel({ logs, clearLogs }) {
  return (
    <div className="h-48 bg-white rounded-lg shadow border overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-700">📜 Processing Logs</h3>
        <button
          onClick={clearLogs}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="p-4 h-full overflow-auto">
        <pre className="text-xs whitespace-pre-wrap font-mono text-gray-600 leading-relaxed">
          {logs.length > 0 ? logs.join('\n') : 'Waiting for processing to start...'}
        </pre>
      </div>
    </div>
  );
}

export default LogsPanel