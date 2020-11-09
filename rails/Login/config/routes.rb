Rails.application.routes.draw do
  resources :messages
  devise_for :users, :controllers => { registrations: 'registrations' }
  resources :rooms

  root to: 'rooms#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
