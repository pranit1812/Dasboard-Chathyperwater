import { useState } from 'react';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // The password is loaded from environment variables in the App component
    // and passed as a prop to this component for security
    if (onLogin(password)) {
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-deep-navy">
      <div className="w-full max-w-md p-8 bg-navy rounded-lg shadow-lg border border-light-gray/10">
        <div className="flex flex-col items-center mb-6">
          <img src="/Chatlogo.png" alt="Feedback Dashboard Logo" className="w-48 h-auto mb-4" />
          <h1 className="text-2xl font-bold text-cyan text-center">Feedback Dashboard</h1>
        </div>
        
        {error && (
          <div className="bg-red/20 text-red p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-light-gray mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-deep-navy border border-light-gray/20 text-light-gray focus:outline-none focus:border-cyan"
              placeholder="Enter dashboard password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-cyan hover:bg-cyan/80 text-deep-navy font-semibold py-3 px-4 rounded focus:outline-none transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 