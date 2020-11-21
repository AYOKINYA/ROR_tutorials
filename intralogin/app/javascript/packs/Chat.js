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

    var ChatModel = Backbone.Model.extend({
    urlRoot: '/rooms/1/messages/',
    });

    var ChatCollection = Backbone.Collection.extend({
    model: ChatModel,
    url: "/rooms/1/messages.json"
    });
      
    var ChatRoomView = Backbone.View.extend({
      el: '#chat-app',

      template: _.template($('#chat-room-tmpl').html()),

      events: {
        'click #close-chat-room' : 'close_chatroom',
        'submit #send-message-form' : 'send_message',
      },

      initialize: function() {
        this.collection = new ChatCollection;
        this.listenTo(this.collection, 'sync', this.render);
        this.listenTo(this.collection, 'destroy', this.render);
        this.collection.fetch();
      },
    
      render: function() {
        $('#chat-messages-view').html(this.template({chats: this.collection.toJSON()}));
      },

      close_chatroom: function(e) {
        this.$el.empty();
        console.log("you have left the chat room")
      },

      send_message: function(e) {
        e.preventDefault(); //이거 안 하면 새로고침... ㅂㄷㅂㄷ
        const id = $(e.currentTarget).find('input#user-id').val();
        console.log(id);
        let content = $(e.currentTarget).find('input#content');
        content = _.escape(content.val());
        console.log(content);
        if (content === "")
            return ;
        const new_msg = new ChatModel({id: id, content: content});
        var self = this;
        new_msg.fetch({
          success: () => {
            self.collection.add(new_msg);
            new_msg.save({}, {
                success: function() {
                    $('#chat-messages-view').html(self.template(self.collection.toJSON()));
                },
            });
          }
        })  
      },
    
    });

    var chatroom = new ChatRoomView();
    
});