# Uses Guardian to sign and authenticate JWTs
# Uses Guardian's docs as a guide https://github.com/ueberauth/guardian
defmodule HopStopWeb.Guardian do
  use Guardian, otp_app: :hop_stop
  
  def subject_for_token(user, _claims) do
    sub = to_string(user.id)
    {:ok, sub}
  end

  def resource_from_claims(claims) do
    id = claims["sub"]
    user = HopStop.Users.get_user!(id)
    {:ok, user}
  end
end