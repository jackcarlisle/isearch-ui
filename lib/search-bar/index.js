import React, { Component, PropTypes } from 'react';

require('./style.css');

class SearchBar extends Component {

  constructor () {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick () {
    !this.props.disableClick && this.props.onButtonClick();
    // if one search request has already been sent, disable click until results have been returned
  }

  render () {
    return (
      <div className='searchBarContainer'>
        <div className='searchContent'>
          <img className='logo' src='https://cloud.githubusercontent.com/assets/12450298/13631826/8a5cb062-e5de-11e5-8b73-f2ec9d622d5f.png' />
          <h1 className='spies'>SPIES</h1>
        </div>
        <div>
          <div className='inspiration'>Inspiration</div>
        </div>
        <div className='inputContainer'>
          <form>
            <input className='inputBar' type='search' placeholder='Find your perfect holiday...' />
          </form>
          <div className='searchButton' onClick={this.handleOnClick.bind(this)}>Search</div>
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  disableClick: PropTypes.bool
};

export default SearchBar;