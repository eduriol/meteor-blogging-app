/* global describe it beforeEach */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Posts } from './posts.js';

if (Meteor.isServer) {
  describe('Posts', () => {
    describe('methods', () => {
      const userId = Random.id();
      const otherUserId = Random.id();
      let post;
      beforeEach(() => {
        Posts.remove({});
        post = Posts.insert({
          title: 'test post',
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
    });
  });
}
