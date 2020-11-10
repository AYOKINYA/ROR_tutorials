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

  def search
    if params[:search].blank?
       redirect_to users_path and return
    else
        @parameter = params[:search].downcase
        @results = User.all.where("lower(username) LIKE :search", search: @parameter)
    end
    respond_to do |format|
      format.html { render :index }
      format.json { render :json => @results}
    end
  end

end
