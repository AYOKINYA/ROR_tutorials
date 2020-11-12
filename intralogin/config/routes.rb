Rails.application.routes.draw do
  get 'users/index'
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end

  root 'users#index'
end
