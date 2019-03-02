
import React, { Component } from 'react'
import TableBody from './TableBody'
import Form from './Form';

var moment = require('moment');


class Timereport extends Component {
    constructor(props) {
        super(props)
        this.handleSelectChange = this.handleSelectChange.bind(this);
      }
  
      state = {
          data: [],
          names: [],
          days: [],
          error: undefined,
          selectedOption: undefined,
          selectedUserName: undefined,
          selectedUserId: undefined,
          totaldays: undefined,
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

      handleDateChange = (p) => {
          console.log('inside handleDateChange in ms' + p)
          const selectedMonth = moment.unix(p/1000).format('YYYY-MM');
          const startDate = moment.unix(p/1000).startOf('month').format('YYYY-MM-DD');
          const endDate   = moment.unix(p/1000).endOf('month').format('YYYY-MM-DD');          
          console.log('inside handleDatechange start' + startDate)
          console.log('inside handleDatechange end' + endDate)
          console.log('inside handleDatechange selectedmonth' + selectedMonth)
          this.setState({
              startDate: startDate,
              endDate: endDate,
              selectedMonth: selectedMonth
          })
          console.log('selected userid is ' + this.state.selectedUserId);
          console.log('it works, startDate: ' + startDate + ' endDate: ' + endDate);
          this.fetchData(this.state.selectedUserId, startDate, endDate);
          this.fetchWorkDays(selectedMonth);
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
          console.log('fetchData user_id is ' + selectedUserId);
          console.log('fetchData startdate enddate query is ' + startDate + endDate);

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

      fetchWorkDays = async (selectedDate) => {
        console.log('fetchWorkDays ' + selectedDate)
        const getTotal = await fetch(`http://api.codelabs.se/${encodeURIComponent(selectedDate)}.json`);
        const totaldays = await getTotal.json();
        if (totaldays) {
            console.log('fetchworkdays totaldays found ' + totaldays.antal_arbetsdagar);
            this.setState({
                totaldays: totaldays.antal_arbetsdagar,
                error: ''
            });
        } else {
            this.setState({
                totaldays: '',
                error: 'Nothing Found in Database'
            })
            console.log(this.state.error);
        }
        console.log('fetchworkdays is set totaldays is ' + this.state.totaldays);
    }
  render() {
      console.log('timereport.js backend url is: ' + this.props.backend_url)
      console.log('render timereport.js is set totaldays is ' + this.state.totaldays);

    return (
        <div className="col-sm-12 col-md-12 col-lg-12">
        <form>
            <div className='form-row'>
                <Form
                names={this.state.names}
                selectedOption={this.state.selectedOption}
                handleSelectChange={this.handleSelectChange}
                handleDateChange={this.handleDateChange}
                />
            </div> 
        </form>
        <TableBody 
        data={this.state.data}
        totaldays={this.state.totaldays}
        />
    </div>      
    )
  }
}

export default Timereport;