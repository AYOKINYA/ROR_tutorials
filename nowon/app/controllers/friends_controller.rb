class FriendsController < ApplicationController
  def index
    @list = User.find_by(id: current_user[:id])[:friend_list]
    res = []
    @list.each do |id|
      friend = User.find_by(id: id)
      res.push(friend)
    end
    render json: res
  end

  def show
    friend = User.find(id: params[:id])
    render json: friend
  end

  def update
      @list = User.find_by(id: current_user[:id])[:friend_list]
      if params[:id] == current_user[:id] || @list.include?(params[:id])
        return
      end

      if User.find_by(id: params[:id]).blank?
        return
      end

      myself = User.find_by(id: current_user[:id])
      myself.friend_list.push(params[:id]);
      myself.save()
  end

  def destroy
      myself = User.find_by(id: current_user[:id])
      myself.friend_list.delete(params[:id]);
      myself.save()
  end

end
