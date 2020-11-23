class MessagesController < ApplicationController
  before_action :set_message, only: [:show, :edit, :update, :destroy]

  # GET rooms/:room_id/messages
  # GET rooms/:room_id/messages.json
  def index
    @messages = Message.all
    respond_to do |format|
      format.html { render :index }
      format.json { render :json => @messages}
    end
  end

  # GET rooms/:room_id/messages/1
  # GET rooms/:room_id/messages/1.json
  def show
    render json: @message
  end

  # GET rooms/:room_id/messages/new
  def new
    @message = Message.new
  end

  # GET rooms/:room_id/messages/1/edit
  def edit
  end

  # POST rooms/:room_id/messages
  # POST rooms/:room_id/messages.json
  def create
    @message = Message.new(message_params)
    @message.user = current_user
    @message.room_id = params[:room_id]
    @messages = Message.all
    ActionCable.server.broadcast "room_channel_#{@message.room_id}", message: @message

      if @message.save
        render json: @message
      else
        render plain: "Failed to create a message", status: :unprocessable_entity
      end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @message = Message.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def message_params
      params.require(:message).permit(:content, :user_id)
    end
end
