Rails.application.routes.draw do
  # tell Devise to use our registrations controller
  devise_for :users, :controllers => { registrations: 'registrations' }
  resources :tweeets
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "tweeets#index"
end
