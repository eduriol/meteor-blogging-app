import React, { Component, PropTypes } from 'react';

import { Posts } from '../api/posts.js';

// Post component - represents a single blog item
export default class Post extends Component {
  togglePublic() {
    // Set the published property to the opposite of its current value
    Posts.update(this.props.post._id, {
      $set: { isPublic: !this.props.post.isPublic },
    });
  }

  deleteThisPost() {
    Posts.remove(this.props.post._id);
  }

  render() {
    return (
        <li>
            <p>
              <strong>{Meteor.users.findOne(this.props.post.owner).username}</strong>: {this.props.post.title}
              <button className="delete" onClick={this.deleteThisPost.bind(this)}>
                &times;
              </button>
              make public?
              <input
                type="checkbox"
                readonly
                isPublic={this.props.post.isPublic}
                onClick={this.togglePublic.bind(this)}
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
