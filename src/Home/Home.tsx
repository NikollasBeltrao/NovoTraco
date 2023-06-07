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
        history.push("/post", { idpost: id })
    }

    useEffect(() => {
        listar();
    }, [])
    return (
        <>
            <nav className='nav'> Novo Traço</nav>
            <div className="home-container">
                <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        {posts.map((el, i) => {
                            return <div className={"carousel-item "+(i==0?"active":'')} key={el.idpost} onClick={() => irParaPost(parseInt(el.idpost))}>
                                <img src={"http://localhost/novotraco/api/"+el.texto} className="card-img-top" alt="..." />
                                <div className="carousel-title d-none d-md-block">
                                    <h2>{el.titulo}</h2>
                                    <small>{formData(el.datac)}</small>
                                    {/*<a href="#" className="btn btn-primary">Go somewhere</a>*/}
                                </div>
                            </div>
                        })}                    
                    </div>
                    <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        </>
    )
}

export default Home;