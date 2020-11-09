Rails.application.routes.draw do
  resources :messages
  devise_for :users
  resources :users
  root 'welcome#index'
  get '/search' => 'users#search', :as => 'search_user'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
