import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bandobast-primary to-bandobast-secondary flex items-center justify-center">
      <div className="space-y-8 text-center">
        <h1 className="text-4xl font-bold text-white">Bandobast Duty Management</h1>
        <div className="space-x-4">
          <Link
            to="/controller"
            className="inline-block px-6 py-3 bg-white text-bandobast-primary rounded-lg hover:bg-gray-100 transition-colors"
          >
            Controller App
          </Link>
          <Link
            to="/official"
            className="inline-block px-6 py-3 bg-bandobast-accent text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Official App
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;