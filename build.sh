#!/bin/bash

[ ! "${EUID}" = "0" ] && {
  echo "Execute esse script como root:"
  echo
  echo "  sudo ${0}"
  echo
  exit 1
}

HERE="$(dirname "$(readlink -f "${0}")")"

working_dir=$(mktemp -d)

mkdir -p "${working_dir}/usr/lib/tiger-os/tiger-store/resources/"
mkdir -p "${working_dir}/usr/share/applications/"
mkdir -p "${working_dir}/usr/bin/"
mkdir -p "${working_dir}/DEBIAN/"

cp -v "${HERE}/main.js"      "${working_dir}/usr/lib/tiger-os/tiger-store/resources/"
cp -v "${HERE}/package.json" "${working_dir}/usr/lib/tiger-os/tiger-store/resources/"
cp -v "${HERE}/tiger-store.desktop" "${working_dir}/usr/share/applications/"
cp -v "${HERE}/tiger-store" "${working_dir}/usr/bin/"

chmod +x "${working_dir}/usr/bin/tiger-store"

(
  cd "${working_dir}/usr/lib/tiger-os/tiger-store/"
  wget "https://github.com/electron/electron/releases/download/v21.1.0/electron-v21.1.0-linux-x64.zip"
  unzip "electron-v21.1.0-linux-x64.zip"
  rm "electron-v21.1.0-linux-x64.zip"
)

chmod +x "${working_dir}/usr/lib/tiger-os/jitsi-launcher.sh"

(
 echo "Package: tiger-store"
 echo "Priority: optional"
 echo "Version: $(date +%y.%m.%d%H%M%S)"
 echo "Architecture: all"
 echo "Maintainer: Natanael Barbosa Santos"
 echo "Depends: "
 echo "Description: Cliente da Flathub integrado ao Flatpak"
 echo
) > "${working_dir}/DEBIAN/control"

dpkg -b ${working_dir}
rm -rfv ${working_dir}

mv "${working_dir}.deb" "${HERE}/tiger-store.deb"

chmod 777 "${HERE}/tiger-store.deb"
chmod -x  "${HERE}/tiger-store.deb"
