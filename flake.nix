{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
  };

  outputs = { self, nixpkgs }: {
    overlays = [
      (self: super: {
        previewserver = super.callPackage ./previewserver.nix {};
      })
    ];

    devShells.default = nixpkgs.lib.mkShell {
      overlays = self.overlays;
      packages = [ previewserver ];
    };
  };
}