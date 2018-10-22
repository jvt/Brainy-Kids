# External Developer's API Guide for Brainy Kids Applications
#### Last updated 10/21/18 by Asher Kenerly

# Quick Start
If you're a developer working on an app you want to intigtrate into the Brainy Kids app family, the following tutorial should get you started quickly.

## Getting a JWT token
You'll quickly find that you can't get far without a JWT token from our backend. This is how we implement security for our application. In several of these examples, you will see a place for the JWT token to be passed as a body parameter to our API. As seen in the parameters below, every user is consdiered a "Teacher", but don't be dismayed, developers will sign in as teachers as well!

Route: `/api/session/login`  
Method: `POST`  
Example request body:
```javascript
    {
        email: "teacher@school.edu",
        // The bcrypt generated hash for "iLoveCats!!"
        password: "$2y$12$4iM.4WX.d/S4dvzEaJMBLurjK7sTz4XYgqx0zPENmVFKK0Cy6hU5K"
        
    }
```

If the user/pass is found in our databse, you'll be given a repsonse like this:
```javascript
    {
        status: 'ok',
        token: jwtToken, // this is your JWT Token, be sure to save it!
        teacher: cleanTeacher // This is your Teacher object for reference
    }
```

Otherwise, expect a response like this:
```javascript
    {
        status: 'error',
        message: 'Your email / password combination is incorrect.'
    }
```

## Registering
Well you're able to sign in now, but what about registering in the first place? That would look something like this:

Route: `/api/session/register`  
Method: `POST`  
Example request body:
```javascript
    {
        name: 'Jane Doe',
        email: 'teacher@school.edu',
        password: 'iLoveCats!!'
    }
```

If the teacher is not already found in the databse and everything checks out, expect a response like this:
```javascript
    {
        status: 'ok',
        teacher: teacherObject, // Object representation you as a teacher
        token: yourJWTtoken // Your JWT token
    }
```

## Student Login

Route: `/api/session/student`  
Method: `POST`  
Example request body:
```javascript
    {
        student_id: '503' // The 3-Digit student ID
    }
```

Example response body:
```javascript
    {
        status: 'ok',
        token: jwtToken,
        student: student
    }
```

## Focus Items, Students, and Programs
Thankfully, each of these items follow the same straight forward CRUD pattern of interaction. Here you will find details of each


# Students
### Get all
Route: `/api/student`  
Method: `GET`  
*Empty request body*  
Example response body:  
*This will always turn at least an empty array*
```javascript
    {
        status: 'ok',
        student: [
            student1,
            student2,
            ...
        ]
    }
```
### Get One
Route: `/api/student/:id`  
Method: `GET`  
Parameters:  
* `id` is the 3 digit student id 

Example response body:
```javascript
    {
        status: 'ok',
        student: studentObject
    }
```

Or if there was an error in the student lookup:
```javascript
    {
        status: 'error',
        error: err,
        message: 'An unexpected internal server error has occurred!',
    }
```

### Create
Route: `/api/student`  
Method: `POST`  
Example request body
```javascript
    {
        teacher: teacherObject,
        student_id: '333', // The 3 Digit student ID of the new student
        deleted: false // Optional. Will almost always be false. Just specifies if the new student should be marked as deleted or not
    }
```
Example reponse body
```javascript
    {
        status: 'ok',
        student: studentObject
    }
```

### Update
Route: `/api/student/:id`  
Method: `PUT`  
Parameters:  
* `id` is the 3 digit student id  

Example request body  
*All members are optional*
```javascript
    {
        student_id: '412',
        deleted: true,
        teacher: teacherObject,
    }
```

Example reponse body
```javascript
    {
        status: 'ok',
        student: updatedStudent,
    }
```

### Delete
Route: `/api/student/:id`  
Method: `DELETE`  
Parameters:  
* `id` is the 3 digit student id  

*Empty request body*  
Example response body:  
```javascript
    {
        status: 'ok'
    }
```

