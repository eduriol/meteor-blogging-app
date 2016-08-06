import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import marked from 'marked';

import ModalConfirmation from './ModalConfirmation.jsx';

export default class Post extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      contentHidden: true,
    };
  }

  deleteThisPost() {
    post = { postId: this.props.post._id };
    Meteor.call('Posts.methods.remove', post);
  }
  
  toggleIsPublic() {
    Meteor.call('posts.setIsPublic', this.props.post._id, !this.props.post.isPublic);
  }
  
  toggleEditMode() {
    this.setState({edit: !this.state.edit});
  }
  
  updateThisPost(event) {
    event.preventDefault();
    const newTitle = ReactDOM.findDOMNode(this.refs.newTitleInput).value.trim();
    const newContent = ReactDOM.findDOMNode(this.refs.newContentInput).value.trim();
    Meteor.call('posts.update', this.props.post._id, newTitle, newContent);
    this.setState({edit: false, contentHidden: false});
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  
  rawMarkup(text) {
    return { __html: marked(text, {sanitize: true}) };
  }
  
  toggleIsContentHidden() {
    this.setState({contentHidden: !this.state.contentHidden});
  }
  
  renderModal() {
    return (
      <ModalConfirmation
        title="Confirm deletion"
        body="Do you really want to delete this post? This action cannot be undone."
        cancelLabel="Cancel"
        onConfirm={ this.deleteThisPost.bind(this) }
        confirmLabel="Delete"
        buttonClass="btn btn-danger"
        modalId={ "modalConfirmation".concat(this.props.post._id) }
      />      
    );
  }
  
  renderPostButtons() {
    return (
      <div className="pull-right">
        <button type="button" className="btn btn-link gray" onClick={ this.toggleEditMode.bind(this) }>
          <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
        </button>
        <button type="button" className="btn btn-link gray" data-toggle="modal" data-target={"#modalConfirmation".concat(this.props.post._id)}>
          <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
        </button>
        <label className="checkbox-inline">
          <input
            type="checkbox"
            readOnly
            checked={ this.props.post.isPublic }
            onClick={ this.toggleIsPublic.bind(this) }/><small>make public</small>
        </label>
      </div>
    );
  }
  
  renderEditForm() {
    return (
      <form className="col-md-6 col-md-offset-3" onSubmit={ this.updateThisPost.bind(this) } >
        <div className="form-group">
          <input className="form-control input-lg" type="text" ref="newTitleInput" value={ this.props.post.title } onChange={ this.handleChange } required />
        </div>
        <div className="form-group">
          <textarea className="form-control" rows="10" ref="newContentInput" value={ this.props.post.content } onChange={ this.handleChange }/>
        </div>
        <div className="btn-toolbar pull-right">
          <button type="submit" className="btn btn-primary">save</button>
          <button type="button" className="btn btn-default" onClick={ this.toggleEditMode.bind(this) }>cancel</button>
        </div>
      </form>
    );
  }

  render() {
    return (
        <li className="list-group-item">
          { this.renderModal() }
          { !this.state.edit ?
            <div>
              { (Meteor.userId() === this.props.post.ownerId) ?
                this.renderPostButtons() : ''
              }
              <h2 className="postTitle" onClick={ this.toggleIsContentHidden.bind(this) }>
                { this.props.post.title } <small>(posted by { this.props.post.ownerName } on { this.props.post.createdAt.toDateString() })</small>
              </h2>
              { !this.state.contentHidden ?
                <p dangerouslySetInnerHTML={ this.rawMarkup(this.props.post.content) }/> : ''
              }
            </div> :
            <div className="row">
              { this.renderEditForm() }
            </div>
          }
        </li>
    );
  }
}
