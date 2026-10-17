class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    super
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 201, message: "Signed up successfully." },
        data: { id: resource.id, email: resource.email }
      }, status: :created
    else
      render json: {
        status: { code: 422, message: "User could not be created.", errors: resource.errors.full_messages }
      }, status: :unprocessable_entity
    end
  end
end
