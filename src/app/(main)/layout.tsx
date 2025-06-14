import { Header } from '@/components/core/Header';
import { Footer } from '@/components/core/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8">{children}</main>
      <Footer />
    </div>
  );
}
