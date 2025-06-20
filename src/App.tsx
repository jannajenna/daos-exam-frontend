import { Outlet } from '@tanstack/react-router';
import BurgerMenu from './components/Menu';

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <BurgerMenu /> {/* 🍔 Menu always accessible for logged-in users */}
    </>
  );
}


