
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
        totalholiday: undefined,
    }

    componentDidMount() {
        this.fetchNames();
    }

    handleSelectChange = (selectedOption) => {
        var selectedUserName = selectedOption.target.value.split(',')[1];
        var selectedUserId = selectedOption.target.value.split(',')[0];

        this.setState({
            selectedOption: selectedOption.target.value,
            selectedUserName: selectedUserName,
            selectedUserId: selectedUserId,
        });
    }

    handleDateChange = (p) => {
        const selectedMonth = moment.unix(p / 1000).format('YYYY-MM');
        const startDate = moment.unix(p / 1000).startOf('month').format('YYYY-MM-DD');
        const endDate = moment.unix(p / 1000).endOf('month').format('YYYY-MM-DD');
        this.setState({
            startDate: startDate,
            endDate: endDate,
            selectedMonth: selectedMonth
        })
        this.fetchData(this.state.selectedUserId, startDate, endDate, selectedMonth);
        this.fetchWorkDays(selectedMonth);
    }

    fetchNames = async (e) => {
        const getUserNames = await fetch(`${this.props.backend_url}/users`);
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

    fetchData = async (selectedUserId, startDate, endDate, selectedMonth) => {
        const getUserEvents = await fetch(`${this.props.backend_url}/users/${selectedUserId}/events?from=${encodeURIComponent(startDate)}&to=${encodeURIComponent(endDate)}`);
        const data = await getUserEvents.json();
        const getLock = await fetch(`${this.props.backend_url}/locks/dates/${selectedMonth}`);
        const lockstate = await getLock.json();
        var lock_bool = undefined;
        Object.values(lockstate).forEach(value => {
            if (selectedUserId === value['user_id']) {
                lock_bool = true
            }
        });
        if (data) {
            this.setState({
                data: data,
                error: '',
                lockstate: lock_bool,
            });
        } else {
            this.setState({
                data: undefined,
                lockstate: undefined,
                error: 'Nothing Found in Database'
            })
            console.log(this.state.error);
        }
    }

    fetchWorkDays = async (selectedDate) => {
        const getTotal = await fetch(`http://api.codelabs.se/${encodeURIComponent(selectedDate)}.json`);
        const totaldays = await getTotal.json();
        const totalholiday = totaldays.helgdagar;
        if (totaldays) {
            this.setState({
                totaldays: totaldays.antal_arbetsdagar,
                totalholiday: totalholiday,
                error: ''
            });
        } else {
            this.setState({
                totaldays: '',
                totalweekends: '',
                error: 'Nothing Found in Database'
            })
            console.log(this.state.error);
        }
    }
    render() {
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
                    totalholiday={this.state.totalholiday}
                    lockstate={this.state.lockstate}
                />
            </div>
        )
    }
}

export default Timereport;