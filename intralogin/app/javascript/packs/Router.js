import $ from 'jquery';
import _ from "underscore"
import Backbone from 'backbone';

import Chat from './Chat'

const Router = {};

if ($('html').data().isLogin && $('html').data().passOtp) {

$(function() {

  const RouterList = Backbone.Router.extend({
    routes: {//List of URL routes with the corresponding function name which will get called when user will visit a page having URL containing this route
      "": "main_page",  
      "rooms/:room_id":  "chatroom",  // localhost:8080/#rooms/3
    },
    chatroom(room_id)  {
        Chat.room = new Chat.RoomView({room_id: room_id});
    },
    main_page() {
      console.log("You are on the main page")
    }
    });

  Router.router = new RouterList();
  Backbone.history.start();

});

}

export default Router;