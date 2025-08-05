import { Footer } from '@/components/footer';
import { SimpleNavigation } from '@/components/simple-navigation';

export default async function NavFooterLayout({
  children,
  renderFooter = true,
}: Readonly<{
  children: React.ReactNode;
  renderFooter?: boolean;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleNavigation />
      <main className="flex-1">
        {children}
      </main>
      {renderFooter && <Footer />}
    </div>
  );
}