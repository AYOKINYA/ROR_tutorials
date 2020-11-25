import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';
import RoomChannel from "../channels/room_channel"
import Router from './Router'

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

const Chat = {};

$(function() {

    var MessageModel = Backbone.Model.extend({
    urlRoot: '/rooms/1/messages',
    });

    var MessageCollection = Backbone.Collection.extend({
    model: MessageModel,
    url: "/rooms/1/messages.json"
    });

    Chat.messages = new MessageCollection;
    Chat.RoomView = Backbone.View.extend({
      el: '#chat-app',

      template: _.template($('#chat-room-tmpl').html()),

      events: {
        'click #close-chat-room' : 'close_chatroom',
        'submit #send-message-form' : 'send_message',
      },

      initialize: function() {
        this.collection = Chat.messages;
        this.listenTo(this.collection, 'sync', this.render);
        this.listenTo(this.collection, 'destroy', this.render);
        this.collection.fetch();
        RoomChannel.start(this.render_data);
      },
    
      render: function() {
        console.log("Rendering messages")
        $('#chat-messages-view').html(this.template({chats: this.collection.toJSON()}));
      },

      close_chatroom: function(e) {
        $('#chat-messages-view').empty();
        console.log("The chatroom is closed")
        RoomChannel.leave();
        Router.router.navigate("", { trigger: true });
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
        const new_msg = new MessageModel({user_id: id, content: content});
        var self = this;
        new_msg.fetch({
          success: () => {
            self.collection.add(new_msg);
            new_msg.save({}, {
                success: function() {
                    $('#chat-messages-view').html(self.template({chats: self.collection.toJSON()}));
                },
            });
          }
        })  
      },

      render_data : function(data) {
        const cur_id = $('input#user-id').val();
        if (data.message.user_id == cur_id)
          return ;
        const new_msg = new MessageModel(data.message);
        Chat.messages.add(new_msg);
        setTimeout(function() {
          Chat.RoomView.render();
        }, 1000);
      }
    });
});

export default Chat;