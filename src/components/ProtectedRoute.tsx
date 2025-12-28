import { useWallet } from '@solana/wallet-adapter-react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { connected } = useWallet();

    if (!connected) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
