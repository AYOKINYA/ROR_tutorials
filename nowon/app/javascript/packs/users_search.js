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
    urlRoot: '/search'
  });
  
  var SearchCollection = Backbone.Collection.extend({
    model: SearchModel,
    url: '/users.json'
  });
  
  var SearchListView = Backbone.View.extend({
    el: '#search-app',

    template: _.template($('#found-item-tmpl').html()),

    initialize: function() {
      this.model = new SearchModel;
      this.collection = new SearchCollection;
      this.collection.fetch();	  
	},
	
      events: {
        'click .search' : 'search_user'
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
      
      });
    var SearchView = new SearchListView;
});