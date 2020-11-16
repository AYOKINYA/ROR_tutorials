require 'test_helper'

class UserStatusControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get user_status_show_url
    assert_response :success
  end

  test "should get update" do
    get user_status_update_url
    assert_response :success
  end

end
