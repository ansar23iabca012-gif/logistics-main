import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail } from 'lucide-react';
import { login } from '../../lib/auth';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickFill = () => {
    setCredentials({
      email: 'admin@aszerelocation.com',
      password: 'Admin@123'
    });
    toast.info('Demo credentials filled!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Attempting admin login with email:', credentials.email);
      const response = await login(credentials.email, credentials.password);

      console.log('📥 Login response:', {
        success: response.success,
        hasUser: !!response.user,
        role: response.user?.role,
        message: response.message
      });

      if (response.success && response.user) {
        if (response.user.role !== 'admin') {
          console.error('❌ Access denied - user role is:', response.user.role);
          toast.error('Access denied. Admin credentials required.');
          setIsLoading(false);
          return;
        }

        console.log('✅ Admin login successful!');
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      } else {
        console.error('❌ Login failed:', response.message);
        toast.error(response.message || 'Invalid email or password');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2545] to-[#2a3555] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-[#c93a3a] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a2545] mb-2">Admin Panel</h1>
          <p className="text-gray-600">ASZE RELOCATION</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#1a2545] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                disabled={isLoading}
                placeholder="admin@aszerelocation.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] focus:ring-2 focus:ring-[#c93a3a]/20 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1a2545] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                disabled={isLoading}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c93a3a] focus:ring-2 focus:ring-[#c93a3a]/20 disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c93a3a] text-white py-3 px-6 rounded-lg hover:bg-[#a83030] transition font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-3">
            <strong>Demo Credentials:</strong><br />
            Email: admin@aszerelocation.com<br />
            Password: Admin@123
          </p>
          <button
            type="button"
            onClick={handleQuickFill}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
          >
            Quick Fill Demo Credentials
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-[#c93a3a] transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
