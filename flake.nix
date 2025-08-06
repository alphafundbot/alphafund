nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
  };

  outputs = { self, nixpkgs }: {
    overlays = [
      (self: super: {
        previewserver = super.previewserver.override {
          port = 9101;
          host = "127.0.0.1";
        };
      })
    ];

    devShells.default = nixpkgs.lib.mkShell {
      overlays = self.overlays;
      packages = [ previewserver ];
    };
  };
}