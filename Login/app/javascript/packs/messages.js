import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
  interpolate : /\{\{=(.+?)\}\}/g,
  escape : /\{\{-(.+?)\}\}/g,
  evaluate: /\{\{(.+?)\}\}/g,
};

$(function() {

    var TodoModel = Backbone.Model.extend({
      urlRoot: '/messages.json'
    });
    
    var TodoCollection = Backbone.Collection.extend({
      model: TodoModel,
      url: '/messages.json'
    
    });
    
    var TodosListItemView = Backbone.View.extend({

        template: _.template($("script[name='tmpl-chat-content']").html()),
    
      initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove)
      },
    
      render: function() {
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
        
        console.log(this.model.get("content"));

        return (this);
      },
    
      events: {
        'click .remove': 'onRemove'
      },
    
      onRemove: function() {
        this.model.destroy();
      }
    });
    
    var TodosListView = Backbone.View.extend({
      el: '#messages-app',
    
      initialize: function() {
        this.listenTo(this.collection, 'sync', this.render);
      },
    
      render: function() {
        var $list = this.$('ul.messages-list').empty();
    
        this.collection.each(function(model) {
          var item = new TodosListItemView({model: model});
          $list.append(item.render().$el);
        }, this);
    
        return this;
      },
    
      events: {
        'submit #message_form': 'send_message'
      },
    
      send_message: function() {
        var $content = this.$('input#content');
        var $user_id = $('html').data().user_id;
        var $room_id = $('html').data().room_id;
    
        if ($content.val()) {
          this.collection.create({
            content: $content.val(),
            user_id: $user_id.val(),
            room_id: $room_id.val(),
          });
    
          $content.val('');
        }
      }
    });
    
    var todosList = new TodoCollection();
    var todosView = new TodosListView({collection: todosList});
    todosList.fetch();
    
    });