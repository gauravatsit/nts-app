import React, {Component} from 'react';
import {Avatar,FontIcon} from "material-ui";
import {logout} from "../helpers/auth";
import {fbdb} from "../config/constants";

const appTokenKey = "appToken";

class Form extends Component {
    constructor(props) {
        super(props);
        let userObj = JSON.parse(sessionStorage.getItem('userDetails'));
        this.state = {
            name:userObj.name,
            photoUrl:userObj.photoUrl,
            designation : '',
            teamName : '',
            orgName : '',
            skills : '',
            formData : []
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
    
    handleSubmit(event) {
        event.preventDefault();
        let userData = this.state;
        fbdb.ref().push(userData);
        alert('Data successfully stored in Firebase database for the user '+ this.state.name);
        this.setState({
            designation : '',
            teamName : '',
            orgName : '',
            skills : '',
            formData : []
        })
        this.fetchDataFromDB();
    }

    handleLogout() {
        logout().then(function () {
            localStorage.removeItem(appTokenKey);
            this.props.history.push("/login");
            console.log("user signed out from firebase");
        }.bind(this));
    }

    fetchDataFromDB = () => {
        let query = fbdb.ref();
        let dbData = [];
        query.on("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                let childData = childSnapshot.val();
                dbData.push(childData);
                this.loadInterval && this.setState({
                    formData : dbData
                })
            });
         }, function (error) {
            console.log("Error: " + error.code);
         });
    }

    createFormDataTable = (obj,ind) => {
        return(
            <tr key={ind}>
                <td>{obj.name}</td>
                <td>{obj.orgName}</td>
                <td>{obj.designation}</td>
                <td>{obj.teamName}</td>
                <td>{obj.skills}</td>
            </tr>
        )
    }
    
    componentDidMount(){
        this.loadInterval = setInterval(this.fetchDataFromDB(),100);
    }

    componentWillUnmount(){
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    render() {
        return (
            <div className="flex-container">
                <header>
                    <Avatar src={this.state.photoUrl}/>
                    <h3>
                        Welcome {this.state.name}
                    </h3>
                    <div id="signout" onTouchTap={this.handleLogout}>
                        <FontIcon color="white" className="fa fa-sign-out"/>
                    </div>
                </header>
                <div className="contents" id="form-contents">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Designation:
                        <input name="designation" type="text" placeholder="Enter Your Designation" value={this.state.designation} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Team Name:
                        <input name="teamName" type="text" placeholder="Enter Your Team Name" value={this.state.teamName} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Organization Name:
                        <input name="orgName" type="text" placeholder="Enter Your Organization Name" value={this.state.orgName} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Skills:
                        <input name="skills" type="text" placeholder="Enter Your Skills" value={this.state.skills} onChange={this.handleInputChange} />
                    </label>
                    <input id="form-submit" type="submit" value="Submit" />
                </form>
                <div id="formData-table">
                    {this.state.formData.length > 0 && <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Organization</th>
                                <th>Designation</th>
                                <th>Team Name</th>
                                <th>Skills</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.formData.map(this.createFormDataTable)}
                        </tbody>
                    </table>}
                </div>
                </div>
                <footer id="footer"><span>&copy; Copyright 2018</span></footer>
            </div>
        );
    }
}


export default Form;