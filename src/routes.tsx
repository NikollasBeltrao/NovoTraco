import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Post from './Post/Post';
import NovoPost from './NovoPost/NovoPost';


interface Props {
    location: any
}
const Page404: React.FC<Props> = (props) => {
    return (<>404</>)
}

const PrivateRoute = ({ component, ...rest }: any) => {
    let user: any = null;
    let session = sessionStorage.getItem("login");
    user = (session ? JSON.parse(session) : null);
    const routeComponent = (props: any) => (
        user
            ? React.createElement(component, props)
            : <Redirect to={{ pathname: '/' }} />
    );
    return <Route {...rest} render={routeComponent} />;
};
const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route component={Login} exact path="/" />
                <Route component={Home} path="/home" />
                <Route component={Post} path="/post" />
                <PrivateRoute component={NovoPost} path="/novoPost" />
                <Route component={Page404} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;