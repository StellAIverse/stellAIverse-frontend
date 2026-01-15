'use client';

export default function Portfolio() {
  const agents = [
    {
      id: 1,
      name: 'MyDataBot',
      status: 'Active',
      performance: 94,
      interactions: 1250,
      createdAt: '2024-12-15',
    },
    {
      id: 2,
      name: 'ContentHelper',
      status: 'Active',
      performance: 87,
      interactions: 856,
      createdAt: '2024-11-20',
    },
  ];

  return (
    <main className="pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 glow-text">Your Portfolio</h1>
        <p className="text-gray-300 text-lg mb-12">Manage and monitor your deployed agents</p>

        <div className="grid gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-lg border border-cosmic-purple/30 hover:border-cosmic-blue/60 hover:shadow-lg hover:shadow-cosmic-blue/20 transition-smooth nebula-bg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-semibold glow-text">{agent.name}</h3>
                  <p className="text-gray-400 text-sm">Created: {agent.createdAt}</p>
                </div>
                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                  {agent.status}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Performance</p>
                  <p className="text-3xl font-bold glow-text">{agent.performance}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Interactions</p>
                  <p className="text-3xl font-bold text-cosmic-cyan">{agent.interactions}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-cosmic-purple/30 hover:bg-cosmic-purple/60 rounded transition-smooth font-semibold">
                    View Details
                  </button>
                  <button className="flex-1 py-2 bg-cosmic-blue/30 hover:bg-cosmic-blue/60 rounded transition-smooth font-semibold">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
