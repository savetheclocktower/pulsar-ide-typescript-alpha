# 0.1.2 — 2024-06-22

* Updated to latest `@savetheclocktower/atom-languageclient` in order to add these features:
  * Usage of `busy-signal` to report server-initiated async task progress
  * Better reporting of client capabilities, plus better interpretation of server capabilities
* Advertised this package as a consumer of `atom-ide-busy-signal` so that both `@savetheclocktower/atom-languageclient` and the underlying language server use it to report async task progress
