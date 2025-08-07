nix
{ config, pkgs, ... }:

{
  services.supervisord = {
    enable = true;

    programs.previewserver = {
      command = "${pkgs.nodejs}/bin/node /dev/null";
      autostart = false;
      autorestart = false;
      priority = 999;
    };
  };
}