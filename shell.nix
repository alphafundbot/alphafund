{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.ts-node
    pkgs.curl
    pkgs.procps  # for fuser
    pkgs.concurrently
  ];

  shellHook = ''
    echo "🚀 Entering dev shell..."
    ./dev-launch.sh "$@"
  '';
}