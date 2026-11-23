import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { errorMessage, useAuth } from '../auth';
import PostCard, { FeedPost } from '../Components/PostCard';

export default function Home() {
    const { user, loading, error: authError } = useAuth();
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [pending, setPending] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        api.get<{ posts: FeedPost[] }>('dao.php?action=posts')
            .then(response => { if (mounted) setPosts(response.data.posts); })
            .catch(err => { if (mounted) setError(errorMessage(err)); })
            .finally(() => { if (mounted) setPending(false); });
        return () => { mounted = false; };
    }, []);

    return <main className="page-shell">
        <section className="feed-intro">
            <div><span className="eyebrow"><span className="eyebrow-dot" /> UM ESPAÇO PARA COMPARTILHAR</span><h1>Ideias que merecem<br /><em>ser vistas.</em></h1><p>Um mural para compartilhar projetos, imagens e o que inspira você.</p></div>
            {!loading && !authError && <Link className="button button-dark intro-action" to={user ? '/novoPost' : '/cadastro'}>{user ? 'Criar publicação' : 'Comece a publicar'} <span aria-hidden="true">↗</span></Link>}
        </section>
        <section className="feed-container" aria-labelledby="feed-title">
            <div className="feed-heading"><div><span className="section-kicker">EXPLORE O MURAL</span><h2 id="feed-title">Publicações <span>✳</span></h2></div><span className="feed-count">{pending ? 'CARREGANDO' : `${posts.length} ${posts.length === 1 ? 'POST' : 'POSTS'}`}</span></div>
            {pending ? <p className="state-message">Carregando publicações...</p>
                : error ? <p className="state-message error" role="alert">{error}</p>
                : posts.length === 0 ? <p className="state-message">Ainda não há publicações. Seja a primeira pessoa a compartilhar.</p>
                : <div className="feed-list">{posts.map(post => <PostCard key={post.id} post={post} />)}</div>}
        </section>
        <footer className="site-footer"><span>mural criativo<span className="accent">.</span></span><span>UM ESPAÇO PARA COMPARTILHAR</span></footer>
    </main>;
}
