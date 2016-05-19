/* global describe it beforeEach */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';
import { assert } from 'meteor/practicalmeteor:chai';

import { Posts } from './posts.js';

if (Meteor.isServer) {
  describe('Posts', () => {
    describe('methods', () => {
      const userId = Random.id();
      const otherUserId = Random.id();
      let post;
      beforeEach(() => {
        Meteor.users.remove({});
        Posts.remove({});
        post = Posts.insert({
          title: 'test title',
          content: 'test content',
          createdAt: new Date(),
          isPublic: false,
          ownerId: userId,
          ownerName: 'jdoe',
        });
      });

      it('can delete owned post', () => {
        const deletePost = Meteor.server.method_handlers['posts.remove'];
        const invocation = { userId };
        deletePost.apply(invocation, [post]);
        assert.equal(Posts.find().count(), 0);
      });

      it('cannot delete other\'s post', () => {
        const deletePost = Meteor.server.method_handlers['posts.remove'];
        const invocation = { otherUserId };
        assert.throws(
          () => {
            deletePost.apply(invocation, [post]);
          },
          Meteor.Error,
          'not-authorized'
        );
      });

      it('can make public owned post', () => {
        const makePublic = Meteor.server.method_handlers['posts.setIsPublic'];
        const invocation = { userId };
        makePublic.apply(invocation, [post, true]);
        assert.equal(Posts.findOne(post).isPublic, true);
      });

      it('cannot make public other\'s post', () => {
        const makePublic = Meteor.server.method_handlers['posts.setIsPublic'];
        const invocation = { otherUserId };
        assert.throws(
          () => {
            makePublic.apply(invocation, [post, true]);
          },
          Meteor.Error,
          'not-authorized'
        );
      });

      it('can insert a new post when logged in', () => {
        const insertPost = Meteor.server.method_handlers['posts.insert'];
        const invocation = { userId: Accounts.createUser({ username: 'jdoe', password: 'jdoe' }) };
        Posts.remove({});
        insertPost.apply(invocation, ['test title', 'test content']);
        assert.equal(Posts.findOne().ownerName, 'jdoe');
      });

      it('cannot insert a new post when nobody logged in', () => {
        const insertPost = Meteor.server.method_handlers['posts.insert'];
        assert.throws(
          () => {
            insertPost.apply({}, ['test title', 'test content']);
          },
          Meteor.Error,
          'not-authorized'
        );
      });
    });
  });
}
