import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Posts } from '../api/posts.js';

// Post component - represents a single blog item
export default class Post extends Component {
  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }
  
  toggleIsPublic() {
    // Set the checked property to the opposite of its current value
    Meteor.call('posts.setIsPublic', this.props.post._id, !this.props.post.isPublic);
  }

  render() {
    return (
        <li>
            <p>
              <span>
                {this.props.post.title}
                &nbsp;(written by {Meteor.users.findOne(this.props.post.owner).username})
              </span>
              <button className="delete" onClick={this.deleteThisPost.bind(this)}>
                &times;
              </button>
              <input
                type="checkbox"
                readOnly
                checked={this.props.post.isPublic}
                onClick={this.toggleIsPublic.bind(this)}
              />
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
  postsCount: PropTypes.number.isRequired,
};
