import { type ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { House, CaretRight, ArrowUp } from '@phosphor-icons/react';

interface LegalPageLayoutProps {
  children: ReactNode;
  title: string;
}

const LegalPageLayout = ({ children, title }: LegalPageLayoutProps) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
        >
          <House size={16} weight="fill" />
          <span>Home</span>
        </Link>
        <CaretRight size={12} weight="bold" />
        <span className="text-white">{title}</span>
      </div>

      {/* Page Content */}
      {children}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} weight="bold" className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

export default LegalPageLayout;
