(defsystem poncelet-js
  :depends-on (ol-utils web-utils hunchentoot)
  :serial t
  :components ((:file "server")))
