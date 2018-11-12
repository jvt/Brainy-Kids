const app = require('../../server');
const Program = require('../../backend/models/program');
const Analytic = require('../../backend/models/analytic');
const Focus_Item = require('../../backend/models/focus_item');
const Student = require('../../backend/models/student');
const Teacher = require('../../backend/models/teacher');
const bcrypt = require('bcrypt');
const request = require('supertest');
const Async = require('async');

/**
 * This script has been updated to use CRUD routes for all database interaction
 * 
 * Author: Asher Kenerly
 */

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

const passwords = [
    "123456",
]

module.exports.ingest = function (number_of_students, number_of_analytics, number_of_focus_items, done_function) {
    // Non vairables: 3 programs, 30 teachers
    createTeachers(teacher_names)
    .then(function(teacher_results) {
        // console.log("Now inside teacher then.")
        tokens = teacher_results[0];
        token = tokens[0];
        teacher_docs = teacher_results[1];
        // console.log(tokens);
        // console.log(teacher_docs);
        createPrograms(program_jsons, token)
        .then(function(programs) {
            createStudents(number_of_students, teacher_docs, tokens)
            .then(function(students) {
                createFocusItems(number_of_focus_items, programs, token)
                .then(function(focus_items) {
                    createAnalytics(number_of_analytics, students, focus_items, programs, tokens)
                    .then(done_function())
                    .catch(function(err) {console.log(err)});
                }).catch(function(err) {console.log(err)});
            }).catch(function(err) {console.log(err)});
        }).catch(function(err) {console.log(err)});
    }).catch(function(err) {console.log(err)});
};


async function createTeachers(teachers) {
    
    const teacher_tokens = [];
    const teacher_docs = [];

    for (teacher of teachers) {
        
        const email = teacher.replace(' ', '.').toLowerCase() + '@school.edu'
        res = await request(app)
            .post('/api/session/register')
            .send({
                name: teacher,
                email: email,
                password: random_item(passwords)
            });
        // console.log(res.body)
        teacher_tokens.push(res.body.token);
        teacher_docs.push(res.body.teacher);
        // console.log("Finished the loop.")
    }
    // console.log([teacher_tokens, teacher_docs]);
    return [teacher_tokens, teacher_docs];
    
}

async function createPrograms(program_jsons, token) {
    let programs = [];
    for (program_json of program_jsons) {
        res = await request(app)
            .post('/api/program')
            .send(program_json)
            .set('Authorization', 'Bearer ' + token);
        console.log(res.error)
        programs.push(res.body.program);
    }
    return programs;
}

async function createStudents(students, teachers, teacher_tokens) {
    const students_arr = [];

    for (var i = 0; i < students; i++) {
        const student_json = {
            student_id: pad(i, 3),
            teacher: random_item(teachers)._id,
            deleted: Math.random() > .95
        }
        res = await request(app)
            .post('/api/student')
            .send(student_json)
            .set('Authorization', 'Bearer ' + random_item(teacher_tokens));

        students_arr.push(res.body.student);
    }
    return students_arr;
}

async function createFocusItems(number_of_focus_items, programs, token) {
    const focus_items = [];
    console.log(programs)
    for (var i = 0; i < number_of_focus_items; i++) {
        const name = "focus_item_" + i.toString();
        const focus_item_json = {
            name: name,
            program: random_item(programs)._id
        };
        res = await request(app)
            .post('/api/focusitem')
            .send(focus_item_json)
            .set('Authorization', 'Bearer ' + token);
        focus_items.push(res.body.focusitem);

    }
    return focus_items;
}

async function createAnalytics(number_of_analytics, student_docs, focus_item_docs, program_docs, teacher_tokens) {
    const analytics = [];

    for (var i = 0; i < number_of_analytics; i++) {
        focus_item = random_item(focus_item_docs);
        var analytic_json = {
            focus_item: focus_item._id,
            student: random_item(student_docs)._id,
            program: focus_item.program._id,
            correct_on: Math.floor(Math.random() * 15) + 1,
            time_spent: this.correct_on * Math.floor(Math.random() * 61000) + 1000

        };
        // if (Math.random() > .5) {
        // const correct_on = 
        // const time_spent = ;
        // analytic_json.correct_on = correct_on;
        // analytic_json.time_spent = time_spent;

        // } else {
        //     const total_video_time = Math.floor(Math.random() * 61000) + 15000;
        //     const time_watching = Math.random() * total_video_time;
        //     analytic_json.time_watching = time_watching;
        //     analytic_json.total_video_time = total_video_time;
        // }
        res = await request(app)
            .post('/api/analytics/application')
            .send(analytic_json)
            .set('Authorization', 'Bearer ' + random_item(teacher_tokens));
        console.log(res.body)
        console.log(res.error)
        analytics.push(res.body.analytic);

    }
}

/**
 * Utility Functions 
 */

function random_item(items) {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
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
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}