// already published by module accounts-base
Users = Meteor.users;

Users.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return true;
  },
  remove: function (userId, doc) {
    return true;
  }
  // fetch: ['owner']
});