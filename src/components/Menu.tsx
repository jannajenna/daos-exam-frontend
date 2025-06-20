// src/components/BurgerMenu.tsx
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useUser } from '../context/UserContext';
import styles from './Menu.module.css';

const BurgerMenu = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // 🔓 Trigger logout and navigate home
  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  // 🔐 Only render menu if user is logged in
  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      {/* 🍔 Button to toggle menu */}
      <button
        className={styles.burgerButton}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* 📋 Slide-out menu */}
      {open && (
        <nav className={styles.menu}>
          <ul>
            <li>
              <Link to={`/profile/${user._id}`} onClick={() => setOpen(false)}>
                Min profil
              </Link>
            </li>
            <li>
              <Link to="/ensembles" onClick={() => setOpen(false)}>
                Ensembler
              </Link>
            </li>
            <li>
              <Link to="/posts" onClick={() => setOpen(false)}>
                Opslag
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>Log ud</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default BurgerMenu;
