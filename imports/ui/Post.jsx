import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import marked from 'marked';

export default class Post extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }
  
  toggleIsPublic() {
    Meteor.call('posts.setIsPublic', this.props.post._id, !this.props.post.isPublic);
  }
  
  changeToEditMode() {
    this.setState({edit: true});
  }
  
  updateThisPost() {
    const newTitle = ReactDOM.findDOMNode(this.refs.newTitleInput).value.trim();
    const newContent = ReactDOM.findDOMNode(this.refs.newContentInput).value.trim();
    Meteor.call('posts.update', this.props.post._id, newTitle, newContent);
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  
  rawMarkup() {
    return { __html: marked(this.props.post.content, {sanitize: true}) };
  }

  render() {
    return (
        <li className="list-group-item">
          { !this.state.edit ?
            <div>
              { (Meteor.userId() === this.props.post.ownerId) ?
                <div className="postInputs">
                  <div className="checkbox">
                    <label>
                      <input
                        type="checkbox"
                        readOnly
                        checked={this.props.post.isPublic}
                        onClick={this.toggleIsPublic.bind(this)}/> make public
                    </label>
                  </div>
                  <button type="button" className="btn btn-link" onClick={this.changeToEditMode.bind(this)}>
                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                  </button>
                  <button type="button" className="btn btn-link" onClick={this.deleteThisPost.bind(this)}>
                    <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                  </button>
                </div> : ''
              }
              <h2>
                {this.props.post.title} <small>(by {this.props.post.ownerName})</small>
              </h2>
              <p dangerouslySetInnerHTML={this.rawMarkup()}/>
            </div> :
            <div className="row">
              <form className="col-md-6 col-md-offset-3" onSubmit={this.updateThisPost.bind(this)} >
                <div className="form-group">
                  <input className="form-control input-lg" type="text" ref="newTitleInput" value={this.props.post.title} onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <textarea className="form-control" rows="10" ref="newContentInput" value={this.props.post.content} onChange={this.handleChange}/>
                </div>
                <div className="form-group pull-right">
                  <button type="submit" className="btn btn-default">save</button>
                </div>
              </form>
            </div>
          }
        </li>
    );
  }
}
