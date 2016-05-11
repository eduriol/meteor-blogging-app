import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Posts = new Mongo.Collection('posts');

Posts.schema = new SimpleSchema({
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date },
  checked: {type: Boolean },
  owner: { type: String },
});

Posts.attachSchema(Posts.schema);

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
      checked: false,
      owner: Meteor.userId(),
    });
  },
  'posts.remove'(postId) {
    check(postId, String);

    Posts.remove(postId);
  },
  'posts.setChecked'(postId, setChecked) {
    check(postId, String);
    check(setChecked, Boolean);
 
    Posts.update(postId, { $set: { checked: setChecked } });
  },
});
