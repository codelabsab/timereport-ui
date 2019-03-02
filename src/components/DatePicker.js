import React, { Component } from 'react'

var Datetime = require('react-datetime');

class DatePicker extends Component {

  render() {

    return (
      <div className="col-sm-6 col-md-6 col-lg-6">
        <Datetime dateFormat="YYYY-MM" utc={true} closeOnSelect={true} timeFormat={false} inputProps={{ placeholder: 'Select Month'}} onChange={this.props.handleDateChange}/>
      </div>
    )
  }
}

export default DatePicker;
