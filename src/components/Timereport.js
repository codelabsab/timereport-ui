
import React, { Component } from 'react'
import TableBody from './TableBody'
import Form from './Form';
import DatePicker from './DatePicker';

class Timereport extends Component {
    constructor(props) {
        super(props)
        this.handleSelectChange = this.handleSelectChange.bind(this);
      }
  
      state = {
          data: [],
          names: [],
          error: undefined,
          selectedOption: undefined,
          selectedUserName: undefined,
          selectedUserId: undefined,
      }
  
      componentDidMount() {
          console.log('backend url is: ' + this.props.backend_url)
          this.fetchNames();
      }
  
      handleSelectChange = (selectedOption) => {
          var selectedUserName = selectedOption.target.value.split(',')[0];
          var selectedUserId = selectedOption.target.value.split(',')[1];
  
          this.setState({
              selectedOption: selectedOption.target.value,
              selectedUserName: selectedUserName,
              selectedUserId: selectedUserId,
          });
          console.log('userName is : ' + selectedUserName);
          console.log('Id is : ' + selectedUserId);
      }
  
      handleDateChange = (e, p) => {
          var moment = require('moment');
          var startDate = moment(p.startDate.toISOString()).format("YYYY-MM-DD");
          var endDate = moment(p.endDate.toISOString()).format("YYYY-MM-DD");
          this.setState({
              startDate: startDate,
              endDate: endDate
          })
          console.log('selected userid is ' + this.state.selectedUserId)
          console.log('it works, startDate: ' + startDate + ' endDate: ' + endDate)
          this.fetchData(this.state.selectedUserId, startDate, endDate)
      }
  
      fetchNames = async (e) => {
          const getUserNames = await fetch(`${this.props.backend_url}/user/names`);
          const names = await getUserNames.json();
          if (names) {
              this.setState({
                  names: names,
                  error: ''
              });
          } else {
              this.setState({
                  names: undefined,
                  error: 'Nothing Found in Database'
              })
              console.log(this.state.error);
          }
      }
  
      fetchData = async (selectedUserId, startDate, endDate) => {
          console.log('fetchData user_id is ' + selectedUserId)
          const getUserId = await fetch(`${this.props.backend_url}/user/${selectedUserId}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
          const data = await getUserId.json();
  
          if (data) {
              this.setState({
                  data: data,
                  error: ''
              });
          } else {
              this.setState({
                  data: undefined,
                  error: 'Nothing Found in Database'
              })
              console.log(this.state.error);
          }
      }
  render() {
      console.log('timereport.js backend url is: ' + this.props.backend_url)
    return (
        <div className="col-sm-12 col-md-12 col-lg-12">
        <form>
            <div className='form-row'>
                <Form
                names={this.state.names}
                selectedOption={this.state.selectedOption}
                handleSelectChange={this.handleSelectChange}
                />
                <DatePicker 
                handleDateChange={this.handleDateChange}
                backend_url={this.props.backend_url}
                />
            </div> 
        </form>
        <TableBody data={this.state.data}/>
    </div>      
    
    
    )
  }
}

export default Timereport;