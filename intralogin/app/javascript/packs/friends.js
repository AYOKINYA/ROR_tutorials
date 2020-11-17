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
    urlRoot: '/users'
  });
  
  var SearchCollection = Backbone.Collection.extend({
    model: SearchModel,
    url: '/users.json'
  });

  var FriendModel = Backbone.Model.extend({
    urlRoot: '/friends/',
    url: function () {
      return this.urlRoot + encodeURIComponent(this.get('id'));
    },
  });

  var FriendCollection = Backbone.Collection.extend({
    model: FriendModel,
    url: "/friends"

  })

  const friends = new FriendCollection;
  const user = new SearchModel;
  const users = new SearchCollection;

  var SearchListView = Backbone.View.extend({
    el: '#search-app',

    template: _.template($('#found-item-tmpl').html()),

    initialize: function() {
      this.model = user;
      this.collection = users;
      this.collection.fetch();	  
	},
	
    events: {
      'click #search' : 'search_user',
      'click #add-friend' : 'add_friend',
    },
    
    search_user: function(e) {
      e.preventDefault();
      const name = this.$('#username-input').val();
      console.log("=======");
      console.log(name);
      console.log("=======");
      var found = _.find(this.collection.models, function(item){
        return item.get('name') === name;
      });
      if (!found)
        return ;
      var html = this.template(found.toJSON());
      console.log(html);
      this.$el.find('#search-user-list').html(html);
    },

    add_friend: function (e) {
      const id = this.$('#user-id').val();
      const name = this.$('#user-name').val();
      const curr_name = this.$('#current-user-name').val();
      console.log(id);
      console.log(name);
      if (name == curr_name)
        return ;
      const new_friend = new FriendModel({ id: id, name: name });
      friends.fetch({
        success: function() {
          friends.add(new_friend);
          new_friend.save();
        }
      });
    },
      
    });
      
      var FriendsListView = Backbone.View.extend({
        el: '#friends-list',

        item_template: _.template($('#friend-item-tmpl').html()),

        profile_template: _.template($('#friend-profile-tmpl').html()),

        events: {
          'click .remove-friend': 'remove_friend',
          'dblclick #view-user-profile' : 'view_profile'
        },

        initialize: function() {
          this.collection = friends;
          this.listenTo(this.collection, 'sync', this.render);
          this.listenTo(this.collection, 'destroy', this.render);
          this.collection.fetch();
        },
      
        render: function() {
          console.log("<<<render friends list>>>");
          this.$el.html(this.item_template({friends: this.collection.toJSON()}));
        },

        remove_friend: function(e) {
          var user_id = e.currentTarget.getAttribute("user-id");
          console.log(user_id);
          
          var byebye = this.collection.get(user_id);
          byebye.destroy();
        },

        view_profile: function(e) {
          var id = this.$('#user-id').val();
          console.log(id);
          var profilemodel = new SearchModel({id: id});
          profilemodel.fetch({
            success: () => { // 화살표 함수로 하지 않으면 this가 undefined가 되어 처리가 매우 힘들다...
              console.log(profilemodel.toJSON());
              console.log($('#tmp').html())
              $('#tmp').html(this.profile_template(profilemodel.toJSON()));
            }
          })
          
          
        }
      
      });
    var FriendsView = new FriendsListView();
    var SearchView = new SearchListView();
    
});