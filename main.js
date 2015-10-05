
//////////////////////////////GLOBALS////////////////////////////////
var myAppSettingsObj;
var noteIdCounter;
 
///////////////////////BOILERPLATE FUNCTIONS////////////////////////

//DESCRIPTION : initialize is the first function called when the dom is ready
function initialize(){
   bondage();
   
   //get app settings from localstorage
   getAppSettings();
   
}  




//DESCRIPTION : bondage is a storage area for all DOM elements that need to be bound or re-bound.  It should be called during initialization or whenever new elements are injected into the DOM and need to be bound.
function bondage(){
   
      
   //CLICK LISTENERS
   
   //CHANGE LISTENERS

}




/////////////////////////////FUNCTIONS//////////////////////////////

//DESCRIPTION : Gets app settings from localstorage.  If no app settings have been saved in localstorage then it initializes all app settings.
function getAppSettings(){
   
   //intialize app settings
   if(localStorage.getItem("stickyNotesAppSettings") === null){
      myAppSettingsObj = new appSettingsObj();
      myAppSettingsObj.noteIdCounter = 0;
   }
   
   //retrieve app settings from memory
   else{
      myAppSettingsObj = retrieveAppSettings(localStorage.getItem("stickyNotesAppSettings"));
   }
   
}




//DESCRIPTION : Creates an app settings object from the stored values retrieved from localstorage.
//@param : string appSettingsJson The app settings in JSON format. 
//@return : object An appSettingsObj object with the values of the given JSON.
function retrieveAppSettings(appSettingsJson){
   
   myAppSettingsObj = new appSettingsObj();
   myAppSettingsObj = JSON.parse(appSettingsJson);
   
}






//////////////////////////////OBJECTS///////////////////////////////

//APP SETTING OBJECT 
function appSettingsObj(){
   
   //properties
   this.noteIdCounter;
   
}

//NOTE OBJECT
function NoteObj(){
   
   //initialize vars
   noteIdCounter++;
   
   //properties
   this.id = noteIdCounter;
   this.title = '';
   this.content = '';
   this.color = '';
   this.positionTop = 0;
   this.positionLeft = 0;
   
}




   
   
   
   
/////////////////////////////////MAIN////////////////////////////////
$(document.window).ready(function(){       
	initialize();
});   

