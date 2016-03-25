import React, { Component, PropTypes } from 'react';
import Tag from './tag.js';

require('./style.css');

export default class TagContainer extends Component {
  render () {
    const { tags, removeTag } = this.props;
    var tagComponents = tags.map(function (tag) {
      return <Tag key={tag.tagName} tagName={tag.tagName} colour={tag.colour} removeTag={removeTag}/>;
    });
    return (
      <div className='tagContainer'>
        {tagComponents}
      </div>

    );
  }
}

TagContainer.propTypes = {
  tags: PropTypes.array,
  removeTag: PropTypes.func
};