import React from 'react';
import { Link } from 'react-router-dom';

export interface FeedPost {
    id: number;
    titulo: string;
    descricao: string;
    data: string;
    autor: string;
    imagens: string[];
}

export default function PostCard({ post, detailed = false }: { post: FeedPost; detailed?: boolean }) {
    const date = new Date(post.data.replace(' ', 'T'));
    return <article className="post-card">
        <div className="post-top"><span className="post-label">PUBLICAÇÃO</span><time dateTime={post.data.replace(' ', 'T')}>{Number.isNaN(date.getTime()) ? post.data : date.toLocaleDateString('pt-BR')}</time></div>
        <h2>{post.titulo}</h2>
        {post.imagens.length > 0 && <div className="post-images">
            {post.imagens.map((image, index) => <img key={image} src={'/api/' + image} alt={`${post.titulo} — imagem ${index + 1}`} loading="lazy" />)}
        </div>}
        <p className="post-description">{post.descricao}</p>
        <div className="post-footer">
            <div className="author"><span className="author-avatar" aria-hidden="true">{post.autor.charAt(0).toUpperCase()}</span><div><span>PUBLICADO POR</span><strong>{post.autor}</strong></div></div>
            {!detailed && <Link className="post-link" to={'/post/' + post.id}>Ver publicação <span aria-hidden="true">↗</span></Link>}
        </div>
    </article>;
}
