import React, { Component } from 'react'

class TableBody extends Component {
  render() {
    var shortid = require('shortid');
    
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
            {this.props.data && 
              <tbody>
                {this.props.data.map(item => (
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
          </table>  
        </div>
      )
  } 
} 
export default TableBody;
