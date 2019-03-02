import React, { Component } from 'react'

class TableBody extends Component {
  state = {
    data: [],
  }

  render() {
    var shortid = require('shortid');
    var data = this.props.data;
    var total_working_hours = this.props.totaldays * 8;
    var total = 0;
    // summarize total hours
    Object.values(data).forEach(value => { total = total + parseInt(value.hours) });
    console.log('total working hours are: ' + total_working_hours);
    console.log('data is ' + data)
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
                { this.props.error }
              </p>
            }
            {data !== undefined && !isNaN(total_working_hours) &&
              <tbody>
                {data.map(item => (
                  <tr key={shortid.generate()}>
                    <th scope="row"></th>
                    <td>{item.user_name}</td>
                    <td>{item.reason}</td>
                    <td>{item.hours}</td>
                    <td>{item.event_date}</td>
                  </tr>
                ))}
              </tbody> 
            }
               {(Object.entries(data).length === 0 && data.constructor === Object) && !isNaN(total_working_hours) &&
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
          {data && !isNaN(total_working_hours) && (total !== 0 ) ?
            <p style={{fontWeight: 'bold'}}>Total hours / month: 
                <span style={{color:  '#006600', fontWeight: 'bold'}}>  {total_working_hours-total}</span>/{total_working_hours}  (
                <span style={{color: '#cc0000', fontWeight: 'bold'}}>-{total}</span>)
            </p>
          :
          <p>
          </p>
          }
        </div>
    </div>
    )
  } 
} 
export default TableBody;