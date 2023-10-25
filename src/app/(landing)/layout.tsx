import Footer from '@/components/Landing/Footer';
import Navbar from '@/components/Landing/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col dark:bg-neutral-900">
      <Navbar />
      <main className="xs:flex-grow pt-40">{children}</main>
      <Footer />
    </div>
  );
}
