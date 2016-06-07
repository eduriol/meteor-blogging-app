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
    const newTitle = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
    if (newTitle !== '') {
      this.setState({ noPostTitle: false });
      var newPost = {
        title: newTitle,
        content: ReactDOM.findDOMNode(this.refs.contentInput).value.trim(),
        createdAt: new Date(),
        isPublic: false,
        ownerId: Meteor.userId(),
        ownerName: Meteor.users.findOne(Meteor.userId()).username,
      };
      
      Meteor.call('Posts.methods.insert', newPost, (error) => {
        if (!error) {
          ReactDOM.findDOMNode(this.refs.titleInput).value = '';
          ReactDOM.findDOMNode(this.refs.contentInput).value = '';    
        }
      });
    }
    else {
      this.setState({ noPostTitle: true });
    }
  }

  renderNewPostForm() {
    const divStyle = {borderStyle: 'solid', borderWidth: '5px', borderColor: 'red'};
    return (
      <form className="col-md-8 col-md-offset-2" onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group">
          <input className="form-control input-lg" type="text" ref="titleInput" placeholder="Type to add the post title" required />
        </div>
        <div className="form-group">
          <textarea className="form-control" rows="10" ref="contentInput" placeholder="Type to add the post content" aria-describedby="helpBlock"/>
            <div className="row">
              <div className="col-md-6 col-xs-6">
                <span id="helpBlock" className="help-block">
                  The post content should follow <a target="_blank" href="https://en.wikipedia.org/wiki/Markdown">Markdown</a> syntax.
                </span>
              </div>
              <div className="col-md-6 col-xs-6">
                <button type="button" className="btn btn-link pull-right">
                  show preview
                </button>
              </div>
            </div>
        </div>
        <div className="form-group pull-right">
          <button type="submit" className="btn btn-primary">send</button>
        </div>
      </form>  
    );
  }
  
  renderPosts() {
    return this.props.posts.map((post) => (
      <Post key={post._id} post={post}/>
    ));
  }
  
  render() {
    return (
      <div className="container">
        <header>
          <h1>My blog</h1>
          <div className="loginForm">
            <AccountsUIWrapper/>
          </div>
          { this.props.currentUser ?
            <div className="row">
              { this.renderNewPostForm() }
            </div> : ''
          }
        </header>
        { (this.props.postsCount === 0) ?
          <div className="col-md-4 col-md-offset-4 alert alert-warning" role="alert">
            No posts have been published yet.
          </div> :
          <ul className="list-group">
            { this.renderPosts() }
          </ul>
        }
		  </div>
    );
  }
}

App.propTypes = {
  posts: PropTypes.array.isRequired,
  postsCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('posts');

  return {
    posts: Posts.find({}, { sort: { createdAt: -1 } }).fetch(),
    postsCount: Posts.find({}).count(),
    currentUser: Meteor.user(),
  };
}, App);
