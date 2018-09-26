const mongoose = require('mongoose');
const Program = require('../../backend/models/program');
const Analytic = require('../../backend/models/analytic');
const Focus_Item = require('../../backend/models/focus_item');
const Student = require('../../backend/models/student');
const Teacher = require('../../backend/models/teacher');
const bcrypt = require('bcrypt');

/**
 * This script does not use the API routes to ingest data
 * At time of creation, several CRUD routes have not been
 * developed yet. Perhaps a parallel script doing ingest via
 * API routes will be needed.
 * 
 * Author: Asher Kenerly
 */

 // Non vairables: 3 programs, 30 teachers

const number_of_students = 800;
const number_of_analytics = 4500;
const number_of_focus_items = 100;

 /**
  * Creates and saves programs
  */

const program_jsons = [
    {
        name: "Test Program 1",
        description: "First program for database testing",
        type: 'mobile game'
    },
    {
        name: "Test Program 2",
        description: "Second program for database testing",
        type: 'website'
    },
    {
        name: "Test Program 3",
        description: "Third program for database testing",
        type: 'mobile game'
    }
];

program_docs = [];

program_jsons.forEach(function(program_json) {
    const saved_program = new Program(program_json);
    program_docs.push(saved_program);
    saved_program.save(function(err, doc) {
        if (err) {
            console.log(err);
        }
    });
});

/**
 * Creates and saves teachers
 */

const passwords = [
    "123456",
    "password",
    "12345678",
    "qwerty",
    "123456789",
    "12345",
    "1234",
    "111111",
    "1234567",
    "dragon",
]



const password_hashes = [];
passwords.forEach(function(password) {
    const pwd_hash = hash(password);
    password_hashes.push(pwd_hash);
    
});

const teacher_names = [
    "Waldo Simcox",  
"Lorrine Kellam",
"Duane Helgeson",  
"Donovan Gagliardo",  
"Orville Bruso",  
"Anibal Ager",  
"Karine Stayer",
"Granville Mcdonough",
"Bobbi Bartley",
"Raul Kupiec",
"Agnus Manes",
"Claude Navarra",
"Ellis Kintner",
"Tammi Provenza",
"Shanita Cully",
"Danuta Mccullah",
"Joslyn Dehn",
"Zora Koester",
"Mafalda Chauvin",
"Asa Klumpp",
"Hulda Oriley",
"Bryce Markell",
"Mariam Mahler",
"Cherie Flakes",
"Evelyn Bogdan",
"Daphine Vandegrift",
"Willa Nicholas",  
"Garfield Heyward",
"Jude Didion",
"Celena Florian"
];

const teacher_jsons = [];
var teacher_id = 0;
teacher_names.forEach(function(name) {
    const email = name.toLowerCase().replace(" ",".") + "@school.edu";
    const id = teacher_id.toString();
    teacher_id++;
    // Gets a random password hash out of the passwords
    const pass_index = Math.floor(Math.random() * password_hashes.length);
    const password_hash = password_hashes[pass_index];

    const teacher_json = {
        teacher_id: id,
        name: name,
        email: email,
        password: password_hash
    };

    teacher_jsons.push(teacher_json);

});

teacher_docs = [];

teacher_jsons.forEach(function(teacher_json) {
    const saved_teacher = new Teacher(teacher_json);
    teacher_docs.push(saved_teacher);
    saved_teacher.save(function(err, doc) {
        if (err) {
            console.log(err)
        }
    });
});


/**
 * Creates and saves students
 */

 student_docs = [];

for (var i = 0; i < number_of_students; i++) {
    // console.log(teacher_docs);
    // random_teacher_doc = teacher_docs[Math.floor(Math.random() * teacher_docs.length)];
    
        const student_json = {
            student_id: i.toString(),
            teacher: random_teacher()._id,
            deleted: Math.random() > .95
        }

        const saved_student = new Student(student_json);
        student_docs.push(saved_student);
        saved_student.save(function(err, doc) {
            if (err) {
                console.log(err)
            }
        });    
}


/**
 * Creates and saves focus items.
 * Currently these do not generate units/ subunits
 */

var focus_item_docs = [];

for (var i = 0; i < number_of_focus_items; i++) {
    const name = "focus_item_" + i.toString();
    const focus_item_json = {
        name: name,
        program: random_program()._id
    };
    var saved_focus_item = new Focus_Item(focus_item_json);
    focus_item_docs.push(saved_focus_item);
    saved_focus_item.save(function(err, doc) {
        if (err) {
            console.log(err)
        }
    });
}


/**
 * Creates and saves analytics
 */

var analytic_docs = [];

for (var i = 0; i < number_of_analytics; i++) {
    focus_item = random_focus_item();
    var analytic_json = {
        focus_item: focus_item._id,
        student: random_student()._id,
        program: random_focus_item().program._id,
    };
    if (Math.random() > .5) {
        const correct_on = Math.floor(Math.random() * 15) + 1;
        const time_spent = correct_on * Math.floor(Math.random() * 61000) + 1000;
        analytic_json.correct_on = correct_on;
        analytic_json.time_spent = time_spent;
        
    } else {
        const total_video_time = Math.floor(Math.random() * 61000) + 15000;
        const time_watching = Math.random() * total_video_time;
        analytic_json.time_watching = time_watching;
        analytic_json.total_video_time = total_video_time;
    }
    const saved_analytic = new Analytic(analytic_json);
    console.log(saved_analytic);
    analytic_docs.push(saved_analytic);
    saved_analytic.save(function(err, doc) {
        if (err) {
            console.log(err)
        }
    });;
}

/**
 * Utility Functions 
 */

function random_teacher() {
    const index = Math.floor(Math.random() * teacher_docs.length);
    return teacher_docs[index];
}

function random_focus_item() {
    const index = Math.floor(Math.random() * focus_item_docs.length);
    return focus_item_docs[index];
}

function random_student() {
    const index = Math.floor(Math.random() * student_docs.length);
    return student_docs[index];
}

function random_program() {
    const index = Math.floor(Math.random() * program_docs.length);
    return program_docs[index];
}

/**
 * This function was copied from session.js in backend/controllers on 9/26
 * if the hash function there changes, it will cause this to generate invalid
 * hashes.
 * @param {*} password The plaintext password to be hashed
 */

function hash(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
