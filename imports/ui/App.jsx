import React, { Component } from 'react';
 
import Post from './Post.jsx';
 
// App component - represents the whole app
export default class App extends Component {
  getPosts() {
    return [
      { _id: 1, title: 'Post 1', content: 'This is post 1' },
      { _id: 2, title: 'Post 2', content: 'This is post 2' },
      { _id: 3, title: 'Post 3', content: 'This is post 3' },
    ];
  }
 
  renderPosts() {
    return this.getPosts().map((post) => (
      <Post key={post._id} post={post} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>My blog</h1>
        </header>
 
        <ul>
          {this.renderPosts()}
        </ul>
      </div>
    );
  }
}
