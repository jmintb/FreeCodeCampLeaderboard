import React, { Component } from 'react';
import './App.css';
var jquery = require('jquery');

var last30DaysURL = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent';
var allTimeURL = 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';

class FccLeaderboard extends Component {
  constructor(props){
    super(props);
    this.state = ({sortBy: 'recent', campers: [], order: 'descending'});
  }

  handleSortingChange(sortBy, element) {
    if(sortBy !== this.state.sortBy+'') {
      this.resetOtherSortingBtn(element.target.id);
      element.target.className = 'sort-by descending';
      this.updateCampers(sortBy);
    } else if(sortBy === this.state.sortBy) {
      var newOrder = this.state.order === 'descending' ? 'ascending' : 'descending';
      element.target.className = 'sort-by ' + newOrder;
      this.setState({order: newOrder});
    }
  };

  resetOtherSortingBtn(id) {
    var otherId = id === 'recentCol' ? 'alltimeCol' : 'recentCol'; 
    document.getElementById(otherId).className = 'sort-by';
  }

  componentDidMount() {
    this.updateCampers(this.state.sortBy);
  }

  updateCampers(sortBy) {
    var url = sortBy === 'recent' ? last30DaysURL : allTimeURL;
    jquery.getJSON(url, (data) => {
      this.setState({campers: data, sortBy: sortBy, order: 'descending'});
    })
  }

  getSortedList() {
    var sortBy = this.state.sortBy;
    var sortedCampers = this.state.campers.sort((a, b) => 
      sortBy === 'alltime' ? this.compare(a.alltime, b.alltime) : this.compare(a.recent, b.recent)
    );

    return sortedCampers;
  }

  compare(a, b) {
    return this.state.order === 'descending' ? b - a : a - b;
  }

  createTableRows() {
    var rows = [];
    this.getSortedList().forEach(function(camper, index, array) {
      rows.push(
        <tr key = {index}>
          <td>{index+1}</td>
          <td>{camper.username}</td>
          <td>{camper.recent}</td>
          <td>{camper.alltime}</td>
        </tr>
      )
    });
    return rows;
  }

  render(){
    return(
      <div className="leader-board">
        <h3> FreeCodeCamp Leaderboard</h3>
        <table className="table table-stripped table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Camper</th>
              <th className="sort-by descending" id="recentCol" onClick = {this.handleSortingChange.bind(this, 'recent')}>Last30days</th>
              <th className="sort-by" id="alltimeCol" onClick = {this.handleSortingChange.bind(this, 'alltime')} >Total</th>
            </tr>
          </thead>
          <tbody>
          {this.createTableRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FccLeaderboard;
