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
      showModal: false,
      buttonClass: 'btn btn-danger',
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
  
  rawMarkup() {
    return { __html: marked(this.props.post.content, {sanitize: true}) };
  }
  
  toggleIsContentHidden() {
    this.setState({contentHidden: !this.state.contentHidden});
  }
  
  cancelPostEditing() {
    this.setState({edit: false});    
  }

  render() {
    return (
        <li className="list-group-item">
          <ModalConfirmation
            title="Confirm deletion"
            body="Do you really want to delete this post? This action cannot be undone."
            cancelLabel="Cancel"
            onConfirm={this.deleteThisPost.bind(this)}
            confirmLabel="Delete"
            buttonClass="btn btn-danger"
          />
          { !this.state.edit ?
            <div>
              { (Meteor.userId() === this.props.post.ownerId) ?
                <div className="pull-right">
                  <button type="button" className="btn btn-link gray" onClick={this.changeToEditMode.bind(this)}>
                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                  </button>
                  <button type="button" className="btn btn-link gray" data-toggle="modal" data-target="#modalConfirmation">
                    <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                  </button>
                  <label className="checkbox-inline">
                    <input
                      type="checkbox"
                      readOnly
                      checked={this.props.post.isPublic}
                      onClick={this.toggleIsPublic.bind(this)}/><small>make public</small>
                  </label>
                </div> : ''
              }
              <h2 className="postTitle" onClick={this.toggleIsContentHidden.bind(this)}>
                {this.props.post.title} <small>(by {this.props.post.ownerName})</small>
              </h2>
              { !this.state.contentHidden ?
                <p dangerouslySetInnerHTML={this.rawMarkup()}/> : ''
              }
            </div> :
            <div className="row">
              <form className="col-md-6 col-md-offset-3" onSubmit={this.updateThisPost.bind(this)} >
                <div className="form-group">
                  <input className="form-control input-lg" type="text" ref="newTitleInput" value={this.props.post.title} onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <textarea className="form-control" rows="10" ref="newContentInput" value={this.props.post.content} onChange={this.handleChange}/>
                </div>
                <div className="btn-toolbar pull-right">
                  <button type="submit" className="btn btn-primary">save</button>
                  <button type="button" className="btn btn-default" onClick={this.cancelPostEditing.bind(this)}>cancel</button>
                </div>
              </form>
            </div>
          }
        </li>
    );
  }
}
