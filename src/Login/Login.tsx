import React, { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../api';
import { errorMessage, useAuth, User } from '../auth';

export default function Login({ register = false }: { register?: boolean }) {
    const { setUser } = useAuth();
    const history = useHistory();
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setPending(true);
        const form = new FormData();
        form.append('nome', nome);
        form.append('senha', senha);
        try {
            const response = await api.post<{ user: User }>('dao.php?action=' + (register ? 'register' : 'login'), form);
            setUser(response.data.user);
            history.push('/home');
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setPending(false);
        }
    }

    return <main className="form-page">
        <Link className="back-link" to="/home">← Voltar ao mural</Link>
        <div className="form-card">
            <span className="section-kicker">{register ? 'FAÇA PARTE' : 'BEM-VINDO DE VOLTA'}</span>
            <h1>{register ? 'Crie sua conta.' : 'Entre no mural.'}</h1>
            <p>{register ? 'Um espaço para mostrar suas ideias ao mundo.' : 'Acesse sua conta para compartilhar uma publicação.'}</p>
            <form onSubmit={submit}>
                <label htmlFor="nome">Nome</label>
                <input id="nome" value={nome} onChange={event => setNome(event.target.value)} maxLength={100} autoComplete="username" required />
                <label htmlFor="senha">Senha</label>
                <input id="senha" type="password" value={senha} onChange={event => setSenha(event.target.value)} minLength={register ? 6 : undefined} maxLength={72} autoComplete={register ? 'new-password' : 'current-password'} required />
                {register && <small className="field-hint">Mínimo de 6 caracteres. Seu nome será exibido nas publicações.</small>}
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="button button-dark form-submit" type="submit" disabled={pending}>{pending ? 'Aguarde...' : register ? 'Criar conta' : 'Entrar'} <span aria-hidden="true">↗</span></button>
            </form>
            <p className="form-switch">{register ? 'Já tem uma conta? ' : 'Ainda não tem uma conta? '}<Link to={register ? '/login' : '/cadastro'}>{register ? 'Entre' : 'Cadastre-se'}</Link></p>
        </div>
    </main>;
}
