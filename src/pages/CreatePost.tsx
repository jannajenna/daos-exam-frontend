import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import styles from './CreatePost.module.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const { id: ensembleId } = useParams({ from: '/ensembles/$id/create-post' });

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

    // Validate title
    if (form.title.trim() === '') {
      setErrors({ title: 'Titel er påkrævet' });
      return;
    }

    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        ensemble: ensembleId, // associate post with the ensemble
      }),
    });

    if (res.ok) {
      navigate({ to: `/ensembles/${ensembleId}` });
    } else {
      alert('Noget gik galt. Prøv igen.');
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Opret opslag</h1>

        <section className={styles.field}>
          <label htmlFor="title">Titel</label>
          <input
            id="title"
            name="title"
            placeholder="Titel"
            value={form.title}
            onChange={handleChange}
            required
          />
          <p className={styles.error}>{errors.title || ' '}</p>
        </section>

        <section className={styles.field}>
          <label htmlFor="description">Beskrivelse</label>
          <textarea
            id="description"
            name="description"
            placeholder="Skriv en kort beskrivelse af hvad du søger..."
            rows={4}
            value={form.description}
            onChange={handleChange}
          />
        </section>

        <button type="submit">Opret opslag</button>
      </form>
    </main>
  );
};

export default CreatePost;
