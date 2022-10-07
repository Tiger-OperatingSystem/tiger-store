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

cp -rv "${HERE}/"*      "${working_dir}/usr/lib/tiger-os/tiger-store/resources/"

(
  cd "${working_dir}/usr/lib/tiger-os/tiger-store/"
  wget "https://github.com/electron/electron/releases/download/v21.1.0/electron-v21.1.0-linux-x64.zip"
  unzip "electron-v21.1.0-linux-x64.zip"
  rm "electron-v21.1.0-linux-x64.zip"
)

rm "${working_dir}/usr/lib/tiger-os/tiger-store/resources/build.sh"
rm "${working_dir}/usr/lib/tiger-os/tiger-store/resources/README.md"
rm "${working_dir}/usr/lib/tiger-os/tiger-store/resources/LICENSE"
rm -rf "${working_dir}/usr/lib/tiger-os/tiger-store/resources/.github/workflows"

mv "${working_dir}/usr/lib/tiger-os/tiger-store/resources/tiger-store" "${working_dir}/usr/bin/tiger-store"
mv "${working_dir}/usr/lib/tiger-os/tiger-store/resources"/*.desktop "${working_dir}/usr/share/applications/"
chmod +x "${working_dir}/usr/bin/tiger-store"
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
