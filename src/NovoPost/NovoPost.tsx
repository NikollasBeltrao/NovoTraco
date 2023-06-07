import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import "./NovoPost.css";
import api from '../api';
import { useHistory, useLocation } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';


const NovoPost: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const [post, setPost] = useState({
        titulo: '',
        descricao: ''
    });
    const [imgs, setImgs] = useState(Array<any>);
    var locat: any = location.state;

    function addImagem(event: ChangeEvent<HTMLInputElement>) {

        if (!event.target.files || !event.target.files[0]) return;
        const FR = new FileReader();
        var res: any = '';
        FR.addEventListener("load", (evt) => {
            if (evt.target) {
                setImgs([...imgs, evt.target.result?.toString()]);
            }
        });

        FR.readAsDataURL(event.target.files[0]);
    }
    function removerImagem(index: number) {
        setImgs(imgs.filter((el, i) => {
            if (i != index) {
                return el;
            }
        }));
    }

    async function cadastrar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let form = new FormData();
        form.append("titulo", post.titulo);
        form.append("descricao", post.descricao);
        form.append("idusuario", "1");
        form.append("imgs", JSON.stringify(imgs));
        form.append("cadastrarPost", "cadastrarPost");
        await api.post('/dao.php', form)
            .then(res => {
                console.log(res);
                if (JSON.parse(res.data)) {
                    if (JSON.parse(res.data)['response'] === true) {
                        alert("Cadastrado com sucesso!")
                        setPost({ titulo: '', descricao: '' })
                        setImgs([])
                    }
                    else {
                        alert("Falha ao cadastrar")
                    }
                }
                else {
                    alert("Falha ao cadastrar")
                }
                console.log(res);
            }).catch(res => {
                console.log(res);
            });

    }

    function handlerInput(event: ChangeEvent<HTMLInputElement>) {
        let aux = JSON.parse(JSON.stringify(post));
        aux[event.target.name] = event.target.value;
        setPost(aux);
    }
    function handlerTextarea(event: ChangeEvent<HTMLTextAreaElement>) {
        let aux = JSON.parse(JSON.stringify(post));
        aux[event.target.name] = event.target.value;
        setPost(aux);
    }


    return (
        <>
            <nav className='nav'>Novo Traço</nav>
            <div className="home-container">
                <form className='form-cadastrar' onSubmit={cadastrar}>
                    <div className="mb-12">
                        <label htmlFor="titulo" className="form-label">Título</label>
                        <input type="text" className="form-control" id="titulo" name="titulo" value={post.titulo} onChange={handlerInput} />
                    </div>
                    <br />
                    <div className="mb-12">
                        <label htmlFor="descricao" className="form-label">Descrição</label>
                        <textarea className="form-control" id="descricao" name="descricao" value={post.descricao} onChange={handlerTextarea} />
                    </div>
                    <br />
                    <div className="mb-12">
                        <label htmlFor="formFileSm" className="form-label label-file">adicionar imagem</label>
                        <input type="file" onChange={addImagem} className="form-control" multiple accept='image/*' id="formFileSm" name="img" />
                    </div>
                    <button className="btn btn-primary" type='submit'>Cadastrar</button>
                    <div className="lista-imgs">
                        {imgs.map((el, i) => {
                            return <div className="img-content" key={i}>
                                <img src={el} alt="" />
                                <button type="button" onClick={() => removerImagem(i)}><FaTrashAlt /></button>
                            </div>
                        })}
                    </div>

                </form>
            </div>
        </>
    )
}

export default NovoPost;