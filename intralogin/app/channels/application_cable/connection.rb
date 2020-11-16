module ApplicationCable
  class Connection < ActionCable::Connection::Base
    # channel에서 current_user 쓸 수 있게 정의한다.
    identified_by :current_user
 
    def connect
      self.current_user = find_verified_user
    end
 
    private
    def find_verified_user 
      # this checks whether a user is authenticated with devise
      if verified_user = env['warden'].user
        verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end