Run npm install from chatapp directory to install chat app,
Run npm install from server directory to install server,

run ng build to build chatapp,
run node server.js from server directly to start server,
comment out seeder function within server.js if you wish to keep persistent data storage between server closures.
find on localhost:3000

DOCUMENTATION:
Assignment PHASE 2 Documentation:
Student: Lachlan Manson
Student number: s5127230

GITHUB Repository: https://github.com/lachie222/ChatApp


GIT Repository and Usage:
For phase 2 of this project, I regularly used git and github to backup and save. At the end of each working session, I committed and pushed to the assignment 2 branch with a short message describing what I had done since the last commit.

Data Structures:

Users:
Users are represented on the server-side as an object with an auto-generated id, a unique username, a unique email, a password and a role. They are stored within their own collection on mongoDB. Some initial users are created using the seeder file.

On the clientside, a single user is represented in localStorage as a JSON object. It is initially received from the server-side at login.

Groups:
Groups are represented on the server-side inside a Group class file which defines the properties and methods of a group (these include groupname, array of channels, array of groupassis's, addChannel function). Groups are also represented in mongoDB, which is used for storing each group for later retrieval.

On the client-side, a user's groups are represented in localStorage as a JSON object. It is initially received from the server-side at login and can be retrieved/updated through further calls to the server.

Channels:
Channels are represented on the server-side inside the group class file as its own class which defines the properties and methods of a channel (these include channelname, array of users, adduser function). Channels are represented in server-side storage inside the channels array of their respective groups.

On the client-side, a user's channels are represented inside the channels array of the aforementioned groups localStorage JSON object. 

Angular Architecture:

Components:

Login Component: The login component is loaded at the root of the application, and represents all the logic and html required to send a login/authentication request to the server. 

Control Panel Component: The control panel component represents all the logic and html required to perform admin functions such as creating/deleting groups and users, promoting users, etc.

Groups Component: The groups component represents all the logic and html required to display the users' available groups and channels as a list. This component also contains a form only visible to admins or group assis' to create/remove channels.

Chat Component: The chat component represents all the logic and html required to display the chatbox of the selected group/channel combo. The chatbox fetches chathistory from the server via mongoDB and connects via sockets to provide real-time chat integration amongst multiple users.

Services:

FetchDataService: The fetchdata service represents the functions used to fetch group data and check group assis's. Since most requests on the web app involve updating groupstorage data (anything that affects groups, channels, users in channels etc), it is useful to refresh and refetch the data after a change has been made. The checkGroupAssis function is also included to loop through group data and identify if a user is a groupassis or not.

Models:

A number of interfaces were used as models to describe the data/data structure of incoming and outgoing objects. These include chatData objects, groupData objects, message objects and user login objects.

Routes:

Angular routes are utilised to navigate to each of the components.
The root of the application '/', loads the standard application component, which also loads the login component. Once a user is authenticated, the login component will automatically route to the groups component. Also, once a user is authenticated, the navbar will display a link for the groups component (named chat), and also the control panel component if the user is an admin.

In the groups component, clicking on a link to a channel will route to the chat component with the group and channel name as parameters to the component.

Finally, the logout button will route back to the root of the application where the login component is located and clear localStorage.

Node Server Architecture:

Modules:
Each custom module is located under the app_modules directory
Auth: The auth module contains all the logic required to authenticate users and register new users. The auth module also contains fetchgroups.js, which is used to retrieve and send group data.

Group: The group module contains the class definitions for groups, chats, and channels, and the routes/functionality required to perform crud functions on each of these entities.

dbSeeding: The dbSeeding folder contains the original json storage files used in phase one of the assignment, and also a new file called seed.js. Seed.js is used to build/rebuild the mongoDB database, and then utilise the original JSON storage as inputs for initial data into the mongoDB database.

Server.js: Server.js imports all of the above logic and also provides its own logic for running the server event listener and also running sockets. The server is then exported for use in testing.

serverTests: Server tests is a folder containing the unit and integration tests for the node server. These are aimed to test the functionality of each route and its related crud function on the database.

Functions:
app.post('/api/auth') -> used for authenticating users,

app.post('/api/register')-> used for registering a new user,

app.post('/api/deleteacc)->used for deleting a user,

app.post('/api/fetchgroups')-> used to return groups to the front end

app.post('/api/retrievechat)-> used to return chat history to the front end

app.post('/api/creategroup)-> used to create a new group and store in mongodb

app.post('/api/removegroup)-> used to remove a group from mongodb

app.post('/api/createchannel)-> used to create a new channel and store in mongodb

app.post('/api/removechannel)-> used to remove a channel from a group in mongodb

app.post('/api/adduser)-> used to add a requested user to a channel

app.post('/api/removeuser') -> used to remove a requested user from a channel

app.post('/api/promotesuper) -> used to change a requested users role to superadmin

app.post('/api/promotegroupadmin)-> used to change a requested users role to groupadmin

app.post('/api/promotegroupassis)-> used to promote a requested user to groupassis of a requested channel

Client-server responsibilities:
The angular front end is only used for display purposes. The only data that is processed from angular is a users role for displaying user/admin content, whether they are logged in and the group/channel names to use as inputs for forms, and navigating to a chatroom. Any other form of data processing is done by sending a http request to the server. The angular front end will also prohibit a user from accessing admin functions by choosing not to generate the html components required for them. The server-side also checks roles within each function to ensure this can't be bypassed.

The server-side is responsible for all data processing and storage. Any request to make a change to a group (adding, updating, deleting) is done via a http request, the server will perform the function of the request and the server will return JSON objects containing messages, groupdata and/or userdata. 

The chatroom is connected via sockets.io, where the client is responsible for receving messages and sending messages, and the server is able to receieve messages from the client and emit them back to all users connected on the socket, and then store the message in mongoDB as chat history.

Client-server interaction:
As mentioned before, when any change to a data object needs to be made, the angular front end will send a http request to the server. The server will check that request, complete the requested function and then return a message and/or some data.

Using the chatbox as an example: Upon loading the component, angular will send a request to the server to obtain the chat history for that channel. The server will receive the request and run a function to match the request parameters to the chat object in mongodb. If a match is found, the server will then return the chat history of that chat object back to angular to display. Angular will then update the display with the chat history

If angular wishes to create a new chat message, it will send a request to the server to create a message for the channel via sockets. The server will process it according to the request parameters, and emit back the message to all users connected to the room in angular. The server will then store the same message it emitted into mongoDB, which then updates chathistory.


Known Bugs/issues:

-	Fetchgroupdata will fetch all groups in the system regardless of user (I ran out of time to implement fetching user specific groups)

-	Group data will only update once the component is reloaded (possibly also an issue with fetchgroupdata service. If the fetchgroupdata service function is implemented directly into each component, data will update realtime. Could be an issue with latency?)





