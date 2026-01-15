'use client';

import { useState } from 'react';

export default function CreateAgent() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    behavior: '',
    capabilities: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Submitting agent:', formData);
    // TODO: Send to backend
  };

  return (
    <main className="pt-20 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 glow-text">Create Your Agent</h1>
        <p className="text-gray-300 mb-12">Step {step} of 4: Describe your AI agent</p>

        {/* Progress Bar */}
        <div className="mb-8 bg-cosmic-purple/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 p-8 rounded-lg border border-cosmic-purple/30 glow-border">
            <div>
              <label className="block text-sm font-semibold mb-2">Agent Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., DataAnalyzer Pro"
                className="w-full px-4 py-3 bg-cosmic-darker/50 border border-cosmic-purple/30 rounded-lg focus:outline-none focus:border-cosmic-purple text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Short Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What does your agent do?"
                rows={4}
                className="w-full px-4 py-3 bg-cosmic-darker/50 border border-cosmic-purple/30 rounded-lg focus:outline-none focus:border-cosmic-purple text-white placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Step 2: Behavior */}
        {step === 2 && (
          <div className="space-y-6 p-8 rounded-lg border border-cosmic-purple/30 glow-border">
            <div>
              <label className="block text-sm font-semibold mb-2">Agent Behavior</label>
              <textarea
                name="behavior"
                value={formData.behavior}
                onChange={handleInputChange}
                placeholder="Describe how your agent should behave..."
                rows={6}
                className="w-full px-4 py-3 bg-cosmic-darker/50 border border-cosmic-purple/30 rounded-lg focus:outline-none focus:border-cosmic-purple text-white placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Step 3: Capabilities */}
        {step === 3 && (
          <div className="space-y-6 p-8 rounded-lg border border-cosmic-purple/30 glow-border">
            <div>
              <label className="block text-sm font-semibold mb-4">Select Capabilities</label>
              <div className="grid grid-cols-2 gap-4">
                {['Data Analysis', 'Content Generation', 'Code Generation', 'Automation', 'Translation', 'Summarization'].map((cap) => (
                  <button
                    key={cap}
                    className="p-4 border border-cosmic-purple/30 rounded-lg hover:bg-cosmic-purple/20 transition-smooth text-left"
                  >
                    ☐ {cap}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6 p-8 rounded-lg border border-cosmic-purple/30 glow-border">
            <div>
              <h3 className="text-xl font-semibold mb-4">Review Your Agent</h3>
              <div className="space-y-3 text-gray-300">
                <p><span className="font-semibold text-white">Name:</span> {formData.name}</p>
                <p><span className="font-semibold text-white">Description:</span> {formData.description}</p>
                <p><span className="font-semibold text-white">Behavior:</span> {formData.behavior.substring(0, 100)}...</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-6 py-3 border border-cosmic-purple/50 rounded-lg font-semibold disabled:opacity-50 hover:bg-cosmic-purple/10 transition-smooth"
          >
            Back
          </button>
          {step === 4 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-lg font-semibold hover:shadow-lg hover:shadow-cosmic-purple/50 transition-smooth"
            >
              Create Agent
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-lg font-semibold hover:shadow-lg hover:shadow-cosmic-purple/50 transition-smooth"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
