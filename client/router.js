Meteor.Router.add({
  '/news': { as: 'news', to: function() {
    return 'news';
  }},
  '/room/:id': { as: 'room', to: function(id) {
    Session.set('currentRoomId', id);
    now = (new Date().getTime() / 1000);
    Session.set('dateRoomEntered', now);
    return 'room';
  }},
  '/': { as: 'root', to: function() {
    return 'hello';
  }},
  '/about': function() {
    if (Session.get('aboutUs')) {
      return 'aboutUs';
    } else {
      return 'aboutThem';
    }
  },
  '*': 'not_found'
});