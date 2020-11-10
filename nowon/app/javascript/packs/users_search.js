import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
    interpolate : /\{\{=(.+?)\}\}/g,
    escape : /\{\{-(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

$(function() {

  var SearchModel = Backbone.Model.extend({
    urlRoot: '/users'
  });
  
  var SearchCollection = Backbone.Collection.extend({
    model: SearchModel,
    url: '/users.json'
  });

  var SearchListItemView = Backbone.View.extend({
    //tagName: 'li',
    className: 'search',
    template: _.template($('#search-item-tmpl').html()),
    
  
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
  
  var SearchListView = Backbone.View.extend({
    el: '#search-app',
  
    initialize: function() {
	  this.collection = new SearchCollection;
	  this.listenTo(this.collection, 'sync', this.render);
	  this.collection.fetch();	  
	},
	
	events: {
		'click .search' : 'search_user'
	},
  
    render: function() {
      var $list = this.$('.search-list').empty();
  
      this.collection.each(function(model) {
        var item = new SearchListItemView({model: model});
        $list.append(item.render().$el);
      }, this);
  
      return this;
	},
	
	search_user: function(e) {
		e.preventDefault();
		console.log("=======");
		const name = this.$('#username-input').val();
		console.log(name);
		console.log("=======");
		var found = _.find(this.collection.models, function(item){
			return item.get('username') === name;
		});
		found.fetch();
	},
  
  });
    var SearchView = new SearchListView;
});