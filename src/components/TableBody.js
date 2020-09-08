import React, { Component } from 'react'

var moment = require('moment');


class TableBody extends Component {
  state = {
    data: [],
  }

  renderHoursByType() {
    if (!this.props.data) {
      return null;
    }

    const hoursByType = this.props.data.reduce((acc, v) => {
      acc[v.reason] = (acc[v.reason] || 0) + parseInt(v.hours)
      return acc;
    }, {});

    return <div style={{ fontWeight: 'bold' }}>
      {Object.entries(hoursByType).map(([k, v]) => <div key="entry={k}">{k}: {v}h</div>)}
    </div>
  }

  renderMonthLocked() {
    return <div style={{ fontWeight: 'bold' }}>
      Month locked: {this.props.lockstate === true ? <span role="img" aria-label="locked">🔒</span> : <span role="img" aria-label="open">❌</span>}
    </div>
  }

  render() {
    var shortid = require('shortid');
    var data = this.props.data || undefined;
    var total_working_hours = this.props.totaldays * 8;
    var total_holiday = this.props.totalholiday;
    var weekendStyle = { color: 'red' };
    var total = 0;
    // clear weekends from data
    var weekday = [];
    var holiday_idx = [];
    var i = 0;
    var events = JSON.parse(JSON.stringify(data))
    Object.values(data).forEach(value => {
      // scrub holidays as well
      Object.values(total_holiday).forEach(holiday => {
        if (holiday.datum === value.event_date) {
          console.log("holiday date is : " + holiday.datum)
          console.log("event date is " + value.event_date)
          holiday_idx.push(i)
        }
      });
      if (moment(value.event_date).isoWeekday() >= 6) {
        weekday.push(i)
      }
      i++;
    });
    for (var idx = weekday.length - 1; idx >= 0; idx--) {
      data.splice(weekday[idx], 1);
    }
    for (var _idx = holiday_idx.length - 1; _idx >= 0; _idx--) {
      data.splice(holiday_idx[_idx], 1);
    }
    // summarize total hours
    Object.values(data).forEach(value => { total = total + parseInt(value.hours) });
    return (
      <div className="col-sm-12 col-md-12 col-lg-12">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">UserName</th>
              <th scope="col">Reason</th>
              <th scope="col">Hours</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          {this.props.error &&
            <p>
              {this.props.error}
            </p>
          }
          {events !== undefined &&
            <tbody>
              {events.map(item =>
                <tr key={shortid.generate()}>
                  <th scope="row"></th>
                  <td>{item.user_name}</td>
                  <td>{item.reason}</td>
                  <td>{item.hours}</td>
                  {moment(item.event_date).isoWeekday() >= 6 ? <td style={weekendStyle}> {item.event_date}</td> : <td> {item.event_date} </td>
                  }
                </tr>
              )}
            </tbody>
          }
          {(events.length === 0 && typeof events === 'object') && !isNaN(total_working_hours) &&
            <tbody className="justify-content-center">
              <tr key={shortid.generate()}>
                <th scope="row"></th>
                <td></td>
                <td colSpan='2'>Nothing Found</td>
                <td></td>
              </tr>
            </tbody>
          }
        </table>
        <div className="text-center">
          {events && !isNaN(total_working_hours) ?
            <div style={{ fontWeight: 'bold' }}>
              {this.renderMonthLocked()}
              Total hours / month:
                <span style={{ color: '#006600', fontWeight: 'bold' }}>  {total_working_hours - total}</span>/{total_working_hours}  (
                <span style={{ color: '#cc0000', fontWeight: 'bold' }}>-{total}</span>)
            </div>
            :
            <p>
            </p>

          }
          {this.renderHoursByType()}
        </div>
      </div>
    )
  }
}
export default TableBody;
