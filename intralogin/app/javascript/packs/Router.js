import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

$(function() {

  const Router = Backbone.Router.extend({
  routes: {//List of URL routes with the corresponding function name which will get called when user will visit a page having URL containing this route
      "rooms/:room_id":  "chatroom",  // localhost:8080/#rooms/3
  },
  chatroom: function() {
      console.log("hi");
      }
  });

var router = new Router();
Backbone.history.start();

});