import React from "react";
import {Avatar, RaisedButton} from "material-ui";
import {logout} from "../helpers/auth";
import {fbdb} from "../config/constants";

const appTokenKey = "appToken";
export default class Form extends React.Component {
    constructor(props) {
        super(props);
        let userObj = JSON.parse(sessionStorage.getItem('userDetails'));
        this.state = {
            name:userObj.name,
            photoUrl:userObj.photoUrl,
            designation : '',
            teamName : '',
            orgName : '',
            skills : ''
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }
    
    handleSubmit(event) {debugger
        event.preventDefault();
        let userData = this.state;
        fbdb.ref().push(userData);
        alert('Data successfully stored in Firebase database for the user '+ this.state.name);
        this.setState({
            designation : '',
            teamName : '',
            orgName : '',
            skills : ''
        })
    }

    handleLogout() {
        logout().then(function () {
            localStorage.removeItem(appTokenKey);
            this.props.history.push("/login");
            console.log("user signed out from firebase");
        }.bind(this));
    }

    render() {
        return (
            <div>
                <header>
                    <h3>
                        Welcome {this.state.name}
                        <Avatar src={this.state.photoUrl}/>
                    </h3>
                    <div id="signout">
                        <RaisedButton
                            backgroundColor="#a4c639"
                            labelColor="#ffffff"
                            label="Sign Out"
                            onTouchTap={this.handleLogout}
                        />
                    </div>
                </header>
                <div id="form-contents">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Designation:
                        <input name="designation" type="text" value={this.state.designation} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Team Name:
                        <input name="teamName" type="text" value={this.state.teamName} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Organization Name:
                        <input name="orgName" type="text" value={this.state.orgName} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Skills:
                        <input name="skills" type="text" value={this.state.skills} onChange={this.handleInputChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                </div>
            </div>
        );
    }
}