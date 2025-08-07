nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "previewserver";
  src = ./.;

  buildInputs = [ pkgs.nodejs ];

  installPhase = ''
    mkdir -p $out/bin
    echo '#!/usr/bin/env node' > $out/bin/previewserver
    echo 'require("http").createServer((req, res) => res.end("Preview OK")).listen(9101, "127.0.0.1")' >> $out/bin/previewserver
    chmod +x $out/bin/previewserver
  '';
}