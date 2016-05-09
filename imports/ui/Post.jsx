import React, { Component, PropTypes } from 'react';

import { Posts } from '../api/posts.js';
 
// Post component - represents a single blog item
export default class Post extends Component {
  deleteThisPost() {
    Posts.remove(this.props.post._id);
  }
  
  render() {
    return (
        <li>
            <p>
              <button className="delete" onClick={this.deleteThisPost.bind(this)}>
                &times;
              </button>
              {this.props.post.title}
            </p>
            <p>{this.props.post.content}</p>
        </li>
    );
  }
}
 
Post.propTypes = {
  // This component gets the post to display through a React prop.
  // We can use propTypes to indicate it is required
  post: PropTypes.object.isRequired,
};
