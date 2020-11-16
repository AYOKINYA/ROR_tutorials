import consumer from "./consumer"
import $ from "jquery"
import Backbone from "backbone"

consumer.subscriptions.create("UserStatusChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Welcome User!")
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log("Bye User!")
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
  }
});
