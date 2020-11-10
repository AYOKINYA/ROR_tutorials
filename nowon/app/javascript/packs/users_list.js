import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
    interpolate : /\{\{=(.+?)\}\}/g,
    escape : /\{\{-(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

$(function() {

  var UserModel = Backbone.Model.extend({
    urlRoot: '/users.json'
  });
  
  var UserCollection = Backbone.Collection.extend({
    model: UserModel,
    url: '/users.json'
  });

  var UsersListItemView = Backbone.View.extend({
    //tagName: 'li',
    className: 'user',
    template: _.template($('#user-item-tmpl').html()),
    
  
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
  
  var UsersListView = Backbone.View.extend({
    el: '#users-app',
  
    initialize: function() {
      this.listenTo(this.collection, 'sync', this.render);
    },
  
    render: function() {
      var $list = this.$('.users-list').empty();
  
      this.collection.each(function(model) {
        var item = new UsersListItemView({model: model});
        $list.append(item.render().$el);
      }, this);
  
      return this;
    },
  
    events: {
    },
  
  });

    var UsersList = new UserCollection();
    var UsersView = new UsersListView({collection: UsersList});
    UsersList.fetch();

});