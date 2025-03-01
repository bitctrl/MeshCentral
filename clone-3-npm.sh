#!/bin/bash
#######################################################################
#
# Copyright (C) 2025 BitCtrl Systems GmbH
#
# clone-3-npm.sh
#
# Install package from npm, clone the vendor and contrib repos
# and optionally an on-premise repo.
#
# @author  Daniel Hammerschmidt <daniel.hammerschmidt@bitctrl.de>
# @author  Daniel Hammerschmidt <daniel@redneck-engineering.com>
# @version 20250971
#
#######################################################################

set -eou pipefail

INTERIM_BRANCH='NULL/EF3D90BF_8559_458F_9410_EC1F7D11601A'
CURL_MAX_TIME=5

function main() {
  trap 'echo "Usage: ${0} <npm_package> <main_branch> <vendor_url> <contrib_url> [<origin_url>]"' EXIT
  npm_package="${1}"
  main_branch="${2}"
  vendor_url="${3}"
  contrib_url="${4}"
  origin_url="${5:-}"

  trap '{ code=${?}; (( code )) && echo "SOMETHING WENT WRONG! CODE: ${code}" >&3; } 3>&2 2>&-' EXIT

  unset committer_name
  unset committer_email

  [[ -t 0 ]] || exec < /dev/tty

  # try to contact the repos
  set -x
  [[ ! -d "node_modules/${npm_package}/.git" ]]
  curl --max-time "${CURL_MAX_TIME}" --silent --head "${vendor_url}" > /dev/null
  curl --max-time "${CURL_MAX_TIME}" --silent --head "${contrib_url}" > /dev/null
  { set +x; } 2>&-
  if [[ -n "${origin_url}" ]]; then
    set -x
    curl --max-time "${CURL_MAX_TIME}" --silent --head "${origin_url}" > /dev/null
    { set +x; } 2>&-
  fi

  # ask some questions
  read -rp "Committer name: " committer_name
  if [[ -n "${committer_name}" ]]; then
    read -rp "Committer email: " committer_email
  fi
  while :; do
    read -rp "Set credential.useHttpPath? [Yn] " use_http_path
    use_http_path="${use_http_path,,}"
    case "${use_http_path:=y}" in y|yes|n|no) use_http_path=${use_http_path:0:1}; break;; esac
  done
  if [[ -n "${origin_url}" ]]; then
    read -rp "Token name: " tokenname
    if [[ -n "${tokenname}" ]]; then
      read -srp "Token value: " tokenvalue
    fi
    while :; do
      read -rp "Fetch contrib and vendor before origin? [Yn] " origin_last
      origin_last="${origin_last,,}"
      case "${origin_last:=y}" in y|yes|n|no) origin_last=${origin_last:0:1}; break;; esac
    done
  fi

  set -x

  # install package from NPM
  npm install "${npm_package}"
  cd "node_modules/${npm_package}"

  # initialize repo in package dir
  git init -b "${INTERIM_BRANCH}"
  [[ -n "${committer_name:-}" ]] && git config user.name "${committer_name}"
  [[ -n "${committer_email:-}" ]] && git config user.email "${committer_email}"
  [[ "${use_http_path}" == "y" ]] && git config credential.useHttpPath true

  # add origin, store token
  if [[ -n "${origin_url}" ]]; then
    git remote add origin "${origin_url}"
    if [[ -n "${tokenname}" ]]; then
      git config "credential.helper" 'store --file .git/credentials'
      { echo "${origin_url/'://'/"://${tokenname}:${tokenvalue}@"}" > .git/credentials; } 2>&-
    fi
    [[ "${origin_last}" != "y" ]] && git fetch origin
  fi

  # add contrib and vendor (_vendor)
  git remote add contrib "${contrib_url}"
  git fetch contrib
  git remote add --tags -t "${main_branch}" -m "${main_branch}" _vendor "${vendor_url}"
  git fetch _vendor

  if [[ -n "${origin_url}" ]]; then
    [[ "${origin_last}" == "y" ]] && git fetch origin
  fi

  # checkout vendors main branch
  git reset contrib/"${main_branch}"
  git restore '*'
  git checkout -b vendor/"${main_branch}" --track contrib/"${main_branch}"

  # cleanup, info, bye bye
  git branch -d "${INTERIM_BRANCH}"
  git branch -a
  { set +x; } 2>&-
  trap - EXIT
  echo "Have fun! [If you can't fix it, you don't own it.](https://www.ifixit.com/Manifesto)"
}

main "${@}"; exit
