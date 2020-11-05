class RoomChannel < ApplicationCable::Channel
  def subscribed
    if !params[:room_id].blank?
      stream_from "room_channel_#{params[:room_id]}"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
