$(function() {
    function PiCamViewModel(parameters) {

        var self = this;

        self.loginState = parameters[0];
        var canvas = null;
        self.clickState = 0;
        self.clickStateTimeout = '';


        self.fullscreen = function() {
          /*  if(self.clickState === 0){
              self.clickStateTimeout = setTimeout(function(){self.clickState = 0;},500);
              self.clickState = 1;
            } else {
              clearTimeout(self.clickStateTimeout);*/
              if(canvas.parentNode.classList.contains('fullscreen')){
                canvas.parentNode.classList.remove('fullscreen');
              } else {
                canvas.parentNode.classList.add('fullscreen');
              }
              /*self.clickState = 0;
            }*/
        };

        self.toggleCamera = function() {

        }

        function dragElement(elmnt) {
          var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

          elmnt.onmousedown = dragMouseDown;
          var moveFlag = false;



          function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
            moveFlag = true;
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:

            console.log(pos1, pos2, pos3, pos4);

            elmnt.parentNode.style.width = max((elmnt.parentNode.clientWidth + pos3),((elmnt.parentNode.clientHeight + pos4)*(16/9)));
            elmnt.parentNode.style.height = elmnt.parentNode.style.width* (9/16);

          }

          function closeDragElement() {
            // stop moving when mouse button is released:

            if(moveFlag === false){
              if(elmnt.parentNode.classList.contains('minimized'))
                elmnt.parentNode.classList.remove('minimized');
              else
                elmnt.parentNode.classList.add('minimized');
            }

            document.onmouseup = null;
            document.onmousemove = null;
          }
        }

        // This will get called before the HelloWorldViewModel gets bound to the DOM, but after its depedencies have
        // already been initialized. It is especially guaranteed that this method gets called _after_ the settings
        // have been retrieved from the OctoPrint backend and thus the SettingsViewModel been properly populated.
        self.onBeforeBinding = function() {
          canvas = document.getElementById("pi-cam");
          canvas.addEventListener('dblclick', self.fullscreen, false);
          //document.getElementById('pi-cam-button').addEventListener('click', self.toggleCamera, false);

          dragElement(document.getElementById('pi-cam-button'));

          canvas.parentNode.classList.remove('hidden-feed');

          window.addEventListener('resize',function(){
            if(canvas.parentNode.classList.contains('fullscreen')){
              if(canvas.parentNode.clientWidth*9 > 16*canvas.parentNode.clientHeight){
                canvas.style.height = '100%';
                canvas.style.width = 'auto';
              } else {
                canvas.style.height = 'auto';
                canvas.style.width = '100%';
              }
            }
          });

          var wsavc = new WSAvcPlayer(canvas, "webgl");

          var protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
          wsavc.connect(protocol + '//' + document.location.hostname  + ':8080/video-stream');
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
        [document.getElementById("tab_plugin_helloworld")]
    ]);
});
