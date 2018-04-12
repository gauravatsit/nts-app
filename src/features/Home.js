import React from "react";
import {Avatar, RaisedButton} from "material-ui";
import {logout} from "../helpers/auth";
import Chart from "./chart"

const appTokenKey = "appToken";
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        let userObj = JSON.parse(sessionStorage.getItem('userDetails'));
        this.state = {
            name:userObj.name,
            photoUrl:userObj.photoUrl,
            table:[],
            chart:[]
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.createTable = this.createTable.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
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

    handleLogout() {
        logout().then(function () {
            localStorage.removeItem(appTokenKey);
            this.props.history.push("/login");
            console.log("user signed out from firebase");
        }.bind(this));
    }

    handleButtonClick(){
        this.props.history.push("/app/form")
    }

    fetchData(url,type){
        let that = this;
        fetch(url)
        .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
        })
        .then(function(data) {
            if(type == 'table')
                that.setState({ table: data });
            else
                that.setState({ chart: data });
        });
    }

    componentDidMount() { 
        let tableUrl = 'https://jsonplaceholder.typicode.com/posts';
        let ChartUrl = 'https://api.worldbank.org/v2/countries/NOR/indicators/NY.GDP.MKTP.KD.ZG?per_page=30&MRV=30&format=json';
        this.fetchData(tableUrl,'table');
        this.fetchData(ChartUrl,'chart');
    }

    getChartData(){
        var data = this.state.chart;
      var country_name,indicatorName,year_list,arrayString
      var arrayString = [],
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
                  type: 'spline',
                  renderTo: 'container'
                },
                title: {
                  text: indicatorName
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
                subtitle: {
                  text: 'Source: World Bank Data'
                },
                xAxis: {
                  categories: year_list.reverse() 
                },
                series: [{
                  name: country_name,
                  data: array_final.reverse() 
                }]
              }
        )
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
                <div id="contents">
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
                    {this.state.chart.length == 0 ? "Loading..." :<Chart options={this.getChartData()} container={"chartId"} />}
                </div>
                <button className="button" onClick={this.handleButtonClick}><span>Next Screen </span></button>
            </div>
        );
    }
}