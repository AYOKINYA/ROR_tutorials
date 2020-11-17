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

  var MyProfileView = Backbone.View.extend({
    el: '#profile-app',

    template: _.template($('#profile-tmpl').html()),
    tagName: "li",
    events: {
      "dblclick .view" : "edit",
      "blur .edit" : "close"
    },

    initialize: function() {
      this.model.fetch();
      this.listenTo(this.model, 'sync', this.render);
    },
  
    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
      
      console.log(this.model.get("nickname"));
  
      var $profile = this.$('.my-profile').empty();
      $profile.append(this.$el.html(html).$el);
      return this;
    },
  
    edit: function() {
      this.$('.view').html('<input class="edit" type="text" />')
      this.$('.edit').focus();
    },

    close: function() {
      
      var new_nickname = this.$('.edit').val();
      if (!new_nickname) {
        return ;
      } else {
        this.model.save({nickname: new_nickname});
        this.$('.view').html('<label>' + new_nickname + '</label>')
      }
    },
  
  });
    const id = window.$('#cur-user-id').val();
    console.log(id);
    var profile = new ProfileModel({id : id});
    var myprofileView = new MyProfileView({model: profile});

});