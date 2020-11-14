class OtpAuthsController < ApplicationController

    def create
        @user = current_user
        otp_code = params["user"]["otp_attempt"]
        ret = (current_user.validate_and_consume_otp!(otp_code) || current_user.invalidate_otp_backup_code!(otp_code))
        user_session["otp_done"] = ret
        redirect_to root_path
    end
end
