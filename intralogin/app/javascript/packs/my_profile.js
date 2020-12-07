import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';
import Helper from './Helper.js'

_.templateSettings = {
    interpolate : /\{\{=(.+?)\}\}/g,
    escape : /\{\{-(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

if ($('html').data().isLogin && $('html').data().passOtp) {

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
      "click #edit-profile" : "edit_profile",
    },

    initialize: function() {
      this.model.fetch();
      this.listenTo(this.model, 'sync', this.render);
    },
  
    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
  
      var $profile = this.$('.my-profile').empty();
      $profile.append(this.$el.html(html).$el);
      return this;
    },

    edit_profile: function() {
      this.model.fetch({
        success: () => {
          var editprofileView = new EditProfileView({model: this.model});
        }
      }) 
    },
  
  });

  var EditProfileView = Backbone.View.extend({
    el: '#edit-profile-view',

    edit_template: _.template($('#edit-profile-tmpl').html()),
    two_factor_template: _.template($('#two-factor-tmpl').html()),

    events: {
      "dblclick .current-nickname-view" : "change_nickname",
      "blur .edit" : "close",
      "submit #avatar-form": "upload_image",
      'click #close-my-profile' : 'close_profile',
      'click #enable-two-factor' : 'enable_two_factor',
      'click #disable-two-factor' : 'disable_two_factor',
    },

    initialize: async function() {
      this.model.fetch();
      this.listenTo(this.model, 'sync', this.render);
      const data = await Helper.ajax(`/two_factor_settings/`, "", "GET");
			this.render_two_factor(data);
    },

    render: function() {
      $('#edit-profile-view').html(this.edit_template(this.model.toJSON()));
    },

    render_two_factor : function(data) {
      $('#two-factor').html(this.two_factor_template(data));
    },

    enable_two_factor: async function() {
      console.log("enable")
      await Helper.ajax(`/two_factor_settings/`, "otp_required_for_login=true", "PUT");
			const data = await Helper.ajax(`/two_factor_settings/`, "", "GET");
      console.log(data);
			this.render_two_factor(data);
    },
    
		disable_two_factor: async function() {
      console.log("disable")
      await Helper.ajax(`/two_factor_settings/`, "otp_required_for_login=false", "PUT");
			const data = await Helper.ajax(`/two_factor_settings/`, "", "GET");
			this.render_two_factor(data);
		},

    change_nickname: function() {
      $('.current-nickname-view').html('<input class="edit" type="text" />')
      $('.edit').focus();
    },

    close: function() {
      var new_nickname = this.$('.edit').val();
      if (!new_nickname) {
        return ;
      } else {
        this.model.save({nickname: new_nickname});
        this.$('.current-nickname-view').html('<label>' + new_nickname + '</label>')
      }
    },

    upload_image: function(e) {
      e.preventDefault();
      const file = document.getElementById("avatar");
			if (!file.files[0])
        return ;
      const reader = new FileReader();
      const self = this;
			reader.addEventListener("load", function () {
				self.model.set({
					image: this.result
				});
				self.model.save({}, {
					success: function(model) {
						self.model.fetch();
					},
        });
			}, false);
			reader.readAsDataURL(file.files[0]);
    },
  
    close_profile: function(e) {
      this.$el.empty();
    },

  });
  
    const id = window.$('#cur-user-id').val();
    var profile = new ProfileModel({id : id});
    var myprofileView = new MyProfileView({model: profile});
});

}