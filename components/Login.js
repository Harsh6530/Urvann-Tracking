"use client";
import React, { useEffect, useState } from 'react';
import Styles from './Login.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure, checkAuth } from '@/redux/features/auth';
import { login } from '@/server/auth-actions';

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

  const handleLogin = async () => {
    const response = await login(credentials);

    if (response.success === false) {
      dispatch(loginFailure({ error: response.message }));
      if (response.status === 401) {
        setErrorMsg('Invalid credentials! Please try again.');
      } else {
        setErrorMsg('An error occurred! Please try again.');
        console.error(response.error);
      }
    } else {
      dispatch(loginSuccess({ token: response.token }));
      router.push('/orders');
    }
  };

  const [credentials, setCredentials] = useState({ email: '', phone: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.phone) {
      setErrorMsg('Both fields are required.');
      return;
    }
    setErrorMsg('');

    handleLogin();
  };

  return (
    <div className={Styles.loginContainer}>
      <form onSubmit={handleSubmit} className={Styles.loginForm}>
        <p className="text-3xl text-center text-[#2b7137] mt-2 mb-5" style={{ fontFamily: 'fantasy' }}>
          Login
        </p>

        {errorMsg && <p className={Styles.errorMessage}>{errorMsg}</p>}

        <div className={Styles.formGroup}>
          <label htmlFor="email" className={Styles.label}>Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={credentials.email}
            onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
            className={Styles.input}
            required
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="phone" className={Styles.label}>Phone Number:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={credentials.phone}
            onChange={(event) => setCredentials({ ...credentials, phone: event.target.value })}
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
