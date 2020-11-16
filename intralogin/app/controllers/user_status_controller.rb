class UserStatusController < ApplicationController
  def index
    @users = User.all
  end
  # GET /user_status/id
  def show
    @user = User.find_by(id: params[:id])
    render json: {id: @user.id, status: @user.status}
  end
  # PUT | PATCH /user_status/id
  def update
  end
end
