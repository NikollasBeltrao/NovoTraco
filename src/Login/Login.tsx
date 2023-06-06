import React, { ChangeEvent, FormEvent, useState } from 'react';
import './Login.css';
import api from '../api';
import load from '../assets/load.gif';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
    const history = useHistory();
    const [validar, setValidar] = useState(false);
    const [verSenha, setVerSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [err, setErr] = useState('');
    const [login, setLogin] = useState({
        nome: '',
        senha: ''
    });
    async function handlerLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCarregando(true);
        let form_data = new FormData();
        form_data.append('nome', login.nome);
        form_data.append('senha', login.senha);
        form_data.append('login', '');
        setValidar(true);
        var erraux = '';
        if (login.senha !== '' && login.nome !== '') {
            await api.post("/dao.php", form_data).then(res => {
                if (JSON.parse(res.data)) {
                    if (JSON.parse(res.data)['response'] === true) {
                        sessionStorage.clear();
                        sessionStorage.setItem("login", JSON.stringify(JSON.parse(res.data)['data'][0]));
                        history.push("/novoPost");
                    }
                    else {
                        erraux = "Falha ao realizar login";
                    }
                }
                setCarregando(false);
            }).catch(res => {
                setCarregando(false);
                erraux = "Falha ao realizar login";
            });
        }
        else {
            erraux = ("Preencha todos os campos")
        }
        setErr(erraux);

    }
    function handlerCampos(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.name === 'sen') {
            setLogin({ ...login, senha: event.target.value });
        }
        else {
            setLogin({ ...login, nome: event.target.value });
        }
    }
    return (
        <div className="login-container">
            <form className="needs-validation" onSubmit={handlerLogin}>
                <h1>LOGIN</h1>
                <div className="campos form-row">
                    <div className="form-group col-md-12 ">
                        <label htmlFor="mat">Nome</label>
                        <input type="text" name="nome" className="form-control" id="mat" onChange={handlerCampos} value={login.nome} placeholder="Digite seu login" />
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="sen">Senha</label>
                        <div className="input-group mb-3">
                            <input type={verSenha ? "text" : "password"} autoComplete="on" aria-describedby="basic-addon2" className="form-control senha-inp" name="sen" id="sen" onChange={handlerCampos} value={login.senha} placeholder="Digite sua senha" />
                        </div>
                        {(validar) ? <><small className="inv">{err}</small> <br /> </> : ''}
                        {carregando ? <><img className="load" src={load} alt="" /><br /> </> : ''}
                    </div>
                    <div>
                        <button type='submit' className="btn btn-primary">Entrar</button>
                    </div>
                </div>
                <div className="leeds-login-container">
                    <small>Desenvolvido por <small className="leeds-login"> LEEDS</small></small>
                    <small>V1.0.0</small>
                </div>
            </form>

        </div>
    )
}

export default Login;