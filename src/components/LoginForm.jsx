import { useState } from 'react';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid credentials');
    } else {
      setError('');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3">
      <div className="card p-4 shadow w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Admin Login</h2>
        <div className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          {error && <div className="text-danger small">{error}</div>}
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-100"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;