/* global describe it beforeEach */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { assert } from 'meteor/practicalmeteor:chai';

import { Posts } from './posts.js';

if (Meteor.isServer) {
  describe('Posts', () => {
    describe('methods', () => {
      Meteor.users.remove({});
      const userId = Accounts.createUser({ username: 'jdoe', password: 'jdoe' });
      const otherUserId = Accounts.createUser({ username: 'kdoe', password: 'kdoe' });
      let post;
      beforeEach(() => {
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
        const deletePost = Meteor.server.method_handlers['Posts.methods.remove'];
        const invocation = { userId };
        deletePost.apply(invocation, [{
          postId: post,
        }]);
        assert.equal(Posts.find().count(), 0);
      });

      it('cannot delete other\'s post', () => {
        const deletePost = Meteor.server.method_handlers['Posts.methods.remove'];
        const invocation = { otherUserId };
        assert.throws(
          () => {
            deletePost.apply(invocation, [{
              postId: post,
            }]);
          },
          Meteor.Error,
          'not-authorized'
        );
      });

      it('delete proper post among others', () => {
        const deletePost = Meteor.server.method_handlers['Posts.methods.remove'];
        const insertPost = Meteor.server.method_handlers['Posts.methods.insert'];
        const invocation = { userId };
        insertPost.apply(invocation, [{
          title: 'test title 2',
          content: 'test content 2',
          createdAt: new Date(),
          isPublic: false,
          ownerId: userId,
          ownerName: 'jdoe',
        }]);
        insertPost.apply(invocation, [{
          title: 'test title 3',
          content: 'test content 3',
          createdAt: new Date(),
          isPublic: false,
          ownerId: userId,
          ownerName: 'jdoe',
        }]);
        const postToDelete = Posts.findOne({ title: 'test title 2' });
        deletePost.apply(invocation, [{
          postId: postToDelete._id,
        }]);
        assert.equal(Posts.find({ title: 'test title' }).count(), 1);
        assert.equal(Posts.find({ title: 'test title 2' }).count(), 0);
        assert.equal(Posts.find({ title: 'test title 3' }).count(), 1);
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
        const insertPost = Meteor.server.method_handlers['Posts.methods.insert'];
        const invocation = { userId };
        Posts.remove({});
        insertPost.apply(invocation, [{
          title: 'test title',
          content: 'test content',
          createdAt: new Date(),
          isPublic: false,
          ownerId: userId,
          ownerName: 'jdoe',
        }]);
        assert.equal(Posts.findOne().ownerName, 'jdoe');
      });

      it('cannot insert a new post when nobody logged in', () => {
        const insertPost = Meteor.server.method_handlers['Posts.methods.insert'];
        assert.throws(
          () => {
            insertPost.apply({}, [{
              title: 'test title',
              content: 'test content',
              createdAt: new Date(),
              isPublic: false,
              ownerId: userId,
              ownerName: 'jdoe',
            }]);
          },
          Meteor.Error,
          'not-authorized'
        );
      });

      it('can edit owned post', () => {
        const updatePost = Meteor.server.method_handlers['posts.update'];
        const invocation = { userId };
        updatePost.apply(invocation, [post, 'updated test title', 'updated test content']);
        assert.equal(Posts.findOne(post).title, 'updated test title');
        assert.equal(Posts.findOne(post).content, 'updated test content');
      });

      it('cannot edit other\'s post', () => {
        const updatePost = Meteor.server.method_handlers['posts.update'];
        const invocation = { otherUserId };
        assert.throws(
          () => {
            updatePost.apply(invocation, [post, 'test title', 'test content']);
          },
          Meteor.Error,
          'not-authorized'
        );
      });
    });
  });
}
