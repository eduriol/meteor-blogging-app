import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Posts } from '../api/posts.js';

import Post from './Post.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class App extends Component {
  handleSubmit(event) {
    event.preventDefault();

    const title = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
    const content = ReactDOM.findDOMNode(this.refs.contentInput).value.trim();

    Meteor.call('posts.insert', title, content);

    ReactDOM.findDOMNode(this.refs.titleInput).value = '';
    ReactDOM.findDOMNode(this.refs.contentInput).value = '';
  }

  renderPosts() {
    return this.props.posts.map((post) => (
      <Post key={post._id} post={post}/>
    ));
  }

  render() {
    return (
      <div>
        <header>
          <h1>My blog</h1>
          <AccountsUIWrapper />

          { this.props.currentUser ?
            <div className="row">
              <div className="col-xs-12">
                <form onSubmit={this.handleSubmit.bind(this)} >
                  <div className="form-group">
                    <p>
                      <input type="text" ref="titleInput" placeholder="Type to add the post title"/>
                    </p>
                    <p>
                      <textarea className="form-control" ref="contentInput" placeholder="Type to add the post content"/>
                    </p>
                    <input type="submit"/>
                  </div>
                </form>
              </div>
            </div>: ''
          }
        </header>
        <ul>
          {this.renderPosts()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  posts: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('posts');

  return {
    posts: Posts.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
