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

// Posts.schema = new SimpleSchema({
//   title: { type: String },
//   content: { type: String, optional: true },
//   createdAt: { type: Date },
//   isPublic: { type: Boolean },
//   ownerId: { type: String },
//   ownerName: { type: String },
// });

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

Meteor.methods({
  'posts.insert'(title, content) {
    check(title, String);
    check(content, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.insert({
      title,
      content,
      createdAt: new Date(),
      isPublic: false,
      ownerId: this.userId,
      ownerName: Meteor.users.findOne(this.userId).username,
    });
  },
  'posts.remove'(postId) {
    check(postId, String);

    if (this.userId !== Posts.findOne(postId).ownerId) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.remove(postId);
  },
  'posts.setIsPublic'(postId, setIsPublic) {
    check(postId, String);
    check(setIsPublic, Boolean);

    if (this.userId !== Posts.findOne(postId).ownerId) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.update(postId, { $set: { isPublic: setIsPublic } });
  },
  'posts.update'(postId, newTitle, newContent) {
    check(postId, String);
    check(newTitle, String);
    check(newContent, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.update(postId, { $set: { title: newTitle, content: newContent } });
  },
});
