
import React, { Component } from 'react'
import TableBody from './TableBody'
import Form from './Form';
import DatePicker from './DatePicker';

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

      dateToISOString(aDate) {
        var date = moment(aDate);
        var dateComponent = date.utc().format('YYYY-MM-DD');
        console.log(dateComponent);
        
          console.log('inside DateToISO ' + dateComponent);
          return dateComponent;
          //return moment(aDate.toISOString()).format("YYYY-MM-DD");
      }

      handleDateChange = (e, p) => {
          var startDate = this.dateToISOString(p.startDate);
          var endDate = this.dateToISOString(p.endDate);
          console.log('inside handleDatechange' + startDate)
          this.setState({
              startDate: startDate,
              endDate: endDate
          })
          console.log('selected userid is ' + this.state.selectedUserId);
          console.log('it works, startDate: ' + startDate + ' endDate: ' + endDate);
          this.fetchData(this.state.selectedUserId, startDate, endDate);
          this.getMonthDateRange(endDate);
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

      getMonthDateRange(endDate) {
        console.log('getmonthdate: end is ' + endDate);
        
        //var check = moment(n.entry.date_entered, 'YYYY/MM/DD');
        //var month = check.format('M');

        const selectedEnd = moment(endDate, 'YYYY-MM-DD').format('YYYY-MM');
        this.setState({
            selectedEnd
        })
        console.log('selectedend day is: ' + selectedEnd);
        this.fetchWorkDays(selectedEnd);
    }

      fetchWorkDays = async (selectedDate) => {
        const getTotal = await fetch(`http://api.codelabs.se/${encodeURIComponent(selectedDate)}.json`);
        const totaldays = await getTotal.json();
        console.log('fetchworkdays totaldays STRINGIFY' + totaldays.antal_arbetsdagar);
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
                />
                <DatePicker 
                handleDateChange={this.handleDateChange}
                backend_url={this.props.backend_url}
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