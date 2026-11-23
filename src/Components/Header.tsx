import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../api';
import { errorMessage, useAuth } from '../auth';

export default function Header() {
    const { user, loading, error, setUser } = useAuth();
    const [logoutError, setLogoutError] = useState('');
    const [leaving, setLeaving] = useState(false);
    const history = useHistory();

    async function logout() {
        setLeaving(true);
        setLogoutError('');
        try {
            await api.post('dao.php?action=logout');
            setUser(null);
            history.push('/home');
        } catch (err) {
            setLogoutError(errorMessage(err));
        } finally {
            setLeaving(false);
        }
    }

    return <>
        <header className="site-header">
            <div className="header-inner">
                <Link className="brand" to="/home"><span className="brand-symbol">m.</span><span>mural <strong>criativo</strong></span></Link>
                <nav className="header-actions" aria-label="Navegação principal">
                    {!loading && !error && (user
                        ? <><Link className="button button-dark" to="/novoPost">+ Publicar</Link><button className="button button-plain" type="button" onClick={logout} disabled={leaving}>Sair</button></>
                        : <><Link className="button button-plain" to="/login">Entrar</Link><Link className="button button-dark" to="/cadastro">Criar conta</Link></>)}
                </nav>
            </div>
        </header>
        {(error || logoutError) && <div className="site-alert" role="alert">{error || logoutError}</div>}
    </>;
}
