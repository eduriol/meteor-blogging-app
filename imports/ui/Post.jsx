import React, { Component, PropTypes } from 'react';
 
// Post component - represents a single blog item
export default class Post extends Component {
  render() {
    return (
        <div>
            <p>{this.props.post.title}</p>
            <p>{this.props.post.content}</p>
        </div>
    );
  }
}
 
Post.propTypes = {
  // This component gets the post to display through a React prop.
  // We can use propTypes to indicate it is required
  post: PropTypes.object.isRequired,
};
