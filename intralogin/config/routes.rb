Rails.application.routes.draw do
  get 'user_status/show'
  get 'user_status/update'
  resources :messages
  resources :rooms
  resources :friends
  get '/search' => 'users#search', :as => 'search_user'
  get 'users/index'
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks", sessions: "sessions" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end
  resources :users
  resource :two_factor_settings, except: [:index, :show]
  resource :otp_auth, except: [:index, :show]
  root 'users#index'

  resources :user_status, only: [:index, :show, :update]

end
