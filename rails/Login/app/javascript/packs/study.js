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
        urlRoot: '/messages'
    });

    Chat.Messages = Backbone.Collection.extend({
        model: Chat.Message,
        url: '/messages'
    });
    
    Chat.MessageView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#item-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      },
      initialize: function(){
        this.model.on('change', this.render, this);
      },      
      events: {
        
      },   
    });

    Chat.View = Backbone.View.extend({
      el: '#msg-app',

      initialize: function () {
        // this.listenTo(this.collection, 'sync', this.render);
        // this.collection.on('add', this.addAll, this);
        // this.collection.on('reset', this.addAll, this);
        this.collection.fetch();
      },
      events: {
        'submit': 'createMessage'
      },
      createMessage: function(e){

        const $room_id = this.$('#room-id');
        const $user_id = this.$('#user-id');
        const $auth_token = this.$('#auth-token');
        const $content = this.$('#new-msg');

        this.collection.create(
          {
            authenticity_token : $auth_token.val(),
            content: $content.val().trim(),
            user_id: $user_id.val(),
            room_id: $room_id.val(),
          }
        );
        //content.val(''); // clean input box
      },
      addOne: function(message){
        var view = new Chat.MessageView({model: message});
        $('#msg-list').append(view.render().el);
      },
      addAll: function(){
        this.$('#msg-list').html(''); // clean the todo list
        this.collection.each(this.addOne, this);
      },
      render: function() {
        this.addAll
      }
      
    });

    // var msgs = new Chat.Messages;
    // var chat = new Chat.View({collection: msgs});
});

export default Chat;