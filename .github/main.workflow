
workflow "New workflow" {
  resolves = ["Run deploy script"]
  on = "push"
}

action "run build" {
  uses = "kizzlebot/gh-actions/actions/build-cra@master"
}

