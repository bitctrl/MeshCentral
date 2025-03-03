#!/bin/bash
#######################################################################
#
# Copyright (C) 2025 BitCtrl Systems GmbH
#
# clone-23-npm.sh
#
# Install package from npm, clone the vendor and contrib repos
# and optionally an on-premise repo.
#
# @author  Daniel Hammerschmidt <daniel.hammerschmidt@bitctrl.de>
# @author  Daniel Hammerschmidt <daniel@redneck-engineering.com>
# @version 20251011
#
#######################################################################

set -eou pipefail

INTERIM_BRANCH='NULL/EF3D90BF_8559_458F_9410_EC1F7D11601A'
CURL_MAX_TIME=5

function yesno() {
  local answer prompt='yn' default=${2:-}
  prompt="${prompt/"${default,,}"/${default^^}}"
  prompt="${1} [${prompt}] "
  while :; do
    read -rp "${prompt}" answer
    answer="${answer,,}"
    case "${answer:="${default,,}"}" in y|yes|n|no) answer=${answer:0:1}; break;; esac
  done
  echo "${answer}"
}

function do_as_owner() {
  "${@}"
}

function main() {
  trap 'echo "Usage: ${0} <npm_package> <main_branch> <vendor_url> <contrib_url> [<detached_url>]"' EXIT
  npm_package="${1}"
  main_branch="${2}"
  vendor_url="${3}"
  contrib_url="${4}"
  detached_url="${5:-}"

  trap '{ code=${?}; (( code )) && echo "SOMETHING WENT WRONG! CODE: $(( code ))" >&3; } 3>&2 2>&-' EXIT

  [[ -t 0 ]] || exec < /dev/tty

  # try to contact the repos
  set -x
  [[ ! -d "node_modules/${npm_package}/.git" ]]
  { [[ "${vendor_url}" == https://* || "${vendor_url}" == http://* ]]; } 2>&- && curl --max-time "${CURL_MAX_TIME}" --silent --head "${vendor_url}" > /dev/null
  { [[ "${contrib_url}" == https://* || "${contrib_url}" == http://* ]]; } 2>&- && curl --max-time "${CURL_MAX_TIME}" --silent --head "${contrib_url}" > /dev/null
  { set +x; } 2>&-
  if [[ -n "${detached_url}" ]]; then
    set -x
    { [[ "${detached_url}" == https://* || "${detached_url}" == http://* ]]; } 2>&- && curl --max-time "${CURL_MAX_TIME}" --silent --head "${detached_url}" > /dev/null
    { set +x; } 2>&-
  fi

  shared='false'
  if [[ ! -O . ]]; then
    read -r _ _ owner group _ < <( ls -ld . )
    if [[ "$( yesno "This directory is owned by '${owner}:${group}'. Do you want to create a shared repository?" )" == 'y' ]]; then
      shared="group"
      function do_as_owner() {
        sudo -Hu "${owner}" -- "${@}"
      }
      do_as_owner mkdir -pm 02775 node_modules
    fi
  fi

  # ask some questions
  use_http_path="$( yesno 'Set credential.useHttpPath?' y )"
  if [[ -n "${detached_url}" ]]; then
    read -rep "Token name: " tokenname
    if [[ -n "${tokenname}" ]]; then
      read -srp "Token value: " tokenvalue
      printf '\r'
    fi
    detached_last="$( yesno 'Fetch contrib and vendor before detached?' y )"
  fi

  set -x

  # install package and dependencies, delete package itself
  [ ! -f "node_modules/${npm_package}/package.json" ] && do_as_owner npm install "${npm_package}"
  mv "node_modules/${npm_package}" "node_modules/_${npm_package}.npm"

  do_as_owner mkdir -pm 02775 _abstract
  cd _abstract

  # initialize repo in package dir
  do_as_owner git init -b "${INTERIM_BRANCH}" --shared="${shared}"
  git status > /dev/null || git config --global --add safe.directory "${PWD}"
  [[ "${use_http_path}" == "y" ]] && git config credential.useHttpPath true

  # add detached, store token
  if [[ -n "${detached_url}" ]]; then
    git remote add detached "${detached_url}"
    if [[ -n "${tokenname}" ]]; then
      git config "credential.helper" 'store --file ~/.git-credentials'
      { [[ -n "${tokenvalue}" ]] && echo "${detached_url/'://'/"://${tokenname}:${tokenvalue}@"}" >> ~/.git-credentials; } 2>&-
    fi
    [[ "${detached_last}" != "y" ]] && git fetch detached
  fi

  # add contrib and vendor (_vendor)
  git remote add _contrib "${contrib_url}"
  git fetch _contrib
  git remote add --tags -t "${main_branch}" __vendor "${vendor_url}"
  git fetch __vendor

  if [[ -n "${detached_url}" ]]; then
    [[ "${detached_last}" == "y" ]] && git fetch detached
  fi

  git reset _contrib/contrib/abstract
  do_as_owner git restore '*'
  git checkout -b contrib/abstract --track _contrib/contrib/abstract
  git branch -d "${INTERIM_BRANCH}"

  # checkout vendors main branch
  do_as_owner git worktree add -b vendor/"${main_branch}" ../node_modules/"${npm_package}" _contrib/vendor/"${main_branch}"

  cd ../node_modules/"${npm_package}"

  # show info, bye bye
  git --no-pager branch -r
  git worktree list
  { set +x; } 2>&-
  trap - EXIT
  echo "Have fun! [If you can't fix it, you don't own it.](https://www.ifixit.com/Manifesto)"
}

main "${@}"; exit
