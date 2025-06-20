import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // ✅ Access token from context
import styles from './CreatePost.module.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const { id: ensembleId } = useParams({ from: '/ensembles/$id/create-post' }); // 🎯 Ensemble ID from URL
  const { token } = useUser(); // 🔐 Get token for authorization

  // 📝 Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  // ⚠️ Error state for validation
  const [errors, setErrors] = useState({
    title: '',
  });

  // 🖊 Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 💾 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🧪 Validate required fields
    if (form.title.trim() === '') {
      setErrors({ title: 'Titel er påkrævet' });
      return;
    }

    // 🔐 Make sure user is logged in
    if (!token) {
      alert('Du skal være logget ind for at oprette et opslag.');
      return;
    }

    // 📤 Send POST request with token and ensembleId
    const res = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        ensembleId, // ✅ Send correct field name expected by backend
      }),
    });

    // ✅ Navigate to ensemble page on success
    if (res.ok) {
      navigate({ to: `/ensembles/${ensembleId}` });
    } else {
      const error = await res.json();
      alert(error.message || 'Noget gik galt. Prøv igen.');
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Opret opslag</h1>

        {/* 📝 Post title field */}
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

        {/* 📄 Description field */}
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
