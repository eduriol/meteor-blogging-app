import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
 
import { Posts} from './posts.js';
 
if (Meteor.isServer) {
  describe('Posts', () => {
    describe('methods', () => {
      const userId = Random.id();
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
    });
  });
}
