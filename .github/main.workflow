
workflow "New workflow" {
  resolves = ["run build"]
  on = "push"
}

action "run build" {
  uses = "kizzlebot/gh-actions/actions/build-cra@master"
  secrets = [
    "PRIVATE_KEY",
    "PUBLIC_KEY",
    "HOST",
    "USER",
    "DEST"
  ]
}

