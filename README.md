RedTea Web Framework
===

An easy-use web framework for _front-end developer_.

RedTea is NOT a MVC web framework, it aims to provide a new way to develop web service without server-side knowledge.

With integration of front-end/back-end web development experiences, it uses JavaScript class method instead of tranditional communication methods. There is no need to understand GET/POST methods of HTTP protocol and handle Ajax stuffs, developer totally can write a web service with front-end web development experence only.


Design Pattern
---
When you start to write a web service based on RedTea, there are four parts you must understand:

1. User Interface
2. Runner
3. Route
4. API Wrapper



  User Interface
  ---

  Layout template.
  
  You can design web page and implement application UI here in jade language.


  Runner
  ---

  Brower-side script. Used to control UI components in client-side.
  
  The special thing is, RedTea make it can be able to use server-side APIs in browser-side that's just like calling APIs in server-side envionment. With tranditional class method of JavaScript, you can make a communication with server directly without Ajax solutions.


  Route
  ---
  
  URL path route.
  
  DO NOT suggest to define complex rules. It's better to use routing to select UI and Runner only.
  
  
  API Wrapper
  ---
  
  Server-side APIs, it will be exported and able to be used in browser-side.
  
  Developer can write a browser-side script to use these APIs directly, to exchange data between server and client.



Good Development Flow with RedTea?
---

RedTea is different concept from other web framework, you don't need to understand HTTP stuffs, define complex APIs/data structure for Ajax and have concept of server-side things. Only one thing is to know how to write script in JavaScript.

  We consider the good development flow with RedTea is:
    
  1. Design what you want to see
  2. Implement requirements based on UI
  3. Process user's data in server-side
  
-
    
Comparison with MVC:
  
  1. Design Model in server-side (How can you design a good model when you have no idea about complete requirement?)
  2. Design View for UI
  3. Design Controller for communication between Model and View (GET/POST Routing stuffs, Ajax APIs... etc)
  4. Rework Model again and again for requirements
  5. Rework View again and again because Model was changed
  6. Your Controller will be disgusting after you rework Model and View many times
    
-

In RedTea, Following steps then you can enjoy writing a web service:
  
  1. Make a URL path route to put your page, ex: "/myfirstpage". (Route)
  2. Design a page layout for user interface (UI)
  3. Implement functionalities in browser-side JavaScript (Runner)
  4. Implement Class/Function in server-side if data needs to be processed by server. (API Wrapper)
  5. Modify your browser-side script to call server-side APIs with class method to push/pull data to/from server (Runner)
  6. Done! Drink a cup of red tea! :-)
  
