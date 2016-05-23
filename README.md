# Posteor
Posteor is a JavaScript blogging platform written with [Meteor](https://www.meteor.com/) & [React](https://facebook.github.io/react/) for fun and learning.

## Installation
In order to install and run the platform, just follow the next steps:
```
git clone https://github.com/eduriol/posteor.git
cd posteor
meteor
```
To run the Mocha tests:
```
meteor test --driver-package practicalmeteor:mocha
```
And to run the ESLint analyzer:
```
meteor npm run lint
```
## Usage
To use the blogging platform, remember that:
* You should register and sign in to post stuff.
* Each user is able only to edit, delete and make public her or his own posts.
* You should use [Markdown](https://en.wikipedia.org/wiki/Markdown) syntax to write the post content.
* No users management backend have been implemented yet, so existing users should be managed via MongoDB. Sorry about that.