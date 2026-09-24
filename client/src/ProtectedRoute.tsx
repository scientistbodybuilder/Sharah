import { useUser } from '@/context'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();

    if (!user?.uid) {
        // Redirect to login page or show a message
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute