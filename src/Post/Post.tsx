import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { errorMessage } from '../auth';
import PostCard, { FeedPost } from '../Components/PostCard';

export default function Post() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<FeedPost | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        setPost(null);
        setError('');
        api.get<{ post: FeedPost }>('dao.php?action=post&id=' + encodeURIComponent(id))
            .then(response => { if (mounted) setPost(response.data.post); })
            .catch(err => { if (mounted) setError(errorMessage(err)); });
        return () => { mounted = false; };
    }, [id]);

    return <main className="detail-page"><Link className="back-link" to="/home">← Voltar ao mural</Link>
        {error ? <p className="state-message error" role="alert">{error}</p> : post ? <PostCard post={post} detailed /> : <p className="state-message">Carregando publicação...</p>}
    </main>;
}
