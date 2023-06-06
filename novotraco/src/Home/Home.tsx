import React, { useEffect, useState } from 'react';
import "./Home.css";
import api from '../api';
import { useHistory, useLocation } from 'react-router-dom';

const Home: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const [posts, setPosts] = useState(Array<{
        idpost: '',
        titulo: '',
        datac: '',
        texto: ''
    }>());
    const [imgs, setImgs] = useState(Array<{
        idimg: '',
        texto: '',
        idpost: '',
    }>());
    async function listar() {
        await api.get('/dao.php?listarPosts=listarPosts').then(res => {
            if (res.data.length > 0) {
                setPosts(res.data);
            }
        });
    }
    async function listarImagens(id: any) {
        var a: any = location.state;
        await api.get('/dao.php?listarImagens=listarImagens&idpost=' + id).then(res => {
            if (res.data.length > 0) {
                setImgs(res.data);
            }
        });
    }
    function formData(d: any) {
        var data = new Date(d)
        return data.toLocaleDateString('pt-BR')
    }

    function irParaPost(id: number) {
        history.push("/post", {idpost: id})
    }

    useEffect(() => {
        listar();
    }, [])
    return (
        <>
            <nav className='nav'> Novo Traço</nav>
            <div className="home-container">                    
                {posts.map((el) => {
                    return <div className="card card-home" key={el.idpost} onClick={() => irParaPost(parseInt(el.idpost))}>
                        <img src={el.texto} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{el.titulo}</h5>
                            <small>{formData(el.datac)}</small>
                            {/*<a href="#" className="btn btn-primary">Go somewhere</a>*/}
                        </div>
                    </div>
                })}
                
            </div>
        </>
    )
}

export default Home;