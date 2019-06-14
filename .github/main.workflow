workflow "New workflow" {
  resolves = ["debug"]
  on = "push"
}




action "debug" {
  uses = "actions/bin/debug"
}
