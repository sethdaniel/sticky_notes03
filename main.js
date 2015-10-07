
//////////////////////////////GLOBALS////////////////////////////////
myAppSettingsObj = getAppSettings();
var noteIdCounter = 0;
 
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
   
   //SAVE NOTE BUTTON
   $('#save_note_pseudobutton').on('click', function(){
      
      //save the note
      saveNote();
      
      //populate notes container
      populateNotesContainer();
      
      
   });
   
   //NEW NOTE BUTTON
   $('#new_note_pseudobutton').on('click', function(){
      
      //create a new note object
      var newNoteObj = new NoteObj();
      
      //get html form string
      var newNoteFormHtml = newNoteObj.generateEditForm();
      
      //inject the form html into the DOM
      $('#notes_container').html(newNoteFormHtml);
      
      //catch all to bind to the save button
      bondage();
      
   });
   
   
   
   
   
   //CHANGE LISTENERS

}




/////////////////////////////FUNCTIONS//////////////////////////////

//DESCRIPTION : Gets all saved notes in localstorage and puts them in an array.
//@return : array allSavedNotesArr All saved notes from local storage as an array.
function getAllSavedNotesAsArray(){
   
   //initialize vars
   var allSavedNotesArr = new Array();
   
   //cycle through all localstorage
   for(var i = 0; i < localStorage.length; i++){
      
      //get each object as JSON string
      var currentLocalStorage = localStorage.getItem(localStorage.key(i));
      
      //get each object as js object
      var currentLocalStorageDejsoned = JSON.parse(currentLocalStorage);
      
      //check that the object is a note object
      if(currentLocalStorageDejsoned.type == 'note_object'){
         
         //if note object add to array
         allSavedNotesArr.push(currentLocalStorageDejsoned);
         
      }
      
   }
   
   return allSavedNotesArr;
   
}






//DESCRIPTION : Gets app settings from localstorage.  If no app settings have been saved in localstorage then it initializes all app settings.
function getAppSettings(){
   
   //intialize app settings
   if(localStorage.getItem("stickyNotesAppSettings") === null){
      myAppSettingsObj = new appSettingsObj();
      myAppSettingsObj.noteIdCounter = 0;
      saveAppSettings(myAppSettingsObj);
   }
   
   //retrieve app settings from memory
   else{
      myAppSettingsObj = retrieveAppSettings(localStorage.getItem("stickyNotesAppSettings"));
   }
   
}




//DESCRIPTION : Gets a single note via the given key value pair.
//@param : string toGetWithKey The property/key to retrieve. 
//@param : string toGetWithValue The property/value to retrieve. 
//@return : object foundNoteObject A NoteObj that matches the key/value pair.
function getSingleNote(toGetWithKey, toGetWithValue){
   
   //initialize vars
   var foundNoteObject = new NoteObj();
   var bFound = false;
   
   //cycle through all local storage
   for(var i = 0; i < localStorage.length; i++){
      
      //get each object as JSON string
      var currentLocalStorage = localStorage.getItem(localStorage.key(i));
      
      //get each object as js object
      var currentLocalStorageDejsoned = JSON.parse(currentLocalStorage);
      
      //check that the object is both a note object AND is a key/value match
      if(currentLocalStorageDejsoned.type == 'note_object' && currentLocalStorageDejsoned[toGetWithKey] == toGetWithValue){
         
         //assign the found note object 
         foundNoteObject = currentLocalStorageDejsoned;
         bFound = true;
         
      }
      
   }
   
   //set return var to false if a matching note was never found
   if(bFound === false){
      foundNoteObject = false;
   }
   
   return foundNoteObject;
   
}




//DESCRIPTION : Combines a newly created note object with one that has been parsed from JSON
//@param : object blankNoteObj Note object with methods but no values.
//@param : object parsedNoteObj Note object with values but no methods.
//@return : object blankNoteObj A note object made assigning the values of parsedNoteObj to those of parsedNoteObj.
function integrateNoteObjects(blankNoteObj, parsedNoteObj){
   
   blankNoteObj.id = parsedNoteObj.id;
   blankNoteObj.title = parsedNoteObj.title;
   blankNoteObj.content = parsedNoteObj.content;
   blankNoteObj.positionTop = parsedNoteObj.positionTop;
   blankNoteObj.positionLeft = parsedNoteObj.positionLeft;

   return blankNoteObj;
}





//DESCRIPTION : Populates the dragable area with the saved notes.
function populateNotesContainer(){
   
   //first get all notes in an array
   var allNotes = getAllSavedNotesAsArray();
   
   for(var i = 0; i < allNotes.length; i++){
      
      //integrate each saved note object to give it methods
      var currentSavedNoteObj = new NoteObj();
      currentSavedNoteObj = integrateNoteObjects(currentSavedNoteObj, allNotes[i]);
      
      //create small form note HTML element for each saved note obj
      var currentSavedNoteHtml = currentSavedNoteObj.generateSmallFormDragableElement();
      
      //if it is the first note to be injected into the DOM then it needs to replace what is already in the dragbale note area
      if(i == 0){
         $('#notes_container').html(currentSavedNoteHtml);
      }else{
         $('#notes_container').appendTo(currentSavedNoteHtml);
      }
      
      //position
      $(currentSavedNoteHtml).css({
         left: currentSavedNoteObj.postitionLeft, 
         top: currentSavedNoteObj.positionTop      
      });
      
      //fade in
      $(currentSavedNoteHtml).hide().fadeIn();
      
   }
   
}






