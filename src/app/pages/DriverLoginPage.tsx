import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, ArrowLeft, Truck } from 'lucide-react';
import { login } from '../../lib/auth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function DriverLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(loginData.email, loginData.password);

      if (response.success && response.user) {
        if (response.user.role !== 'driver') {
          toast.error('Invalid credentials. Please use driver login.');
          setIsLoading(false);
          return;
        }

        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/driver/dashboard');
        }, 500);
      } else {
        toast.error(response.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('An error occurred during login');
      setIsLoading(false);
    }
  };

  const quickFillLogin = () => {
    setLoginData({
      email: 'ramesh.driver@aszerelocation.com',
      password: 'Driver@123'
    });
    toast.success('Demo credentials filled!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Truck className="w-10 h-10 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Driver Portal</h1>
          </div>
          <p className="text-gray-600">Login to access your delivery dashboard</p>
        </div>

        <Card className="shadow-xl border-2 border-orange-100">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <CardTitle>Driver Login</CardTitle>
            <CardDescription className="text-orange-50">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="driver@aszerelocation.com"
                    className="pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Logging in...'
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={quickFillLogin}
              >
                Use Demo Account
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-xs font-medium text-blue-900 mb-2">Demo Driver Accounts:</p>
                <div className="space-y-1 text-xs text-blue-700">
                  <p>• ramesh.driver@aszerelocation.com / Driver@123</p>
                  <p>• sunil.driver@aszerelocation.com / Driver@123</p>
                  <p>• prakash.driver@aszerelocation.com / Driver@123</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Contact support at support@aszerelocation.com
        </p>
      </motion.div>
    </div>
  );
}
