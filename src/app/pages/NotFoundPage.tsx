import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#1a2545] mb-4">404</h1>
          <h2 className="text-4xl font-bold text-[#1a2545] mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#1a2545] text-white px-8 py-4 rounded-lg hover:bg-[#2a3555] transition font-semibold"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-[#c93a3a] text-white px-8 py-4 rounded-lg hover:bg-[#a83030] transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4">Need help? Contact us:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-[#1a2545] font-semibold">
            <a href="tel:18001706200" className="hover:text-[#c93a3a] transition">
              📞 1800 170 6200
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="tel:+916200573418" className="hover:text-[#c93a3a] transition">
              📱 (+91) 620 057 3418
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
