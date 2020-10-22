require 'test_helper'

class ProductTest < ActiveSupport::TestCase
  test 'destroy user should destroy linked product' do
    assert_difference('Product.count', - 1) do
      users(:one).destroy
    end
  end

  test 'should have a positive price' do
	  product = products(:one)
	  product.price = -1
	  assert_not product.valid?
  end
end
