$(function() {
    function PiCamViewModel(parameters) {
        var self = this;

        // This will get called before the HelloWorldViewModel gets bound to the DOM, but after its depedencies have
        // already been initialized. It is especially guaranteed that this method gets called _after_ the settings
        // have been retrieved from the OctoPrint backend and thus the SettingsViewModel been properly populated.
        self.onBeforeBinding = function() {
          console.log(self);
          /*
          var canvas = document.getElementById("pi-cam");

          var wsavc = new WSAvcPlayer(canvas, "webgl");

          var protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
          wsavc.connect(protocol + '//' + window.location.host + '/video-stream');*/
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