//DESCRIPTION : Creates an app settings object from the stored values retrieved from localstorage.
//@param : string appSettingsJson The app settings in JSON format. 
//@return : object An appSettingsObj object with the values of the given JSON.
function retrieveAppSettings(appSettingsJson){
   
   myAppSettingsObj = new appSettingsObj();
   myAppSettingsObj = JSON.parse(appSettingsJson);
   
}




//DESCRIPTION : Finds the older version of the note in localstorage and applies the old coordinates to the new note object.
//@param : object toReplaceCoordinatesOfNoteObj The new note object who needs to have it's coordinates replaced. 
//@return : object toReplaceCoordinatesOfNoteObj The new note object with it's coordinates replaced.
function retrieveCoordinates(toReplaceCoordinatesOfNoteObj){
   
   //get the last version of the note
   var olderVersionOfNoteObj = new NoteObj();
   olderVersionOfNoteObj = getSingleNote('id', toReplaceCoordinatesOfNoteObj.id);

   //replace coordinates with last verion's
   toReplaceCoordinatesOfNoteObj.positionTop = olderVersionOfNoteObj.positionTop;
   toReplaceCoordinatesOfNoteObj.positionLeft = olderVersionOfNoteObj.positionLeft;
   
   return toReplaceCoordinatesOfNoteObj;
   
}




//DESCRIPTION : Saves the app settings to localstorage.
//@param : object toSaveAppSettingObj The app settings object to save to local storage.
function saveAppSettings(toSaveAppSettingObj){
   
   //get app settings as a JSON string
   var toSaveAppSettingJson = JSON.stringify(toSaveAppSettingObj);
   
   //save it 
   localStorage.setItem("stickyNotesAppSettings", toSaveAppSettingJson);
   
}







//DESCRIPTION : Saves a note to local storage.
function saveNote(){
   
   //create new note object
   var newlySavedNoteObj = new NoteObj();
   
   //get the values from the form
   if(!isNaN(parseInt($('#note_id_field').val()))){
      newlySavedNoteObj.id = $('#note_id_field').val();
   }else{
      newlySavedNoteObj.id = getLastUsedId + 1;
   }
   newlySavedNoteObj.title = $('#title_textbox').val();
   newlySavedNoteObj.content = $('#content_textbox').val();
   newlySavedNoteObj.color = $('#color_chooser').val();


   //attempt to retrieve positioning from localstorage
   if(getSingleNote('id', newlySavedNoteObj.id) !== false){
      
      newlySavedNoteObj = retrieveCoordinates(newlySavedNoteObj);
      
   }
   
   //save the note
   var newlySaveNoteJson = JSON.stringify(newlySavedNoteObj);
   localStorage.setItem(newlySavedNoteObj.id, newlySaveNoteJson);
   
   

}






//////////////////////////////OBJECTS///////////////////////////////

//APP SETTING OBJECT 
function appSettingsObj(){
   
   //properties
   this.noteIdCounter;
   
}

//NOTE OBJECT
function NoteObj(){
   
   //INITIALIZE VARS
   

   //PROPERTIES
   this.id = 0;
   this.title = '';
   this.content = '';
   this.color = '';
   this.positionTop = 0;
   this.positionLeft = 0;
   this.type = "note_object"
   
   //METHODS
   
   //generate edit form
   this.generateEditForm = function(){
      
      var editFormHtml = '<input type="hidden" id="note_id_field" value="' + this.id +'">\n\
                          <div id="title_container">\n\
                           <span id="title_label" class="form_label">Title:</span>\n\
                           <span id="title_input"><input type="text" id="title_textbox" value="' + this.title + '"></span>\n\
                          </div>\n\
                          <hr>\n\
                          <div id="content_container">\n\
                           <span id="content_label" class="form_label">Note:</span>\n\
                           <span id="content_input"><textarea id="content_textbox" rows="30" cols="400">' + this.content + '</textarea></span>\n\
                          </div>\n\
                          <div id="color_chooser_container">\n\
                           <select id="color_chooser">\n\
                              <option id="red_option" class="color_option" value="rgba(255, 0, 0, 0.7)">red</option>\n\
                              <option id="orange_option" class="color_option" value="rgba(255, 127, 0, 0.7)">orange</option>\n\
                              <option id="yellow_option" class="color_option" value="rgba(255, 255, 0, 0.7)">yellow</option>\n\
                              <option id="green_option" class="color_option" value="rgba(0, 255, 0, 0.7)">green</option>\n\
                              <option id="blue_option" class="color_option" value="rgba(0, 0, 255, 0.7)">blue</option>\n\
                              <option id="purple_option" class="color_option" value="rgba(75, 0, 130, 0.7)">purple</option>\n\
                           </select>\n\
                          </div>\n\
                          <div id="notes_buttons_container">\n\
                           <div id="save_note_pseudobutton" class="pseudobutton">Save Note</div> \n\
                          </div>';
      
      return editFormHtml;
      
   };
   
   
   
   //generate small form html
   this.generateSmallFormDragableElement = function(){
      
      var smallFormHtml = '<div id="' + this.id + '" style"background-color: ' + this.color + ';" class="note_small_form_container">\n\
                              <span class="title_field">' + this.title + '</span>\n\
                              <span id="' + this.id + '" class="edit_icon_container"><img id="edit_icon" src="edit_icon01.svg" alt="edit"></span>\n\
                           </div>';
      
      return smallFormHtml;
      
   };
   
   
   
      var appSettingsObj = getAppSettings();
      
      return appSettingsObj.noteIdCounter;
      
   
   
   
}




   
   
   
   
/////////////////////////////////MAIN////////////////////////////////
$(document.window).ready(function(){       
	initialize();
});   

