# MeshCentral

## About
This is forked from [Ylianst/MeshCentral](https://github.com/Ylianst/MeshCentral).

MeshCentral is a full computer management web site. With MeshCentral, you can run your own web server to remotely manage and control computers on a local network or anywhere on the internet. Once you get the server started, create device group and download and install an agent on each computer you want to manage. A minute later, the new computer will show up on the web site and you can take control of it. MeshCentral includes full web-based remote desktop, terminal and file management capability.

For more information, [visit MeshCentral.com](https://meshcentral.com).

## Clone
```bash
curl -Lsm5  https://raw.githubusercontent.com/bitctrl/MeshCentral/refs/heads/contrib/abstract/clone-3-npm.sh | bash -s \
  meshcentral \
  master \
  https://github.com/Ylianst/MeshCentral.git \
  https://github.com/bitctrl/MeshCentral.git \
  https://git.source.bitctrl.de/bcs-mesh/MeshCentral.git
```

## Remotes and branches
- `__vendor` (the underscores are there to avoid ambiguities and for sorting)
  - `master`
- `_contrib`
  - `contrib/abstract`
  - `master`
- `origin`
  - `agnostic`
  - `contrib/abstract`
  - `vendor/master`
