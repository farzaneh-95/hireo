const faker = require('faker');
// faker.locale = 'fa';

const Job = require('../models/job');

module.exports = async (categories, employers, freelancers) => {
    const locations = ['Los Angeles', 'San Fransisco', 'New York', 'Seattle'];
    const skills = ['Laravel', 'Node.js', 'Express', 'Mysql', 'HTML5', 'Mongodb', 'React', 'Vuejs', 'Photoshop', 'Redis'];
    const jobs = [];
    for (let i = 0; i < 219; i++) {
        jobs.push({
            title: faker.lorem.word(),
            type: faker.random.number(4),
            category: categories[Math.floor(Math.random() * categories.length)]._id,
            location: locations[faker.random.number(3)],
            min_salary: 40000,
            max_salary: 120000,
            tags: skills.slice(faker.random.number(7)),
            description: faker.lorem.paragraphs(5),
            posted_by: employers[Math.floor(Math.random() * employers.length)]._id,
            created_at: new Date(),
            status: faker.random.number({ min: 1, max: 2 }),
            freelancer_id: faker.random.number(100) > 30 ? freelancers[Math.floor(Math.random() * freelancers.length)]._id : null,
        });
    }
    return await Job.insertMany(jobs)
};