export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">Download PDF</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6">Editor Panel</div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-2xl p-6">Resume Preview</div>
        </div>
      </div>
    </div>
  );
}
