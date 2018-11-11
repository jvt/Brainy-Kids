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

module.exports.ingest = async function (number_of_students, number_of_analytics, number_of_focus_items) {
    // Non vairables: 3 programs, 30 teachers

    /**
     * Creates and saves teachers
     */

    const teacher_tokens = [];
    const teachers = [];

    teacher_names.forEach(async function (name) {
        const email = name.toLowerCase().replace(" ", ".") + "@school.edu";
        const password = random_item(passwords);
        res = await request(app)
            .post('/api/session/register')
            .send({
                name: name,
                email: email,
                password: password
            });
        teacher_tokens.push(res.body.token);
        teachers.push(res.body.teacher);
    });


    /**
     * Creates and saves programs
     */

    let programs = [];
    
    program_jsons.forEach(async function (program_json) {
        res = await request(app)
            .post('/api/program/create')
            .send(program_json)
            .set('Authorization', 'Bearer ' + random_item(teacher_tokens));

        programs.push(res.body.program);
    });

    while (programs.length < program_jsons.length) {

    }

    /**
     * Creates and saves students
     */

    const students = [];

    for (var i = 0; i < number_of_students; i++) {
        const student_json = {
            student_id: pad(i, 3),
            teacher: random_item(teachers)._id,
            deleted: Math.random() > .95
        }
        res = await request(app)
            .post('/api/student/create')
            .send(student_json)
            .set('Authorization', 'Bearer ' + random_item(teacher_tokens));

        students.push(res.student);
    }

    /**
     * Creates and saves focus items.
     * Currently these do not generate units/ subunits
     */

    const focus_items = [];

    for (var i = 0; i < number_of_focus_items; i++) {
        const name = "focus_item_" + i.toString();
        const focus_item_json = {
            name: name,
            program: random_item(programs)._id
        };
        res = await request(app)
            .post('/api/focusitem/create')
            .send(focus_item_json)
            .set('Authorization', 'Bearer ' + random_item(teacher_tokens));
        focus_items.push(res.body.focusitem);

    }

    /**
     * Creates and saves analytics
     */

    const analytics = [];

    for (var i = 0; i < number_of_analytics; i++) {
        focus_item = random_item(focus_items);
        var analytic_json = {
            focus_item: focus_item._id,
            student: random_item(student_docs)._id,
            program: random_item(focus_item_docs).program._id,
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
        res = await request(app)
            .post('/api/focusitem/create')
            .send(focus_item_json)
            .set('Authorization', 'Bearer ' + random_item(teacher_tokens));

        analytics.push(res.body.analytic);

    }
};


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