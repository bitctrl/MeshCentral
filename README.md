# MeshCentral

## About
[This repository](https://github.com/bitctrl/MeshCentral) is a fork of [Ylianst/MeshCentral](https://github.com/Ylianst/MeshCentral). ([compare](https://github.com/Ylianst/MeshCentral/compare/master...bitctrl:MeshCentral:vendor/master), [vendor/master](https://github.com/bitctrl/MeshCentral/tree/vendor/master))

> MeshCentral is a full computer management web site. With MeshCentral, you can run your own web server to remotely manage and control computers on a local network or anywhere on the internet. Once you get the server started, create device group and download and install an agent on each computer you want to manage. A minute later, the new computer will show up on the web site and you can take control of it. MeshCentral includes full web-based remote desktop, terminal and file management capability.
>
> For more information, [visit MeshCentral.com](https://meshcentral.com).

## Clone
```bash
curl -Lsm5 https://github.com/bitctrl/MeshCentral/raw/refs/heads/contrib/abstract/clone-23-npm.sh \
  | bash -s meshcentral master \
  https://github.com/Ylianst/MeshCentral.git \
  https://github.com/bitctrl/MeshCentral.git \
  https://git.source.bitctrl.de/bcs-mesh/MeshCentral.git
```

## Git remotes and branches
(the underscores are there to avoid ambiguities and for sorting)
- **`__vendor`**: `https://github.com/Ylianst/MeshCentral.git`
  - `master`
- **`_contrib`**: `https://github.com/bitctrl/MeshCentral.git`
  - `contrib/abstract`
  - `vendor/master`
  - `feature/*`, `fix/*`
- **`detached`**: `https://git.source.bitctrl.de/bcs-mesh/MeshCentral.git`
  - `contrib/abstract`
  - `vendor/master`
  - `feature/*`, `fix/*`, `draft/*`, `test/*`
