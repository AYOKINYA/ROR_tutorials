import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
	interpolate : /\{\{=(.+?)\}\}/g,
	escape : /\{\{-(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g,
  };

$(function() {

	var SearchedUser = Backbone.Model.extend({
		urlRoot: '/search.json'
		});

	const SearchedUsers = Backbone.Collection.extend({
		model: SearchedUser,
		url: '/search.json'
	});

	const SearchedUsersView = Backbone.View.extend({

		template: _.template($('#searched-user-item-tmpl').html()),
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this ;
		},
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		});

	var SearchView = Backbone.View.extend({
		el: $("#view-searched-users"),
		
		initialize: function () {
			this.collection.on('add', this.addAll, this);
			this.collection.on('reset', this.addAll, this);
			this.collection.fetch();
		  },
		events: {
		'submit' : 'search_users'
		},
		search_users: function () {
			const username = $("#search-user-name").val();
			console.log("heeee");
			console.log(username);
			if (!username)
				return ;
		},
		addOne: function(user){
			var view = new Chat.MessageView({model: user});
			$('#searched-user-list').append(view.render().el);
		},
		addAll: function(){
			this.$('#searched-user-list').html('');
			this.collection.each(this.addOne, this);
		},
		render: function() {
			this.addAll
		}
	});
	  
	  const searchedusers = new SearchedUsers;
	  var SearchingView = new SearchView({collection: searchedusers});
});