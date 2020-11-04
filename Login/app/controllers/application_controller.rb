class ApplicationController < ActionController::Base
    
    before_action :authenticate_user! # 나중에 before_action :authenticate_user!, except: [:index, :show]로 다른 컨트롤러에서 바꿔줄 수도...
    protect_from_forgery with: :null_session
    #skip_before_action :verify_authenticity_token
end
