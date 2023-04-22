# BlazeChatHub

This is the repository for the website blazechathub.web.app. This project is meant to expand upon a wonderful template for a realtime chat app run on firebase. We have made this project open-source in the name of transparency and so that others can run this project/build upon it themselves.

Here is a list of the features that have been added:
-Made all usernames randomly generated (Anonymous + 6 digit number)
-Made username color depend on username number and have background so they're easily readable
-Added timestamps to messages
-Implemented anti-spam measures (No blank messsages and each username can only send 1 message every two seconds)
-Each message has a 1000 character limit
-Dark Mode
-Added a users online count (doesn't work)

If you would like to host your own version of this, follow these steps:
1.Clone this repository
2.Set up a firebase account and create a new project
3.Create a new web thing so you can get the firebase credentials
4.Generate your own 256 bit AES key, use windows command prompt 
4.Edit this code to use your firebase credentials and encryption key
5.Install Node JS to get npm
6.Use npm to install firebase
7.Use firebase init in the cloned code directory to set up your project for hosting
8.Use "firebase deploy" to release your website to the web
9.Celebrate!
