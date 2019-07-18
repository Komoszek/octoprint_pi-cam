$(function() {
    function PiCamViewModel(parameters) {

        var self = this;
        self.loginState = parameters[0];

        self.dragElement = elmnt => {
            elmnt.onmousedown = e => {
                moveFlag = false;

                e = e || window.event;
                e.preventDefault();

                // call a function whenever the cursor moves:
                document.onmousemove = e => {
                    moveFlag = true;
                    e = e || window.event;
                    e.preventDefault();
                    if (!(iframeContainer.classList.contains('minimized-feed'))) {
                        var ContainerWidth = Math.min(window.innerWidth, window.innerHeight * (16 / 9), Math.max((window.innerWidth - e.clientX), (window.innerHeight - e.clientY) * (16 / 9)));
                        iframeContainer.style.width = ContainerWidth + 'px';
                        iframeContainer.style.height = ContainerWidth * (9 / 16) + 'px';
                    }
                }

                document.onmouseup = () => {
                    if (!moveFlag)
                        iframeContainer.classList.toggle('minimized-feed');
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }
        }

        self.adjustFullScreenIframe = () => {
          if (window.innerWidth * 9 > 16 * window.innerHeight) {
              iframe.style.height = '100%';
              iframe.style.width = (16 / 9) + 'vh';
          } else {
              iframe.style.height = (9 / 16) + 'vw';
              iframe.style.width = '100%';
          }
        }

        self.onAfterBinding = function() {
            iframe = document.getElementById('pi-cam');
            iframeContainer = iframe.parentNode;
            iframeClickCatcher = document.getElementById('ClickCatcher');

            iframeClickCatcher.addEventListener('dblclick', () => {
                if (iframeContainer.classList.toggle('fullscreen')) {
                  self.adjustFullScreenIframe();
                } else {
                    iframe.style.width = "";
                    iframe.style.height = "";
                }
            });

            self.dragElement(document.getElementById('pi-cam-button'));

            window.addEventListener('resize', () => {
                if (iframeContainer.classList.contains('fullscreen')) {
                  self.adjustFullScreenIframe();
                } else {
                    if (iframeContainer.clientWidth > window.innerWidth) {
                        iframeContainer.style.width = window.innerWidth + 'px';
                        iframeContainer.style.height = window.innerWidth * (9 / 16) + 'px';
                    } else if (iframeContainer.clientHeight > window.innerHeight) {
                        iframeContainer.style.height = window.innerHeight + 'px';
                        iframeContainer.style.width = window.innerHeight * (16 / 9) + 'px';
                    }
                }
            });

            iframeContainer.classList.remove('hidden-feed');

            self.url = 'http://' + document.location.hostname + ':8080';
            window.open(self.url, 'pi-cam');
        }
    }

    // This is how our plugin registers itself with the application, by adding some configuration information to
    // the global variable ADDITIONAL_VIEWMODELS
    ADDITIONAL_VIEWMODELS.push([
        // This is the constructor to call for instantiating the plugin
        PiCamViewModel,

        // This is a list of dependencies to inject into the plugin, the order which you request here is the order
        // in which the dependencies will be injected into your view model upon instantiation via the parameters
        // argument
        ["loginStateViewModel"],

        // Finally, this is the list of all elements we want this view model to be bound to.
        [document.getElementById("tab_plugin_picam")]
    ]);
});
