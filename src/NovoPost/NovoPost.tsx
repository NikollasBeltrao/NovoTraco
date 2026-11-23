import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../api';
import { errorMessage } from '../auth';

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function NovoPost() {
    const history = useHistory();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    useEffect(() => {
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviews(urls);
        return () => { urls.forEach(url => URL.revokeObjectURL(url)); };
    }, [files]);

    function selectImages(event: ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(event.target.files || []);
        event.target.value = '';
        if (files.length + selected.length > 4 || selected.some(file => !allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024)) {
            setError('Selecione até 4 imagens JPEG, PNG, GIF ou WebP de até 5 MB cada.');
            return;
        }
        setError('');
        setFiles(current => [...current, ...selected]);
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!files.length) {
            setError('Selecione ao menos uma imagem.');
            return;
        }
        setError('');
        setPending(true);
        const form = new FormData();
        form.append('titulo', titulo);
        form.append('descricao', descricao);
        files.forEach(file => form.append('imagens[]', file));
        try {
            const response = await api.post<{ id: number }>('dao.php?action=post', form);
            history.push('/post/' + response.data.id);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setPending(false);
        }
    }

    return <main className="form-page">
        <Link className="back-link" to="/home">← Voltar ao mural</Link>
        <div className="form-card">
            <span className="section-kicker">COMPARTILHE UMA IDEIA</span>
            <h1>Nova publicação.</h1>
            <p>Adicione imagens e conte um pouco sobre o que você quer mostrar.</p>
            <form onSubmit={submit}>
                <label htmlFor="titulo">Título</label>
                <input id="titulo" value={titulo} onChange={event => setTitulo(event.target.value)} maxLength={100} required />
                <label htmlFor="descricao">Descrição</label>
                <textarea id="descricao" value={descricao} onChange={event => setDescricao(event.target.value)} rows={5} required />
                <label htmlFor="imagens">Imagens</label>
                <input id="imagens" type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple onChange={selectImages} />
                <small className="field-hint">Até 4 imagens, com no máximo 5 MB cada.</small>
                {previews.length > 0 && <div className="image-previews">{previews.map((url, index) => <div key={url}><img src={url} alt={`Prévia ${index + 1}`} /><button type="button" onClick={() => setFiles(current => current.filter((_, i) => i !== index))} aria-label={`Remover imagem ${index + 1}`}>×</button></div>)}</div>}
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="button button-dark form-submit" type="submit" disabled={pending}>{pending ? 'Publicando...' : 'Publicar'} <span aria-hidden="true">↗</span></button>
            </form>
        </div>
    </main>;
}
