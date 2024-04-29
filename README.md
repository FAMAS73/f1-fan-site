this project is to show how CRUD operations work with firebase as database using authentication login from firebase for admin to login and use admin dashboard to do CRUD operations 

project theme is formaula 1 fan site with teams and their drivers showing their info and bio 

keep in mind that a team can have only two drivers for firestore creation

how to use:
1. create firebase project
2. create web project(html icon on console)
3. copy const firebaseConfig = {...}; and replace it in '../utils/firebaseConfig.js
4. in firebase console go to Authentication setup email/password login then add user with your own email and password
5. create database:
6. go to firestore database choose production mode
7. change 'false' to 'true' in Rules
8. (read f1.json first..scroll down to see drivers) start collection: collection id: teams add fields like f1.json then start collection inside a team collection id: drivers and do the same. make sure to correctly put all the fields and put atleast one object for teams and drivers collection
9. if npm run dev show error copy all .js and project structure to create new project. project setup create-next-app@latest >> App Router: NO
10. npm install @emotion/react @emotion/styled @mui/material @mui/styled-engine-sc styled-components firebase @mui/icons-material



