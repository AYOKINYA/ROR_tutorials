class UserStatusChannel < ApplicationCable::Channel
  def subscribed
    user_status = User.find_by(id: current_user[:id])
    user_status.update!(status: 1)
    data = {:id => current_user[:id], :status => 1}
    stream_from "user_status_channel"
    ActionCable.server.broadcast "user_status_channel", data
  end

  def unsubscribed
    user_status = User.find_by(id: current_user[:id])
    user_status.update!(status: 0)
    data = {:id => current_user[:id], :status => 0}
    ActionCable.server.broadcast "user_status_channel", data
  end
end
