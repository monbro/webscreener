Meteor.Router.add({
  '/news': { as: 'news', to: function() {
    return 'news';
  }},
  '/room/:id': { as: 'room', to: function(id) {
    console.log("roomId: "+id);
    Session.set('currentRoomId', id);
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