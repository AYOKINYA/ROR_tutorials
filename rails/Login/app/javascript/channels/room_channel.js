import consumer from "./consumer"
import Chat from "../packs/study.js"

// function getcollection() {
//   return new Promise(function(resolve, reject) {
//     var msgs = new Chat.Messages;
//     resolve(msgs);
//   });
// }

// function getview(collection) {
//   return new Promise(function(resolve, reject) {
//     var view = new Chat.View(collection);
//     resolve(view);
//   })
// }

// async function showdata() {
//     var messages = await getcollection();
//     var view = await getview(messages);
//     return (view);
// }

document.addEventListener('turbolinks:load', () => {
  const room_element = document.getElementById('room-id');
  const room_id = room_element.getAttribute('data-room-id');

  consumer.subscriptions.subscriptions.forEach((subscription) => {
    consumer.subscriptions.remove(subscription)
  })

  consumer.subscriptions.create({ channel: "RoomChannel", room_id: room_id }, {
    connected() {
      console.log("connected to " + room_id);
      //var view = showdata();
        var msgs = new Chat.Messages;
        var view = new Chat.View({collection: msgs});
    },

    disconnected() {
      console.log("Disconnected to " + room_id);
    },

    received(data) {
      console.log(data);
      const user_element = document.getElementById('user-id');
      const user_id = Number(user_element.getAttribute('data-user-id'));

      let html;

      if (user_id === data.message.user_id) {
        html = data.mine
      } else {
        html = data.theirs
      }

      const messageContainer = document.getElementById('messages')
      messageContainer.innerHTML = messageContainer.innerHTML + html
      
      document.getElementById('send').disabled = false;
      document.getElementById('message_content').value = '';
    }
  });
})