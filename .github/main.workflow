workflow "New workflow" {
  resolves = ["debug", "run build"]
  on = "push"
}

action "run build" {
  uses = "kizzlebot/gh-actions/actions/build-cra@master"
  secrets = [
    "PUBLIC_KEY",
    "HOST",
    "USER",
    "DEST",
    "PRIVATE_KEY",
  ]
}


action "debug" {
  uses = "actions/bin/debug"
}
