import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
    interpolate : /\{\{=(.+?)\}\}/g,
    escape : /\{\{-(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

$(function() {

  var ProfileModel = Backbone.Model.extend({
    urlRoot: '/users/',
    url: function() {
        return this.urlRoot + encodeURIComponent(this.get('id'));
    }
  });
  
  var ProfileCollection = Backbone.Collection.extend({
    model: ProfileModel,
    url: '/users.json'
  });

  var ProfileView = Backbone.View.extend({
    el: '#profile-app',

    template: _.template($('#profile-tmpl').html()),
    
    initialize: function() {
      this.model.fetch();
      this.listenTo(this.model, 'sync', this.render)
    },
  
    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
      
      console.log(this.model.get("nickname"));
  
      var $profile = this.$('.my-profile').empty();
  
      $profile.append(this.$el.html(html).$el);

    },
  
    events: {
      
    },
  
  });
    const id = window.$('#cur-user-id').val();
    console.log(id);
    var profile = new ProfileModel({id : id});
    var profileView = new ProfileView({model: profile});

});