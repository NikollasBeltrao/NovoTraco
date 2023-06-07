import React, { useEffect, useState } from 'react';
import "./Post.css";
import api from '../api';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaTrashAlt } from 'react-icons/fa';



const Post: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const [post, setPost] = useState({
        idpost: '',
        titulo: '',
        datac: '',
        descricao: ''
    });
    const [imgs, setImgs] = useState(Array<{
        idimg: '',
        texto: '',
        idpost: '',
    }>());
    var locat: any = location.state;
    async function listarImagens() {        
        await api.get('/dao.php?listarImagens=listarImagens&idpost=' + locat.idpost).then(res => {
            if (res.data.length > 0) {
                setImgs(res.data);
            }
        });
    }
    async function getPost() {
        await api.get('/dao.php?getPost=getPost&idpost=' + locat.idpost).then(res => {
            if (res.data.idpost) {
                setPost(res.data);
            }
        });
    }
    function formData(d: any) {
        var data = new Date(d)
        return data.toLocaleDateString('pt-BR')
    }

    function voltar() {
        history.push("/home")
    }

    useEffect(() => {
        getPost();
        listarImagens();
    }, [])
    return (
        <>
            <nav className='nav'><Link to="/home" className='back' ><FaArrowLeft className='icon-back'/></Link> {post.titulo}</nav>
            <div className="home-container">
                {imgs.map((el, i) => {
                    return <div className="card card-post" key={i}>
                        <img src={"http://localhost/novotraco/api/"+el.texto} className="card-img-top img-post" alt="..." />
                        {i === 0 ? <div className="card-body card-desc">
                            <p className="card-text">{post.descricao}</p>
                        </div> : ''}
                    </div>
                })}
            </div>
        </>
    )
}

export default Post;