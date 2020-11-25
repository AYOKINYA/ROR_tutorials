import consumer from "./consumer"

const RoomChannel = {};
RoomChannel.channel = null;

document.addEventListener('turbolinks:load', () => {

  // const room_element = document.getElementById('room-id');
  // const room_id = room_element.getAttribute('data-room-id');
  RoomChannel.leave = function() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
  };
  RoomChannel.start = function() {

    if (this.channel)
      return ;
      this.channel = consumer.subscriptions.create({
        channel: "RoomChannel", room_id: 1
      }, {
      connected() {
        // Called when the subscription is ready for use on the server
        console.log("You entered a chat room " + 1 + "!")
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
        console.log("You left a chat room!")

      },

      received(data) {
        console.log("DATA received");
        // Called when there's incoming data on the websocket for this channel
      }
    });
  }
})

export default RoomChannel;
