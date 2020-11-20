import consumer from "./consumer"

$(() => {
  const room_element = document.getElementById('room-id');
  const room_id = room_element.getAttribute('data-room-id');

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
      // Called when there's incoming data on the websocket for this channel
    }
  });
})
