import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import Header from './Components/Header';
import Login from './Login/Login';
import Home from './Home/Home';
import Post from './Post/Post';
import NovoPost from './NovoPost/NovoPost';

function PrivatePost() {
    const { user, loading, error } = useAuth();
    if (loading) return <p className="state-message">Carregando sessão...</p>;
    if (error) return <p className="state-message error">Não foi possível verificar sua sessão.</p>;
    return user ? <NovoPost /> : <Redirect to="/login" />;
}

export default function Routes() {
    return <BrowserRouter><AuthProvider><Header /><Switch>
        <Route exact path="/"><Redirect to="/home" /></Route>
        <Route exact path="/home" component={Home} />
        <Route exact path="/login"><Login /></Route>
        <Route exact path="/cadastro"><Login register /></Route>
        <Route exact path="/novoPost" component={PrivatePost} />
        <Route exact path="/post/:id" component={Post} />
        <Route exact path="/post"><Redirect to="/home" /></Route>
        <Route><main className="form-page"><h1>Página não encontrada.</h1></main></Route>
    </Switch></AuthProvider></BrowserRouter>;
}
