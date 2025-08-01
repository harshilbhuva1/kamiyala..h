import React from 'react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="input-field rounded-t-md"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="input-field rounded-b-md"
              />
            </div>
          </div>
          
          <div>
            <button className="btn-primary w-full">
              Sign in
            </button>
          </div>
          
          <div className="text-center">
            <a href="/register" className="text-primary-600 hover:text-primary-500">
              Don't have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;