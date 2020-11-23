import consumer from "./consumer"

const RoomChannel = {};

document.addEventListener('turbolinks:load', () => {

  const room_element = document.getElementById('room-id');
  const room_id = room_element.getAttribute('data-room-id');

  RoomChannel.start = function() {
    console.log("RoomChannel");
    if (this.channel)
      return ;
      consumer.subscriptions.create({channel: "RoomChannel", room_id: room_id}, {
      connected() {
        // Called when the subscription is ready for use on the server
        console.log("You entered a chat room" + room_id + "!")
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
