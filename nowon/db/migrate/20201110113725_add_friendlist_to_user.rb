class AddFriendlistToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :friend_list, :string, array: true, default: []
  end
end
