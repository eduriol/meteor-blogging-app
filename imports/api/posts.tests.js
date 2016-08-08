/* global describe it beforeEach */
/* eslint no-underscore-dangle: ["error", { "allow": ["_execute", "_id"] }] */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { assert } from 'meteor/practicalmeteor:chai';

import { Posts } from './posts.js';
import { insertPost, removePost, updatePost, setIsPublic } from '../api/posts.js';

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
        const invocation = { userId };
        removePost._execute(invocation, { postId: post });
        assert.equal(Posts.find().count(), 0);
      });

      it('cannot delete other\'s post', () => {
        const invocation = { otherUserId };
        assert.throws(
          () => {
            removePost._execute(invocation, { postId: post });
          },
          Meteor.Error,
          'not-authorized'
        );
      });

      it('delete proper post among others', () => {
        const invocation = { userId };
        insertPost._execute(invocation, {
          title: 'test title 2',
          content: 'test content 2',
          createdAt: new Date(),
          isPublic: false,
          ownerId: userId,
          ownerName: 'jdoe',
        });
        insertPost._execute(invocation, {
          title: 'test title 3',
          content: 'test content 3',
          createdAt: new Date(),
          isPublic: false,
          ownerId: userId,
          ownerName: 'jdoe',
        });
        const postToDelete = Posts.findOne({ title: 'test title 2' });
        removePost._execute(invocation, { postId: postToDelete._id });
        assert.equal(Posts.find({ title: 'test title' }).count(), 1);
        assert.equal(Posts.find({ title: 'test title 2' }).count(), 0);
        assert.equal(Posts.find({ title: 'test title 3' }).count(), 1);
      });

      it('can make public owned post', () => {
        const invocation = { userId };
        setIsPublic._execute(invocation, { postId: post, isPublicPost: true });
        assert.equal(Posts.findOne(post).isPublic, true);
      });

      it('cannot make public other\'s post', () => {
        const invocation = { otherUserId };
        assert.throws(
          () => {
            setIsPublic._execute(invocation, { postId: post, isPublicPost: true });
          },
          Meteor.Error,
          'not-authorized'
        );
      });

      it('can insert a new post when logged in', () => {
        const invocation = { userId };
        Posts.remove({});
        insertPost._execute(invocation, {
          title: 'test title',
          content: 'test content',
          createdAt: new Date(),
          isPublic: false,
          ownerId: userId,
          ownerName: 'jdoe',
        });
        assert.equal(Posts.findOne().ownerName, 'jdoe');
      });

      it('cannot insert a new post when nobody logged in', () => {
        assert.throws(
          () => {
            insertPost._execute({}, {
              title: 'test title',
              content: 'test content',
              createdAt: new Date(),
              isPublic: false,
              ownerId: userId,
              ownerName: 'jdoe',
            });
          },
          Meteor.Error,
          'not-authorized'
        );
      });

      it('can edit owned post', () => {
        const invocation = { userId };
        updatePost._execute(invocation, {
          postId: post,
          newTitle: 'updated test title',
          newContent: 'updated test content',
        });
        assert.equal(Posts.findOne(post).title, 'updated test title');
        assert.equal(Posts.findOne(post).content, 'updated test content');
      });

      it('cannot edit other\'s post', () => {
        const invocation = { otherUserId };
        assert.throws(
          () => {
            updatePost._execute(invocation, {
              postId: post,
              newTitle: 'test title',
              newContent: 'test content',
            });
          },
          Meteor.Error,
          'not-authorized'
        );
      });
    });
  });
}
