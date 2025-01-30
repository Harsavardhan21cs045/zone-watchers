import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Siren } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#243949] to-[#517fa4] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <Shield className="w-12 h-12 text-white" />
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Bandobast
            </h1>
          </div>
          <p className="text-xl text-gray-200">
            Police Duty Management System
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Controller Card */}
          <Link
            to="/controller"
            className="group relative bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-bandobast-primary text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Controller App
                </h2>
                <p className="text-gray-300">
                  Manage and monitor police personnel deployment
                </p>
              </div>
            </div>
          </Link>

          {/* Official Card */}
          <Link
            to="/official"
            className="group relative bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-bandobast-accent text-white">
                <Siren className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Official App
                </h2>
                <p className="text-gray-300">
                  Access duty assignments and location updates
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-400">
            © 2024 Bandobast Police Department. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;