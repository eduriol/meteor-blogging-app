import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

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
              { (Meteor.userId() === this.props.post.ownerId) ?
              <div className="postInputs">
                <button className="delete" onClick={this.deleteThisPost.bind(this)}>
                  &times;
                </button>
                <label htmlFor="makePublic">make public?</label>
                <input
                  type="checkbox"
                  readOnly
                  checked={this.props.post.isPublic}
                  onClick={this.toggleIsPublic.bind(this)}
                />
              </div> : ''
              }
              <h3>
                {this.props.post.title}
                &nbsp;(by {this.props.post.ownerName})
              </h3>
            </p>
            <p>
              {this.props.post.content}
            </p>
        </li>
    );
  }
}
