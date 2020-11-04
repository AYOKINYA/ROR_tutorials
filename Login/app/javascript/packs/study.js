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
        url: '/messages.json'
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

      close: function(){
        var value = this.input.val().trim();
        if (value) {
          this.model.save({content: value});
        }
        this.$el.removeClass('editing');
      },      
    });

    Chat.View = Backbone.View.extend({
      el: '#msg-app',

      initialize: function () {
        this.input = this.$('#new-msg');
        this.collection.on('add', this.addAll, this);
        this.collection.on('reset', this.addAll, this);
        this.collection.fetch();
      },
      events: {
        'keypress #new-msg': 'createMessageOnEnter'
      },
      createMessageOnEnter: function(e){
        if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
          return ;
        }
        this.collection.create(this.newAttributes());
        this.input.val(''); // clean input box
      },
      addOne: function(message){
        var view = new Chat.MessageView({model: message});
        $('#msg-list').append(view.render().el);
      },
      addAll: function(){
        this.$('#msg-list').html(''); // clean the todo list
        this.collection.each(this.addOne, this);
      },
      newAttributes: function(){
        const $room_id = this.$('#room-id');
        //const $user_id = this.$('#user-id');
        //user_id: $room_id.val(),
        console.log($room_id.val());
        return {
          room_id: $room_id.val(),
          content: this.input.val().trim()
        }
      }
    });

    var msgs = new Chat.Messages();
    var chat = new Chat.View({collection: msgs});
});

export default Chat;