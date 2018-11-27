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

 /**
  * Example code for running this script:
  *     before(function(done) {
        this.timeout(15000);
        Analytic.deleteMany({}).then(function() {
            Teacher.deleteMany({}).then(function() {
                Student.deleteMany({}).then(function() {
                    Focus_Item.deleteMany({}).then(function() {
                        Program.deleteMany({}).then(function() {
                            ingest.ingest(300, 900, 25, done);
                        });
                    });
                });
            });
        });
    });
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
    "12345678",
]

module.exports.ingest = function (number_of_students, number_of_analytics, number_of_focus_items, done_function) {
    // Non vairables: 3 programs, 30 teachers
    createTeachers(teacher_names)
    .then(function(teacher_results) {
        tokens = teacher_results[0];
        token = tokens[0];
        teacher_docs = teacher_results[1];
        createProgramsRandom(program_jsons, token)
        .then(function(programs) {
            createStudentsRandom(number_of_students, teacher_docs, tokens)
            .then(function(students) {
                createFocusItemsRandom(number_of_focus_items, programs, token)
                .then(function(focus_items) {
                    createAnalyticsRandom(number_of_analytics, students, focus_items, tokens)
                    .then(function() {
                        done_function()
                    }).catch(function(err) {console.log(err)});
                }).catch(function(err) {console.log(err)});
            }).catch(function(err) {console.log(err)});
        }).catch(function(err) {console.log(err)});
    }).catch(function(err) {console.log(err)});
};

module.exports.ingest_custom = async function() {

    const program_json = {
        name: "Program for test analytics",
        description: "Analytic tester",
        type: 'mobile game'
    }

    const teacher_json = {
        name: "Testy mcTester",
        email: "testy.mctester@school.edu",
        password: "123456789"
    }
    teacher_results = await createTeacher(teacher_json);
    clean_teacher = teacher_results[1];
    teacher_token = teacher_results[0];
    program = await createProgram(program_json, teacher_token);
    students = await createStudents(15, clean_teacher, teacher_token);
    pg_arr = []
    pg_arr.push(program)
    focus_items = await createFocusItemsRandom(5, pg_arr, teacher_token)
    analytics = await createAnalytics(students, focus_items, teacher_token);
    return [clean_teacher, focus_items, program, students, analytics, teacher_token];
    
}


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
        teacher_tokens.push(res.body.token);
        teacher_docs.push(res.body.teacher);
    }
    return [teacher_tokens, teacher_docs];
    
}

async function createTeacher(teacher) {
    res = await request(app)
            .post('/api/session/register')
            .send({
                name: teacher.name,
                email: teacher.email,
                password: teacher.password
            });
    return [res.body.token, res.body.teacher]
}

async function createProgramsRandom(program_jsons, token) {
    let programs = [];
    for (program_json of program_jsons) {
        res = await request(app)
            .post('/api/program')
            .send(program_json)
            .set('Authorization', 'Bearer ' + token);
        programs.push(res.body.program);
    }
    return programs;
}

async function createProgram(program_json, token) {
    res = await request(app)
            .post('/api/program')
            .send(program_json)
            .set('Authorization', 'Bearer ' + token);
    return res.body.program
}

async function createStudentsRandom(students, teachers, teacher_tokens) {
    
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

async function createStudents(number_of_students, teacher, token) {
    const students_arr = [];
    for (var i = 0; i < number_of_students; i++) {
        const student_json = {
            student_id: pad(i, 3),
            teacher: teacher._id,
            deleted: Math.random() > .95
        }
        res = await request(app)
            .post('/api/student')
            .send(student_json)
            .set('Authorization', 'Bearer ' + token);

        students_arr.push(res.body.student);
    }
    return students_arr;
    
    
    
}

async function createFocusItemsRandom(number_of_focus_items, programs, token) {
    // console.log(number_of_focus_items + ':' + programs[0] + ':' + token)
    // console.log(random_item(programs)._id)
    const focus_items = [];
    for (var i = 0; i < number_of_focus_items; i++) {
        const name = "focus_item_" + i.toString();
        const focus_item_json = {
            name: name,
            program: random_item(programs)._id,
            unit: 'test_unit',
            subunit: 'test_sub_unit'
        };
        //console.log(focus_item_json)
        res = await request(app)
            .post('/api/focusitem')
            .send(focus_item_json)
            .set('Authorization', 'Bearer ' + token);
        //console.log(res.error)
        focus_items.push(res.body.focusitem);

    }
    return focus_items;
}

async function createFocusItem(program, focus_item_number, token) {
    
    const focus_item_json = {
        name: "focus_item_" + focus_item_number.toString(),
        program: program._id,
        unit: 'test_unit',
        subunit: 'test_sub_unit'
    };
    res = await request(app)
        .post('/api/focusitem')
        .send(focus_item_json)
        .set('Authorization', 'Bearer ' + token);
    return res.body.focusitem;
}

async function createAnalyticsRandom(number_of_analytics, student_docs, focus_item_docs, teacher_tokens) {
    const analytics = [];

    for (var i = 0; i < number_of_analytics; i++) {
        focus_item = random_item(focus_item_docs);
        let correct_on = Math.floor(Math.random() * 15) + 1
        var analytic_json = {
            focus_item: focus_item._id,
            student: random_item(student_docs)._id,
            program: focus_item.program,
            correct_on: correct_on,
            time_spent: correct_on * Math.floor(Math.random() * 61000) + 1000

        };

        res = await request(app)
            .post('/api/analytics/application')
            .send(analytic_json)
            .set('Authorization', 'Bearer ' + random_item(teacher_tokens));
        analytics.push(res.body.analytic);
    }
    return analytics;
}

async function createAnalytics(students, focus_items, token) {
    const analytics = [];

    for (student of students) {
        for (focus_item of focus_items) {
            let correct_on = Math.floor(Math.random() * 15) + 1
            var analytic_json = {
                focus_item: focus_item._id,
                student: student._id,
                program: focus_item.program,
                correct_on: correct_on,
                time_spent: correct_on * Math.floor(Math.random() * 61000) + 1000
            };
            res = await request(app)
                .post('/api/analytics/application')
                .send(analytic_json)
                .set('Authorization', 'Bearer ' + token);
                analytics.push(res.body.analytic);
        }
    }

    return analytics;
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