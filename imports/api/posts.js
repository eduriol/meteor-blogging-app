import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Posts = new Mongo.Collection('posts');

Posts.schema = new SimpleSchema({
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date },
  isPublic: { type: Boolean },
  ownerId: { type: String },
  ownerName: { type: String },
});

Posts.attachSchema(Posts.schema);

if (Meteor.isServer) {
  Meteor.publish('posts', function postsPublication() {
    if (this.userId) {
      return Posts.find();
    }
    return Posts.find({ isPublic: true });
  });
}

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
      ownerId: Meteor.userId(),
      ownerName: Meteor.user().username,
    });
  },
  'posts.remove'(postId) {
    check(postId, String);

    Posts.remove(postId);
  },
  'posts.setIsPublic'(postId, setIsPublic) {
    check(postId, String);
    check(setIsPublic, Boolean);

    Posts.update(postId, { $set: { isPublic: setIsPublic } });
  },
});
