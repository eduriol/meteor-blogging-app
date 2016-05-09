import { Mongo } from 'meteor/mongo';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Posts = new Mongo.Collection('posts');

Posts.schema = new SimpleSchema({
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date },
  isPublic: { type: Boolean },
});

Posts.attachSchema(Posts.schema);
