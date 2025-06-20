import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // ✅ Access context for login persistence
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useUser(); // ✅ Pull from context

  // 🔐 Form state for input fields
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileText: '',
  });

  // ⚠️ State for validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // 🖊 Handle input updates (text + textarea)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 💾 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Simple client-side validation
    const newErrors = {
      firstName: form.firstName.trim() === '' ? 'Fornavn er påkrævet' : '',
      lastName: form.lastName.trim() === '' ? 'Efternavn er påkrævet' : '',
      email: !form.email.includes('@') ? 'Ugyldig email' : '',
      password: form.password.length < 6 ? 'Mindst 6 tegn' : '',
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(err => err !== '')) return;

    // 📤 Send POST request to backend
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    // ✅ On success, store token and user in context
    if (res.ok) {
      const { access_token, user } = await res.json(); // Assumes backend returns { token, user }

      setUser(user);
      setToken(access_token);
      localStorage.setItem('token', access_token); // Optional: already handled by context

      navigate({ to: `/profile/${user._id}` }); // 🔁 Redirect to new profile
    } else {
      alert('Noget gik galt. Prøv igen.');
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Opret profil</h1>

        {/* 👤 First name */}
        <section className={styles.field}>
          <label htmlFor="firstName">Fornavn</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Indtast fornavn"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.firstName || ' '}</p>
        </section>

        {/* 👤 Last name */}
        <section className={styles.field}>
          <label htmlFor="lastName">Efternavn</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Indtast efternavn"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.lastName || ' '}</p>
        </section>

        {/* 📧 Email */}
        <section className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Indtast din e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.email || ' '}</p>
        </section>

        {/* 🔒 Password */}
        <section className={styles.field}>
          <label htmlFor="password">Adgangskode</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Mindst 6 tegn"
            value={form.password}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.password || ' '}</p>
        </section>

        {/* 📝 Profile text */}
        <section className={styles.field}>
          <label htmlFor="profileText">Profiltekst</label>
          <textarea
            id="profileText"
            name="profileText"
            placeholder="Skriv lidt om dig selv..."
            value={form.profileText}
            onChange={handleChange}
            rows={4}
          />
        </section>

        <button type="submit">Opret profil</button>
      </form>
    </main>
  );
};

export default Register;
