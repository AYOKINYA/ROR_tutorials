import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
    interpolate : /\{\{=(.+?)\}\}/g,
    escape : /\{\{-(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

var App = {};

$(function() {

    App.Person = Backbone.Model.extend({});
    App.View = Backbone.View.extend({
        el: "#message-form",
        template: _.template($('#form-tpl').html()),
        
        initialize: function() {
            this.listenTo(this.model, 'sync', this.render);
          },
        
        render: function() {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            return (this);
        },
        
        events: {
          'click .show': 'onShow'
        },
      
        onShow: function() {
          var $msg = this.$('#message');
          console.log("hello!");
          console.log($msg.val());
        }
    });
    var person = new App.Person({
        name: 'Thomas',
        message: "Hello Everyone!"
    }),
    app = new App.View({model: person});
    app.render();
});