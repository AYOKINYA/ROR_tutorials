class TwoFactorSettingsController < ApplicationController
    def show

        user = User.find_by(id: current_user[:id]).as_json(only: [:id, :otp_backup_codes, :otp_required_for_login])
        
        if user.blank?
          render plain: "forbidden", status: :forbidden
        end

        data = {
          :id => current_user[:id],
          :otp_backup_codes => current_user[:otp_backup_codes],
          :otp_required_for_login => current_user[:otp_required_for_login],
        }

        if user["otp_required_for_login"]
          data[:otp_qr_code] = qr_code_as_svg(current_user.two_factor_qr_code_uri)
        else
          data[:otp_qr_code] = nil
        end
        

        return render json: data
    end  
     # GET /two_factor_settings/new/
    def new
      if current_user.otp_required_for_login
        flash[:alert] = 'Two Factor Authentication is already enabled.'
      end
      current_user.generate_two_factor_secret_if_missing!
    end
  
    # POST /two_factor_settings
    def create
      if current_user.validate_and_consume_otp!(enable_2fa_params[:code])
        current_user.enable_two_factor!
        flash[:notice] = 'Successfully enabled two factor authentication, please make note of your backup codes.'
      else
        flash.now[:alert] = 'Incorrect Code'
        render :new
      end
    end

    # PUT /two_factor_settings/
    def update
        if current_user[:otp_required_for_login] == true
          disable_two_factor
        else
          if current_user[:otp_backup_codes].nil?
            create_two_factor
          else
            enable_two_factor
          end
        end
    end
  
    def edit
      unless current_user.otp_required_for_login
        flash[:alert] = 'Please enable two factor authentication first.'
        return redirect_to new_two_factor_settings_path
      end
  
      if current_user.two_factor_backup_codes_generated?
        flash[:alert] = 'You have already seen your backup codes.'
        return redirect_to edit_user_registration_path
      end
  
      @backup_codes = current_user.generate_otp_backup_codes!
      current_user.save!
      
    end
  
    def destroy
      if disable_two_factor #current_user.disable_two_factor!
        flash[:notice] = 'Successfully disabled two factor authentication.'
        redirect_to edit_user_registration_path
      else
        flash[:alert] = 'Could not disable two factor authentication.'
        redirect_back fallback_location: root_path
      end
    end
  
    private
  
    def enable_2fa_params
      params.require(:two_fa).permit(:code, :password)
    end

    def create_two_factor
      current_user.update(
      otp_secret: User.generate_otp_secret,
      otp_required_for_login: true,
      otp_backup_codes: current_user.generate_otp_backup_codes!
      )

    end

    def enable_two_factor
      current_user.update(
      otp_required_for_login: true,
      )
    end

    def disable_two_factor
      current_user.update(otp_required_for_login: false)
    end

    def qr_code_as_svg(uri)
      RQRCode::QRCode.new(uri).as_svg(
          offset: 0,
          color: '000',
          shape_rendering: 'crispEdges',
          module_size: 4,
          standalone: true
      ).html_safe
    end

    

  end