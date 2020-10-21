import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';


$(function() {

var TodoModel = Backbone.Model.extend({
  // urlRoot: '/todos'
});

var TodoCollection = Backbone.Collection.extend({
  model: TodoModel,
  url: '/todos.json'

});

var TodosListItemView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#todo-item-tmpl').html()),

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove)
  },

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
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
  el: '#todos-app',

  initialize: function() {
    this.listenTo(this.collection, 'sync', this.render);
  },

  render: function() {
    var $list = this.$('ul.todos-list').empty();

    this.collection.each(function(model) {
      var item = new TodosListItemView({model: model});
      $list.append(item.render().$el);
    }, this);

    return this;
  },

  events: {
    'click .create': 'onCreate'
  },

  onCreate: function() {
    var $title = this.$('#todo-title');
    var $order = this.$('#todo-order');
    
    console.log($title.val());
    console.log($order.val());

    if ($title.val()) {
      this.collection.create({
        title: $title.val(),
        order: $order.val()
      });

      $title.val('');
      $order.val('');
    }
  }
});

var todosList = new TodoCollection();

var todosView = new TodosListView({collection: todosList});
todosList.fetch();

});