import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Posts } from '../api/posts.js';
 
import Post from './Post.jsx';
 
// App component - represents the whole app
class App extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the post title & content via the React ref
    const title = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
    const content = ReactDOM.findDOMNode(this.refs.contentInput).value.trim();
 
    const post = {
      title,
      content,
      createdAt: new Date(), // current time
    };
    
    Posts.schema.validate(post);
    Posts.insert(post);
    
    // Clear form
    ReactDOM.findDOMNode(this.refs.titleInput).value = '';
    ReactDOM.findDOMNode(this.refs.contentInput).value = '';
  }  
  
  renderPosts() {
    return this.props.posts.map((post) => (
      <Post key={post._id} post={post} />
    ));
  }
 
  render() {
    return (
      <div>
        <header>
          <h1>My blog</h1>
          <form onSubmit={this.handleSubmit.bind(this)} >
            <p>
              <input type="text" ref="titleInput" placeholder="Type to add the post title"/>
            </p>
            <p>
              <textarea ref="contentInput" placeholder="Type to add the post content"/>
            </p>
            <input type="submit"/>
          </form>
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
};
 
export default createContainer(() => {
  return {
    posts: Posts.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, App);
