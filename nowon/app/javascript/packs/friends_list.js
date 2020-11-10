import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
    interpolate : /\{\{=(.+?)\}\}/g,
    escape : /\{\{-(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

$(function() {

  var FriendModel = Backbone.Model.extend({
    urlRoot: '/friends.json'
  });
  
  var FriendCollection = Backbone.Collection.extend({
    model: FriendModel,
    url: '/friends.json'
  });

  var FriendsListItemView = Backbone.View.extend({
    //tagName: 'li',
    className: 'friend',
    template: _.template($('#friend-item-tmpl').html()),
    
  
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove)
    },
  
    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
      
      console.log(this.model.get("username"));
  
      return (this);
    },
  
    events: {
      'click .remove': 'onRemove'
    },
  
    onRemove: function() {
      this.model.destroy();
    }
  });
  
  var FriendsListView = Backbone.View.extend({
    el: '#friends-app',
  
    initialize: function() {
      this.listenTo(this.collection, 'sync', this.render);
    },
  
    render: function() {
      var $list = this.$('.friends-list').empty();
  
      this.collection.each(function(model) {
        var item = new FriendsListItemView({model: model});
        $list.append(item.render().$el);
      }, this);
  
      return this;
    },
  
    events: {
    },
  
  });

    var FriendsList = new FriendCollection();
    var FriendsView = new FriendsListView({collection: FriendsList});
    FriendsList.fetch();

});