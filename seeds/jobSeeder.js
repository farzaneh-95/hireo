const faker = require('faker');

const Job = require('../models/job');

module.exports = async (categories, employers) => {
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
            status: faker.random.number({ min: 1, max: 4 }),
        });
    }
    return await Job.insertMany(jobs)
};