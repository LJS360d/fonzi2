{ pkgs, lib, ... }: {
  deps = [
    (pkgs.nodejs-18_x.override { npm = pkgs.nodePackages.npm_9; })
  ];
}
