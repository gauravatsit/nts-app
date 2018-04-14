import React, {Component} from 'react';
import {FontIcon, RaisedButton} from "material-ui";
import {loginWithGoogle} from "../helpers/auth";
import {firebaseAuth} from "../config/constants";


const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            splashScreen: false
        };
    }

    handleGoogleLogin = () => {
        loginWithGoogle()
            .catch(function (error) {
                alert(error); // or show toast
                localStorage.removeItem(firebaseAuthKey);
            });
        localStorage.setItem(firebaseAuthKey, "1");
    }

    componentWillMount() {
        if (localStorage.getItem(appTokenKey)) {
            this.props.history.push("/app/home");
            return;
        }

        firebaseAuth().onAuthStateChanged(user => {debugger
            if (user) {
                //console.log("User signed in: ", JSON.stringify(user));

                localStorage.removeItem(firebaseAuthKey);
                localStorage.setItem(appTokenKey, user.uid);
                const userData = {name:user.displayName,photoUrl:user.photoURL}
                sessionStorage.setItem('userDetails',JSON.stringify(userData));

                this.props.history.push("/app/home")
            }
            else
                localStorage.clear();
        });
    }

    render() {
        //console.log(firebaseAuthKey + "=" + localStorage.getItem(firebaseAuthKey));
        if (localStorage.getItem(firebaseAuthKey) === "1") return <SplashScreen />;
        return <LoginPage handleGoogleLogin={this.handleGoogleLogin}/>;
    }
}

const iconStyles = {
    color: "#ffffff"
};
const LoginPage = ({handleGoogleLogin}) => (
    <div id="login-screen">
        <h1>Login</h1>
        <div>
            <RaisedButton
                label="Sign in with Google"
                labelColor={"#ffffff"}
                backgroundColor="#3591ef"
                icon={<FontIcon className="fa fa-google" style={iconStyles}/>}
                onClick={handleGoogleLogin}
            />
        </div>
    </div>
);
const SplashScreen = () => (<div id="loader"></div>)

export default Login;
