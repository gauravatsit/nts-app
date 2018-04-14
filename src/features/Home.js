import React, {Component} from 'react';
import {FontIcon,Avatar} from "material-ui";
import {logout} from "../helpers/auth";
import Chart from "./chart";

const appTokenKey = "appToken";
class Home extends Component {
    constructor(props) {
        super(props);
        let userObj = JSON.parse(sessionStorage.getItem('userDetails'));
        this.state = {
            name:userObj === null ? "Guest" :userObj.name,
            photoUrl:userObj === null ? "" :userObj.photoUrl,
            table:[],
            chart:[]
        };
    }

    createTable(obj,ind){
        return (
                <tr key={ind}>
                    <td>{obj.id}</td>
                    <td>{obj.userId}</td>
                    <td>{obj.title}</td>
                </tr>
        )
    }

    handleLogout = () => {
        logout().then(function () {
            localStorage.removeItem(appTokenKey);
            this.props.history.push("/login");
            console.log("user signed out from firebase");
        }.bind(this));
    }

    handleButtonClick = () =>{
        this.props.history.push("/app/form")
    }

    fetchData = (url,type)=>{ 
        fetch(url)
        .then(response => {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
        })
        .then(data => {
            if(type === 'table')
            this.loadInterval && this.setState({ table: data });
            else
            this.loadInterval && this.setState({ chart: data });
        });
    }

    componentDidMount() { 
        const tableUrl = 'https://jsonplaceholder.typicode.com/posts';
        const ChartUrl = 'https://api.worldbank.org/v2/countries/NOR/indicators/NY.GDP.MKTP.KD.ZG?per_page=30&MRV=30&format=json';
        this.loadInterval = setInterval(this.fetchData(tableUrl,'table'),100);
        this.loadInterval = setInterval(this.fetchData(ChartUrl,'chart'),200);  
    }

    componentWillUnmount(){
        this.loadInterval && clearInterval(this.loadInterval);
        this.loadInterval = false;
    }

    getChartData = () =>{
        let data = this.state.chart;
        let country_name,indicatorName
        let arrayString = [],
        year_list = [],
        array_final = []

        data[1].forEach(function(data,i) {
        country_name = data.country.value;
        indicatorName = data.indicator.value;
        year_list.push(data.date);
        arrayString.push(data.value);
      });

      for (var i = 0; i < arrayString.length; i++) {
        if (arrayString[i] != null) {
          array_final.push(parseFloat(arrayString[i]))
        } else {
          array_final.push(null)
        };
      }
        return (
            {
                chart: {
                  type: 'area',
                  renderTo: 'container'
                },
                title: {
                  text: indicatorName
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                  valueDecimals: 2,
                  pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}%</b><br/>'
                },
                plotOptions: {
                  series: {
                    marker: {
                      enabled: false
                    }
                  }
                },
                xAxis: {
                  categories: year_list.reverse() 
                },
                series: [{
                  name: country_name,
                  color:'#53cc2b',
                  data: array_final.reverse() 
                }]
              }
        )
    }

    render() {
        return (
            <div className="flex-container" key={"aaa"}> 
                <header>
                    <Avatar src={this.state.photoUrl}/>
                    <h3>
                        Welcome {this.state.name}
                    </h3>
                    <div id="signout" onTouchTap={this.handleLogout}>
                        <FontIcon color="white" className="fa fa-sign-out"/>
                    </div>
                </header>
                <div className="contents">
                    <div className="data-container"> 
                        <h4>Table Data</h4>
                        <div id="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User ID</th>
                                        <th>Text</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.table.map(this.createTable)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="data-container">
                        <h4>Chart Data</h4>
                        {this.state.chart.length === 0 ? "Loading..." :<Chart options={this.getChartData()} container={"chartId"} />}
                    </div>
                </div>
                <button className="button" onClick={this.handleButtonClick}><span>Next Screen </span></button>
                <footer id="footer"><span>&copy; Copyright 2018</span></footer>
            </div>
        );
    }
}


export default Home;