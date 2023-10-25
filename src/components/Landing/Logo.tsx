import { cn } from '@/lib/utils';
import { Open_Sans } from 'next/font/google';
import Image from 'next/image';

const font = Open_Sans({ subsets: ['latin'] });

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logoDark.svg"
        height="40"
        width="40"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logoLight.svg"
        height="40"
        width="40"
        alt="Logo"
        className="hidden dark:block"
      />
      <span className={cn('font-semibold', font.className)}>Motion</span>
    </div>
  );
}
