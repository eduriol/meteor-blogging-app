import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const Posts = new Mongo.Collection('posts');


if (Meteor.isServer) {
  Meteor.publish('posts', function postsPublication() {
    if (this.userId) {
      return Posts.find();
    }
    return Posts.find({ isPublic: true });
  });
}

export const insertPost = new ValidatedMethod({
  name: 'Posts.methods.insert',
  validate: new SimpleSchema({
    title: { type: String, min: 1 },
    content: { type: String },
    createdAt: { type: Date },
    isPublic: { type: Boolean },
    ownerId: { type: String },
    ownerName: { type: String },
  }).validator(),
  run(post) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Posts.insert(post);
  },
});

export const removePost = new ValidatedMethod({
  name: 'Posts.methods.remove',
  validate: new SimpleSchema({
    postId: { type: String },
  }).validator(),
  run({ postId }) {
    if (this.userId !== Posts.findOne(postId).ownerId) {
      throw new Meteor.Error('not-authorized');
    }
    Posts.remove(postId);
  },
});

export const updatePost = new ValidatedMethod({
  name: 'Posts.methods.update',
  validate: new SimpleSchema({
    postId: { type: String },
    newTitle: { type: String },
    newContent: { type: String },
  }).validator(),
  run (updatedPost) {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.update(updatedPost.postId, { $set: { title: updatedPost.newTitle, content: updatedPost.newContent } });  
  }
})

Meteor.methods({
  'posts.setIsPublic'(postId, setIsPublic) {
    check(postId, String);
    check(setIsPublic, Boolean);

    if (this.userId !== Posts.findOne(postId).ownerId) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.update(postId, { $set: { isPublic: setIsPublic } });
  },
});
