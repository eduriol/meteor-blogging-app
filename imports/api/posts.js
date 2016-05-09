import { Mongo } from 'meteor/mongo';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//import { Schemas } from 'meteor/aldeed:collection2';

export const Posts = new Mongo.Collection('posts');

Posts.schema = new SimpleSchema({
  title: { type: String },
  content: { type: String },
  createdAt: { type: Date },
});

Posts.attachSchema(Posts.schema);
