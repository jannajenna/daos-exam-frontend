// src/components/BurgerMenu.tsx
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUser } from '../context/UserContext';
import styles from './Menu.module.css';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) return null; // Only show if user is logged in

  return (
    <div className={styles.wrapper}>
      {/* 🍔 Top-right toggle icon */}
      <button
        onClick={() => setOpen(!open)}
        className={styles.toggle}
        aria-label="Åbn menu"
      >
        ☰
      </button>

      {/* 📋 Menu overlay when open */}
      {open && (
        <div className={styles.overlay}>
          <nav className={styles.menuBox}>
            <ul className={styles.menuList}>
              <li>
                <button onClick={() => navigate({ to: `/profile/${user._id}` })}>
                  Min profil
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ to: '/ensembles' })}>
                  Ensembler
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ to: '/posts' })}>
                  Opslag
                </button>
              </li>
              <li>
                <button onClick={logout} className={styles.logoutButton}>
                  Log ud
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Menu;
