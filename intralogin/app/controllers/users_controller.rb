class UsersController < ApplicationController
  def index
    @users = User.all
    respond_to do |format|
      format.html { render :index }
      format.json { render :json => @users}
    end
  end

  def show
    @users = User.all
    @user = User.find(params[:id])
    respond_to do |format|
      format.html { render :show }
      format.json { render :json => @user}
    end
  end

  # PATCH | PUT /users/1
  # PATCH | PUT /users/1.json
  def update
    if params[:id].to_i != current_user[:id]
      render plain: "forbidden", status: :forbidden
      return
    end

    if params[:nickname].length > 20
      render plain: "The length of the nickname must be shorter than 20", status: :forbidden
      return
    end
    @user = User.find(params[:id])
    @user.nickname = params[:nickname]
    @user.save!
  end

  def search
    if params[:search].blank?
       redirect_to users_path and return
    else
        @parameter = params[:search].downcase
        @results = User.all.where("lower(name) LIKE :search", search: @parameter)
    end
    respond_to do |format|
      format.html { render :index }
      format.json { render :json => @results}
    end
  end
end
