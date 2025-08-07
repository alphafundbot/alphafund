{ pkgs }: {
  packages = [
    pkgs.nano
    pkgs.nixos-enter
    pkgs.util-linux.bin
  ];
}
