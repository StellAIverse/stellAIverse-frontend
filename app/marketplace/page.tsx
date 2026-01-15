'use client';

export default function Marketplace() {
  const agents = [
    {
      id: 1,
      name: 'DataBot Pro',
      description: 'Advanced data analysis and insights',
      author: 'DataTeam',
      rating: 4.8,
      users: 1250,
    },
    {
      id: 2,
      name: 'AutoWriter',
      description: 'AI-powered content generation',
      author: 'ContentStudio',
      rating: 4.6,
      users: 890,
    },
    {
      id: 3,
      name: 'CodeAssistant',
      description: 'Intelligent code generation and debugging',
      author: 'DevTools',
      rating: 4.9,
      users: 2100,
    },
  ];

  return (
    <main className="pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 glow-text">Agent Marketplace</h1>
        <p className="text-gray-300 text-lg mb-12">Discover and deploy AI agents from our cosmic repository</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-lg border border-cosmic-purple/30 hover:border-cosmic-blue/60 hover:shadow-lg hover:shadow-cosmic-blue/20 transition-smooth nebula-bg cursor-pointer group"
            >
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2 glow-text group-hover:text-cosmic-cyan transition-smooth">
                {agent.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4">{agent.description}</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>by <span className="text-cosmic-purple">{agent.author}</span></p>
                <div className="flex justify-between">
                  <span>⭐ {agent.rating}</span>
                  <span>👥 {agent.users} users</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-cosmic-purple/30 hover:bg-cosmic-purple/60 rounded transition-smooth font-semibold">
                View Agent
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
