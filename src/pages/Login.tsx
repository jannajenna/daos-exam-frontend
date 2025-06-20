import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // ✅ Import context
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser, setToken } = useUser(); // ✅ Access context functions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();

      // ✅ Store token and user in context + localStorage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);

      // ✅ Redirect to user profile
      navigate({ to: `/profile/${data.user._id}` });
    } else {
      alert('Login fejlede');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Log ind</h1>

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Adgangskode"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Log ind</button>
    </form>
  );
};

export default Login;
