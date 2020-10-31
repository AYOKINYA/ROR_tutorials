import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

_.templateSettings = {
  interpolate : /\{\{=(.+?)\}\}/g,
  escape : /\{\{-(.+?)\}\}/g,
  evaluate: /\{\{(.+?)\}\}/g,
};

$(function() {

var RoomModel = Backbone.Model.extend({
  urlRoot: '/rooms.json'
});

var RoomCollection = Backbone.Collection.extend({
  model: RoomModel,
  url: '/rooms.json'

});

var RoomsListItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'room',
  template: _.template($('#room-item-tmpl').html()),
  

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove)
  },

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    
    console.log(this.model.get("name"));

    return (this);
  },

  events: {
    'click .remove': 'onRemove'
  },

  onRemove: function() {
    this.model.destroy();
  }
});

var RoomsListView = Backbone.View.extend({
  el: '#rooms-app',

  initialize: function() {
    //this.listenTo(this.collection, 'sync', this.render);
  },

  render: function() {
    var $list = this.$('ul.rooms-list').empty();

    this.collection.each(function(model) {
      var item = new RoomsListItemView({model: model});
      $list.append(item.render().$el);
    }, this);

    return this;
  },

  events: {
    'click .create': 'onCreate'
  },

  onCreate: function() {
    var $name = this.$('#room-name');
    
    console.log($name.val());

    if ($name.val()) {
      this.collection.create({
       name: $name.val(),
      });

      $name.val('');
    }
  }
});

var RoomsList = new RoomCollection();
var RoomsView = new RoomsListView({collection: RoomsList});
RoomsList.fetch();

});