"use client";
import React, { useState } from 'react';
import Styles from './Login.module.css';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError('Both fields are required.');
      return;
    }

    setError('');

    // hardcoded username and password
    if (credentials.username === 'ABC' && credentials.password === '1234') {
      console.log('Login successful');
      router.push('/orders');
    } else {
      setError('Invalid credentials! Please try again.');
    }
  };

  return (
    <div className={Styles.loginContainer}>
      <form onSubmit={handleSubmit} className={Styles.loginForm}>
        <p className="text-3xl text-center text-[#2b7137] mt-2 mb-5" style={{ fontFamily: 'fantasy' }}>
          Login
        </p>

        {error && <p className={Styles.errorMessage}>{error}</p>}

        <div className={Styles.formGroup}>
          <label htmlFor="username" className={Styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className={Styles.input}
            required
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="password" className={Styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className={Styles.input}
            required
          />
        </div>

        <button type="submit" className={Styles.loginButton}>Login</button>
      </form>
    </div>
  );
};

export default Login;
