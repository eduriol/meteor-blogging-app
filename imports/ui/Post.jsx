import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

// Post component - represents a single blog item
export default class Post extends Component {
  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }
  
  toggleIsPublic() {
    Meteor.call('posts.setIsPublic', this.props.post._id, !this.props.post.isPublic);
  }

  render() {
    return (
        <li>
              <p>
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
            <span>
                {this.props.post.title}
                &nbsp;(written by ({this.props.post.ownerName})
            </span>
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
