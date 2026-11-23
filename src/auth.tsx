import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import api from './api';

export interface User {
    id: number;
    nome: string;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    error: string;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function errorMessage(error: unknown): string {
    if (axios.isAxiosError(error) && typeof error.response?.data?.error === 'string') {
        return error.response.data.error;
    }
    return 'Não foi possível conectar. Tente novamente.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        api.get<{ user: User | null }>('dao.php?action=session')
            .then(response => { if (mounted) setUser(response.data.user); })
            .catch(err => { if (mounted) setError(errorMessage(err)); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    function updateUser(nextUser: User | null) {
        setError('');
        setUser(nextUser);
    }

    return <AuthContext.Provider value={{ user, loading, error, setUser: updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error('AuthProvider não encontrado.');
    return context;
}
