import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
    interpolate : /\{\{=(.+?)\}\}/g,
    escape : /\{\{-(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

var Chat = {};

$(function() {

    Chat.Message = Backbone.Model.extend({
        url: '/messages.json'
    });

    Chat.Messages = Backbone.Collection.extend({
        mode: Chat.Message,
        url: '/messages.json'
    });

    Chat.View = Backbone.View.extend({
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
    
    var msg = new Chat.Message();
    var chat = new Chat.View({model: msg});
    chat.render();
});

export default Chat;