import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
    interpolate : /\{\{=(.+?)\}\}/g,
    escape : /\{\{-(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  var token;
  options.xhrFields = {
    withCredentials: true
  };
  token = $('meta[name="csrf-token"]').attr('content');
  if (token) {
    return jqXHR.setRequestHeader('X-CSRF-Token', token);
  }
});

$(function() {

  var SearchModel = Backbone.Model.extend({
    urlRoot: '/search'
  });
  
  var SearchCollection = Backbone.Collection.extend({
    model: SearchModel,
    url: '/users.json'
  });

  var FriendModel = Backbone.Model.extend({
    urlRoot: '/friends',
    url: function () {
      return this.urlRoot + '/' + encodeURIComponent(this.get('id'));
    },
  });

  var FriendCollection = Backbone.Collection.extend({
    model: FriendModel,
    url: "/friends"

  })
  const friends = new FriendCollection;

  var SearchListView = Backbone.View.extend({
    el: '#search-app',

    template: _.template($('#found-item-tmpl').html()),

    initialize: function() {
      this.model = new SearchModel;
      this.collection = new SearchCollection;
      this.collection.fetch();	  
	},
	
      events: {
        'click #search' : 'search_user',
        'click #add-friend' : 'add_friend'
      },
      
      search_user: function(e) {
        e.preventDefault();
        const name = this.$('#username-input').val();
        console.log("=======");
        console.log(name);
        console.log("=======");
        var found = _.find(this.collection.models, function(item){
          return item.get('username') === name;
        });
        if (!found)
          return ;
        var html = this.template(found.toJSON());
        console.log(html);
        this.$el.find('#search-user-list').html(html);
      },

      add_friend: function (e) {
        const id = this.$('#user-id').val();
        console.log(id);
				const new_friend = new FriendModel({ id: id });
				friends.fetch({
					success: function() {
						friends.add(new_friend);
						new_friend.save();
						//this.collection.remove(this.collection.where({ user_id: id })[0]);
					}
				});
			},
      
      });
    var SearchView = new SearchListView;
});