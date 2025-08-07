{ config, pkgs, ... }:

{
  imports = [];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  networking.hostName = "gemini";
  networking.useDHCP = false;
  networking.interfaces.enp0s3.useDHCP = true;

  time.timeZone = "UTC";

  environment.systemPackages = with pkgs; [
    vim
    git
    curl
    wget
    sudo
  ];

  security.sudo.enable = true;

  users.users.nehemie = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
    shell = pkgs.bash;
  };

  services.openssh.enable = true;

  system.stateVersion = "23.11";
}
