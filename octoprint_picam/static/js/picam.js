$(function() {
    function PiCamViewModel(parameters) {

        var self = this;

        self.loginState = parameters[0];
        var canvas = null;
        self.clickState = 0;
        self.clickStateTimeout = '';


        self.fullscreen = function() {
            if(self.clickState === 0){
              self.clickStateTimeout = setTimeout(function(){self.clickState = 0;},500);
              self.clickState = 1;
            } else {
              clearTimeout(self.clickStateTimeout);
              if(canvas.parentNode.classList.contains('fullscreen')){
                canvas.parentNode.classList.remove('fullscreen');
              } else {
                canvas.parentNode.classList.add('fullscreen');
              }
              self.clickState = 0;
            }
        };

        // This will get called before the HelloWorldViewModel gets bound to the DOM, but after its depedencies have
        // already been initialized. It is especially guaranteed that this method gets called _after_ the settings
        // have been retrieved from the OctoPrint backend and thus the SettingsViewModel been properly populated.
        self.onBeforeBinding = function() {
          canvas = document.getElementById("pi-cam");
          canvas.addEventListener('click', self.fullscreen, false);
          canvas.parentNode.classList.remove('hidden-feed');

          canvas.parentNode.onresize = function(){
            if(canvas.parentNode.classList.contains('fullscreen')){
              if(canvas.parentNode.clientWidth*9 > 16*canvas.parentNode.clientHeight){
                canvas.setAttribute('height','100%');
                canvas.setAttribute('width',null);
              } else {
                canvas.setAttribute('width','100%');
                canvas.setAttribute('height',null);
              }
            }
          };

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
