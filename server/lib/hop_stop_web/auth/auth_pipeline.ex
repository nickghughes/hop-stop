# Credit guide at https://www.mitchellhanberg.com/post/2017/11/28/implementing-api-authentication-with-guardian/
defmodule HopStopWeb.Guardian.AuthPipeline do
  use Guardian.Plug.Pipeline, otp_app: :hop_stop,
                              module: HopStopWeb.Guardian,
                              error_handler: HopStopWeb.Guardian.AuthErrorHandler

  plug Guardian.Plug.VerifyHeader
  plug Guardian.Plug.EnsureAuthenticated
end