
import React, { Component } from 'react'
import TableBody from './TableBody'
import Form from './Form';

var moment = require('moment');


class Timereport extends Component {

    backend_api_key = process.env.REACT_APP_backend_api_key ? process.env.REACT_APP_backend_api_key : "development"

    // TODO: Set this as default for all fetch requests
    headers = {
        'Content-Type': 'application/json',
        'Authorization': this.backend_api_key
    }

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

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.selectedUserId || !this.state.selectedMonth) return;
        if (prevState.selectedUserId !== this.state.selectedUserId || prevState.selectedMonth !== this.state.selectedMonth) {
            this.fetchData(this.state.selectedUserId, this.state.startDate, this.state.endDate, this.state.selectedMonth);
        }
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
    }

    fetchNames = async () => {
        const getUserNames = await fetch(`${this.props.backend_url}/users`, { headers: this.headers });
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
        const [data, lockstate, totaldays] = await Promise.all([
            fetch(`${this.props.backend_url}/users/${selectedUserId}/events?from=${encodeURIComponent(startDate)}&to=${encodeURIComponent(endDate)}`, { headers: this.headers }).then(response => response.json()),
            fetch(`${this.props.backend_url}/locks/dates/${selectedMonth}`, { headers: this.headers }).then(response => response.json()),

            fetch(`https://api2.codelabs.se/${encodeURIComponent(selectedMonth)}.json`).then(response => response.json()),
        ]);
        const totalholiday = totaldays.helgdagar;
        let lock_bool = undefined;
        Object.values(lockstate).forEach(value => {
            if (selectedUserId === value['user_id']) {
                lock_bool = true
            }
        });
        if (data && totalholiday) {
            this.setState({
                totaldays: totaldays.antal_arbetsdagar,
                totalholiday: totalholiday,
                data: data,
                error: '',
                lockstate: lock_bool,
            });
        } else {
            this.setState({
                data: undefined,
                totaldays: 0,
                totalholiday: [],
                lockstate: undefined,
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
