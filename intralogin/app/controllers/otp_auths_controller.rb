class OtpAuthsController < ApplicationController

    def create
        # @user = current_user
        # otp_code = params["user"]["otp_attempt"]
        puts params
        otp_code = params["otp_attempt"]
        puts otp_code
        ret = (current_user.validate_and_consume_otp!(otp_code) || validate_backup_code(otp_code))
        user_session["otp_done"] = ret
        redirect_to root_path 
    end

    private
    
    def validate_backup_code(code)
        if current_user.otp_backup_codes.include?(code)
            current_user.otp_backup_codes.delete(code)
            current_user.update(otp_backup_codes: current_user.otp_backup_codes)
            return true
        end
            return false
    end
end
