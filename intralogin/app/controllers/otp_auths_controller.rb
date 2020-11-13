class OtpAuthsController < ApplicationController

    def create
        @user = current_user
        otp_code = params["user"]["otp_attempt"]
        ret = (current_user.validate_and_consume_otp!(otp_code) || current_user.invalidate_otp_backup_code!(params[:otp_attempt]))
        user_session["otp_done"] = ret
        redirect_to root_path
    end

    def update
        if (params[:id] == current_user[:id])
            if (params[:otp_required_for_login] == "true")
                puts "hi"
            else
                puts "hey"
            end
        end
    end
end
