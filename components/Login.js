"use client";
import React, { useEffect, useState } from 'react';
import Styles from './Login.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure, checkAuth } from '@/redux/features/auth';

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const error = useSelector(state => state.auth.error);

  if (isAuthenticated) {
    router.push('/orders');
  }

  // Check authentication status on component mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogin = () => {
    // Example of a login action, normally this would involve API calls
    const token = "exampleAuthToken"; // Replace with actual token from your login logic
    if (token) {
      dispatch(loginSuccess({ token }));
    } else {
      dispatch(loginFailure({ error: "Invalid login" }));
    }
  };

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setErrorMsg('Both fields are required.');
      return;
    }

    setErrorMsg('');

    // hardcoded username and password
    if (credentials.username === 'ABC' && credentials.password === '1234') {
      handleLogin();
      console.log('Login successful');
      router.push('/orders');
    } else {
      setErrorMsg('Invalid credentials! Please try again.');
    }
  };

  return (
    <div className={Styles.loginContainer}>
      <form onSubmit={handleSubmit} className={Styles.loginForm}>
        <p className="text-3xl text-center text-[#2b7137] mt-2 mb-5" style={{ fontFamily: 'fantasy' }}>
          Login
        </p>

        {errorMsg && <p className={Styles.errorMessage}>{errorMsg}</p>}

        <div className={Styles.formGroup}>
          <label htmlFor="username" className={Styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={() => setCredentials({ ...credentials, username: event.target.value })}
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
            onChange={() => setCredentials({ ...credentials, password: event.target.value })}
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
