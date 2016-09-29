(defpackage :poncelet-server-config
  (:use :cl :ol :web-utils)
  (:export))

(in-package :poncelet-server-config)

;; serve the html and scripts of the site
(defpar base-url "/math/poncelet/")
(defpar base-path #P"~/Projekte/poncelet-js/")

(defun file-url (f)
  (mkstr base-url f))

(defun file-path (f)
  (merge-pathnames f base-path))

(setup-static-content (file-url "") (file-path "poncelet.html"))

(dolist (script '("messages-helper.js"
                  "plane-geometry.js"
                  "raphael-helper.js"
                  "poncelet-interface.js"))
  (setup-static-content (file-url script) (file-path script)))

;; get web libraries
(dolist (lib '(:jquery
               :bootstrap
               :numeric
               :raphaeljs))
  (load-web-library lib))


;; finally, tell the server about the nice app
(register-web-application "The Game of Poncelet" base-url)
