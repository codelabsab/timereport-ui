import React, { Component } from 'react'
import DatePicker from './DatePicker';

class Form extends Component {

  render() {
    var shortid = require('shortid');
    return (
        <div className="form-group">
        <label form="selection"></label>
        <select className="form-control justify-content-center"
                style={{maxWidth: '50%', float:'left'}}
                value={this.props.selectedOption}
                onChange={this.props.handleSelectChange}>
                <option disabled hidden>Select a Username</option>
                {Object.entries(this.props.names).map(name => (
                    <option key={shortid.generate()} value={name}>
                        {name[1]}
                    </option>
                ))};
        </select>
        <DatePicker 
                handleDateChange={this.props.handleDateChange}
                />
        </div>
    )
  }
}

export default Form;
