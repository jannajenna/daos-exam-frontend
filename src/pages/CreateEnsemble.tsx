import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import styles from './CreateEnsemble.module.css';

const CreateEnsemble = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    title: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.title.trim() === '') {
      setErrors({ title: 'Navn er påkrævet' });
      return;
    }

    const res = await fetch('http://localhost:3000/ensembles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const newEnsemble = await res.json();
      navigate({ to: `/ensembles/${newEnsemble._id}` });
    } else {
      alert('Noget gik galt. Prøv igen.');
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Opret ensemble</h1>

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

        <section className={styles.placeholderBox}>
          <div className={styles.imagePlaceholder} />
          <button type="button" className={styles.disabledButton} disabled>
            Upload coverbillede (ikke aktiv endnu)
          </button>
        </section>

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
  );
};

export default CreateEnsemble;
