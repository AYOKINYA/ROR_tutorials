class CreateRooms < ActiveRecord::Migration[6.0]
  def change
    create_table :rooms do |t|
      t.string :name, uniqueness: true
      t.string :type
      t.string :password
      t.string :owner
      t.string :admin_list, default: [], array: true
      t.string :member_list, default: [], array: true

      t.timestamps
    end
  end
end
