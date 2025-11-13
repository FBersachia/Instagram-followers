import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { InflatrackBanner } from './InflatrackBanner';

export interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Instagram Follower Tracker &copy; {new Date().getFullYear()}
          </p>
        </div>
        <InflatrackBanner />
      </footer>
    </div>
  );
};
