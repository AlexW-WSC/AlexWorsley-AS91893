# AlexWorsley-AS91893 'NoticeBoard' README

NoticeBoard is firstly designed as a study tool for students and the like to have a place to visually identify and organise important tasks, in a feature-heavy package which works great for visual learners. Designed to be visually calming and chill, this webapplication is a must for anyone who is letting their tasks build up & having stress control their life.

Notes can be created after signing in (the central button of the navigation bar) by pressing the '+' icon in the top-left. Here, the note's name can be customised at the top, in between the '<' Back button (cancels note creation) and the 'tick' Confirm button (creates note). The midsection is the text area, which serves as the body text of the note. Most URLs and gifs are supported in this field (e.g`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6sGD7JTZnzScm52XzpJVzKAP1f1wJyXj5G6Brpj7-HQ&s=10` - Wikimedia Commons Example Image) and will be converted upon creating the note. The bottom section houses variables to edit your note's appearance and content. Upon note creation, notes can be edited by clicking the 'edit' icon, where it will bring up a similar overlay with the note's current content. Notes can be dragged around by clicking and holding anywhere on them, and if they are dragged into the crossed red 'delete' area, they will be deleted. 

### Features
* Note Creation with lots of customisation, with the following features: 
    * Draggable & bring-to-top positioning
    * Categories with differing colours 
    * Due Dates / Priority information
    * Note size customisation
    * Support for note transparency for easier readability
* Note Editing & Deletion
* Opacity-by-category filter bar
* Dynamic refresh capabilities with all data pulled from an API
* Dark Mode & Dyslexic font toggle
* Register/Login Utility which allows for the saving of notes to specific user accounts (with encrypted passwords~!)


## Technical Information

### File Structure
My filestructure is logically partitioned into different folders, to organise my project efficiently. 

`/boards.html`: the core HTML file!!

`/api`: this is where the components for the backend API are located, with `/api/common`, `/api/node_modules`, `/api/package-lock.json`, `/api/package.json` being files/folders supporting the node implementation. `/api/server.js`is the server which runs using node to host the API, storing information by overwriting `/api/users.json/` & `/api/notes.json`.

`/assets`: contains various PNGs all appended with _icon.

`/css`: contains the css file for `/boards.html`. More will be added later when more pages need them.

`/fonts`: contains the two fonts my project uses, LINE SEED JP & OpenDyslexic 3.

### API
My API backend is used for storing users and storing notes, with support for all of the note variables above, and a working user system. 

### Usage 
Node.js is required to locally host this application. To run the server (which the wepapplication relies on), navigate to the directory `/api` inside the project and run the command `node server.js`. Find the webpage in the browser of your choice at `http://localhost:3000/boards.html`.

### Sprint Summary 
Sprint 1 (v0.1-v0.5): Project setup, core note API routes (create/delete), base html/css, note creation form(iteration 1), draggable notes

Sprint 2 (v0.6-v0.8): Overlay support, note creation form functionality(iteration 2), refresh function for notes, new visual board UI & icons

Sprint 3(v0.9-v0.12): Big note customisation update, opacity & size support, img/gif support, note creation overlay done!, opacity slider ui, note editing, API id lookup

Sprint 4(v0.13-Release 1): Userauth system, signup/signin overlay, api support for hashing passwords, general HTML & css improvements, Dark Mode & font toggles

### Made by Alexx W <3
