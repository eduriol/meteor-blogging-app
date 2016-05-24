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
      <div className="row">
        <div className="col-xs-12">
          <header>
            <h1>My blog</h1>
            <div className="loginForm">
              <AccountsUIWrapper/>
            </div>
            { this.props.currentUser ?
                  <form onSubmit={this.handleSubmit.bind(this)} >
                    <div className="form-group">
                      <input className="form-control" type="text" ref="titleInput" placeholder="Type to add the post title"/>
                    </div>
                    <div className="form-group">
                      <textarea className="form-control" ref="contentInput" placeholder="Type to add the post content"/>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-default">send</button>
                    </div>
                  </form> : ''
            }
          </header>
          <ul className="list-group">
            {this.renderPosts()}
          </ul>
        </div>
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
