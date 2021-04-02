# slate-for-chrome-v2-prototype
[WIP] You can follow the progress of The Slate Chrome Extension Version 2 on this repo as we prototype the app. 

The official Slate Chrome Store install will be updated at a later version. 


## How to test locally

1. Clone the repo
`git clone https://github.com/slate-engineering/slate-for-chrome.git`
2. Open Chrome, and click the puzzle icon in the top right corner.
3. Navigate to the 'Manage Extensions' page 
5. Turn 'Developer mode' on 
6. Click 'Load unpacked' and open the `slate-for-chrome` folder
<img width="1440" alt="Screen Shot 2021-03-31 at 9 34 32 AM" src="https://user-images.githubusercontent.com/60402678/113171516-c8b8a280-9204-11eb-89bd-3735ec45d63a.png">

To pin the extension on the taskbar, click the puzzle icon again and click the pin icon beside the Slate app.

## App

### API Keys
The first step is to add at least one Slate API key. You can do this on the welcome screen when you first install the app, or by clicking the settings icon on the main Slate popup. 
<img width="1440" alt="Screen Shot 2021-03-31 at 9 48 08 AM" src="https://user-images.githubusercontent.com/60402678/113173080-49c46980-9206-11eb-8aad-e18b70a27372.png">


### Usage

#### Multi image uploads
Clicking the Slate icon will grab every loaded image on the page and display them on a grid. You can click on multiple images and add them to multiple slate accounts. 

#### Single image upload
Similar to version 1, you can right click on any image and click `Add image`
This will open the Slate app and you can upload that image to muliple Slate accounts.

### Bugs
We are currently working through some known bugs in the app. If you encounter any of them, here's how you can fix it:

1. Sometimes the Chrome API will load the app twice, displaying two of every image. This won't affect much if you only upload one version of that image. However, using the `Select all` button will cause problems if app has loaded twice. 

  Temporary fix: Close the app and try reopening it.
  
  <br />

2. If your file has successfully uploaded, but you still see the uploading bar, something went wrong when updating the local storage. 

  Temporary fix: Open the Uploads page and clear your upload history or click the 'Reset upload count' button. 
