import { Button } from '../ui/button';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="flex dark:bg-neutral-900 justify-center sm:justify-end w-full pr-5 pb-2 bg-background z-50">
      <Logo />
    </footer>
  );
}