# Focus Items
### Get all
Route: `/api/focusitem`  
Method: `GET`  
*Empty request body*  
Example response body:  
*This will always turn at least an empty array*
```javascript
    {
        status: 'ok',
        focusitems: [
            item1,
            item2,
            ...
        ]
    }
```
### Get One
Route: `/api/focusitem/:id`  
Method: `GET`  
Parameters:  
* `id` is the focus item object

Example response body:
```javascript
    {
        status: 'ok',
        focusitem: focusitemObject
    }
```

Or if there was an error in the focusitem lookup:
```javascript
    {
        status: 'error',
        error: err,
        message: 'An unexpected internal server error has occurred!',
    }
```

### Create
Route: `/api/focusitem`  
Method: `POST`  
Example request body
```javascript
    {
        name: name,
        program: program,
        unit: unit,
        sub_unit: subunit
    }
```
Example reponse body
```javascript
    {
        status: 'ok',
        student: focusitemObject
    }
```

### Update
Route: `/api/focusitem/:id`  
Method: `PUT`  
Parameters:  
* `id` is the focus item object id

Example request body  
*All members are optional*
```javascript
    {
        name: name,
        program: program,
        unit: unit,
        sub_unit: subunit
    }
```

Example reponse body
```javascript
    {
        status: 'ok',
        focusitem: updatedFocusitem,
    }
```

### Delete
Route: `/api/focusitem/:id`  
Method: `DELETE`  
Parameters:  
* `id` is the id of the focus item

*Empty request body*  
Example response body:  
```javascript
    {
        status: 'ok'
    }
```

# Programs
### Get all
Route: `/api/program`  
Method: `GET`  
*Empty request body*  
Example response body:  
*This will always turn at least an empty array*
```javascript
    {
        status: 'ok',
        programs: [
           program1,
           program2,
            ...
        ]
    }
```
### Get One
Route: `/api/focusitem/:id`  
Method: `GET`  
Parameters:  
* `id` is the program object id

Example response body:
```javascript
    {
        status: 'ok',
        program: programObject
    }
```

Or if there was an error in the program lookup:
```javascript
    {
        status: 'error',
        error: err,
        message: 'An unexpected internal server error has occurred!',
    }
```

### Create
Route: `/api/program`  
Method: `POST`  
Example request body
```javascript
    {
		name: name,
		description: description,
		type: type,
    }
```
Example reponse body
```javascript
    {
        status: 'ok',
        program: program
    }
```

### Update
Route: `/api/program/:id`  
Method: `PUT`  
Parameters:  
* `id` is the program object id

Example request body  
*All members are optional*
```javascript
    {
		name: name,
		description: description,
		type: type,
    }
```

Example reponse body
```javascript
    {
        status: 'ok',
        program: updatedProgram,
    }
```

### Delete
Route: `/api/program/:id`  
Method: `DELETE`  
Parameters:  
* `id` is the id of the focus item

*Empty request body*  
Example response body:  
```javascript
    {
        status: 'ok'
    }
```

# Analytics
Analytics are the backbone of all the reporting and processing that Brainy Kids does. The analytics creation routes are below:

### Hearatale
Route: `/api/analytics/hearatale`  
Method: `POST`  
Example request body:
```javascript
    {
        student: studentObject,
        program: programObject,
        focus_item: focusitemObject,
        time_watching: 115, // Time in seconds spent watching 
        total_video_time: 130 // Time in seconds of the duration of the video
    }
```
Example response body:  
```javascript
    {
        status: 'ok',
        analytic: analyticObject
    }
```

### Application
Route: `/api/analytics/application`  
Method: `POST`  
Example request body:
```javascript
    {
        student: studentObject,
        program: programObject,
        focus_item: focusitemObject,
        correct_on: 2, // The number of times it took get the question correct
        time_spent: 65 // The time spent looking at the question
    }
```
Example response body:  
```javascript
    {
        status: 'success',
        analytic: analyticObject
    }
```