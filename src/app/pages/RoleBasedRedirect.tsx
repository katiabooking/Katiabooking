import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';

export function RoleBasedRedirect() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    checkUserRoleAndRedirect();
  }, [user, authLoading, navigate]);

  const checkUserRoleAndRedirect = async () => {
    if (!user) return;

    try {
      setChecking(true);

      // Check if user has a salon role (owner, admin, master)
      const roleResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3e5c72fb/salon-role/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const roleData = await roleResponse.json();

      if (roleData.role) {
        // User has a salon role - redirect to appropriate dashboard
        const role = roleData.role.role;
        
        switch (role) {
          case 'owner':
            navigate('/owner');
            break;
          case 'admin':
            navigate('/admin');
            break;
          case 'master':
            navigate('/master');
            break;
          default:
            // Unknown role - show selector
            navigate('/dashboard-selector');
        }
      } else {
        // No salon role - check if they're a regular client
        // For now, redirect to client dashboard or homepage
        navigate('/client');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      toast.error('Failed to load your dashboard');
      // Fallback to dashboard selector
      navigate('/dashboard-selector');
    } finally {
      setChecking(false);
    }
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
