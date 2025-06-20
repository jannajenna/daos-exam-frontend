import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // ✅ Access token from context
import styles from './CreateEnsemble.module.css';
import BurgerMenu from '../components/Menu';

const CreateEnsemble = () => {
  const navigate = useNavigate();
  const { token } = useUser(); // 🔑 Get token for authorization

  // 🎼 Form state for new ensemble
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  // ⚠️ Validation error messages
  const [errors, setErrors] = useState({
    title: '',
  });

  // 🖊 Handle input and textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 💾 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Simple title validation
    if (form.title.trim() === '') {
      setErrors({ title: 'Navn er påkrævet' });
      return;
    }

    // 🔐 Make sure token is present
    if (!token) {
      alert('Du skal være logget ind for at oprette et ensemble.');
      return;
    }

    try {
      // 📤 Send POST request with Authorization header
      const res = await fetch('http://localhost:3000/ensembles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Secure backend route
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newEnsemble = await res.json();
        navigate({ to: `/ensembles/${newEnsemble._id}` }); // 🔁 Redirect on success
      } else {
        const error = await res.json();
        alert(error.message || 'Noget gik galt. Prøv igen.');
      }
    } catch  {
      alert('Serverfejl. Prøv igen senere.');
    }
  };

  return (
    <>
      <BurgerMenu />
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Opret ensemble</h1>

        {/* 🎼 Ensemble name */}
        <section className={styles.field}>
          <label htmlFor="title">Ensemblets navn</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Ensemblets navn"
            value={form.title}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.title || ' '}</p>
        </section>

        {/* 🖼️ Placeholder for future image upload */}
        <section className={styles.placeholderBox}>
          <div className={styles.imagePlaceholder} />
          <button type="button" className={styles.disabledButton} disabled>
            Upload coverbillede (ikke aktiv endnu)
          </button>
        </section>

        {/* 📝 Description */}
        <section className={styles.field}>
          <label htmlFor="description">Beskrivelse</label>
          <textarea
            id="description"
            name="description"
            placeholder="Skriv en kort beskrivelse af jeres ensemble eller orkester..."
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </section>

        <button type="submit">Opret ensemble</button>
      </form>
    </main>
    </>
  );
};

export default CreateEnsemble;
