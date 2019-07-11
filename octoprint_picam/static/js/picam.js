$(function() {
    function PiCamViewModel(parameters) {

        var self = this;
        self.loginState = parameters[0];
        var canvas = null;
        var canvasContainer = null;
        self.clickState = 0;
        self.clickStateTimeout = '';

        self.fullscreen = function() {
              if(canvasContainer.classList.contains('fullscreen')){
                canvasContainer.classList.remove('fullscreen');
              } else {
                canvasContainer.classList.add('fullscreen');

                if(canvasContainer.clientWidth*9 > 16*canvasContainer.clientHeight){
                  canvas.style.height = '100%';
                  canvas.style.width = 'auto';
                } else {
                  canvas.style.height = 'auto';
                  canvas.style.width = '100%';
                }
              }
        };



        function dragElement(elmnt) {
          elmnt.onmousedown = dragMouseDown;
          var moveFlag = false;

          function dragMouseDown(e) {
            moveFlag = false;

            e = e || window.event;
            e.preventDefault();

            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
            moveFlag = true;
            e = e || window.event;
            e.preventDefault();
            if(!(canvasContainer.classList.contains('minimized'))){
              canvasContainer.style.width = Math.min(window.innerWidth,window.innerHeight*(16/9),Math.max((parseInt(window.innerWidth) - parseInt(e.clientX)),(parseInt(window.innerHeight) - parseInt(e.clientY)*(16/9)))) + 'px';
              canvasContainer.style.height = parseInt(canvasContainer.style.width* (9/16)) + 'px';
            }
          }

          function closeDragElement() {

            if(moveFlag === false){
              if(canvasContainer.classList.contains('minimized')){
                canvasContainer.classList.remove('minimized');
                this.wsavc.connect(this.url);
                this.wsavc.autorestart = true;
              }
              else
                canvasContainer.classList.add('minimized');
                this.wsavc.close();
                this.wsavc.autorestart = false;
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

          canvasContainer = canvas.parentNode.parentNode;

          canvasContainer.addEventListener('dblclick', self.fullscreen, false);
          //document.getElementById('pi-cam-button').addEventListener('click', self.toggleCamera, false);

          dragElement(document.getElementById('pi-cam-button'));


          window.addEventListener('resize',function(){
            if(canvasContainer.classList.contains('fullscreen')){
              if(canvasContainer.clientWidth*9 > 16*canvasContainer.clientHeight){
                canvas.style.height = '100%';
                canvas.style.width = 'auto';
              } else {
                canvas.style.height = 'auto';
                canvas.style.width = '100%';
              }
            } else {
                if(canvasContainer.clientWidth > window.innerWidth){
                  canvasContainer.style.width = window.innerWidth + 'px';
                  canvasContainer.style.height = window.innerWidth*(9/16) + 'px';
                } else if(client.parentNode.clientHeight > window.innerHeight) {
                  canvasContainer.style.height = window.innerHeight + 'px';
                  canvasContainer.style.width = window.innerHeight*(16/9) + 'px';

                }
            }
          });

          canvasContainer.classList.remove('hidden-feed');

              this.wsavc = new WSAvcPlayer(canvas, "webgl",1,35);
              window.wsavc = this.wsavc;
              this.wsavc.autorestart = true;
              console.log(this.wsavc.canvas);
              protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
              this.url = protocol + '//' + document.location.hostname  + ':8080';
              setTimeout(function(){this.wsavc.connect(this.url)},500);

                    function FirstChangeWatcher(){
                      if(canvas.style.height !== '56.6667vh')
                setTimeout(function(){FirstChangeWatcher()},10);
                else{
                  canvas.style.width = 960 + 'px';
                  canvas.style.height = 540 + 'px';
                  canvas.width = 960;
                  canvas.height = 540;
                  canvas.parentNode.style.display = null;

       }
      }
FirstChangeWatcher();
this.wsavc.on('disconnected',()=>{
  console.log('WS Disconnected');
  canvas.parentNode.style.display = "none";
  FirstChangeWatcher();
this.wsavc.connect(this.url);
})
this.wsavc.on('connected',()=>console.log('WS connected'))

this.wsavc.on('initalized',(payload)=>{
console.log('Initialized', payload)

})
this.wsavc.on('stream_active',active=>console.log('Stream is ',active?'active':'offline'))
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
