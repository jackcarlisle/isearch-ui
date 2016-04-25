import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-simple-datepicker';
import './styles.css';
class Calendar extends Component {
  constructor () {
    super();
    this.state = {
      date: new Date()
    };
  }
  render () {
    return (
      <div className='datePickerContainer'>
        <div className='dateLabel'>{this.props.label}</div>
        <DatePicker
         date={this.state.date}
         inputClassName='datePickerInput'
         dayClassName='day'
         dayActiveClassName='dayActive'
         dayFromOtherMonthClassName='dayOtherMonth'
         className='departDate'
        />
      </div>

    );
  }
}

Calendar.propTypes = {
  label: PropTypes.string
};

export default Calendar;