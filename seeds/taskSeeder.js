const faker = require('faker');
// faker.locale = 'fa';

const Task = require('../models/task');

module.exports = async (categories, employers, freelancers) => {
    const skills = ['Laravel', 'Node.js', 'Express', 'Mysql', 'HTML5', 'Mongodb', 'React', 'Vuejs', 'Photoshop', 'Redis'];
    const tasks = [];
    const locations = ['Los Angeles', 'San Fransisco', 'New York', 'Seattle'];
    for (let i = 0; i < 200; i++) {
        tasks.push({
            name: faker.lorem.words(3),
            employer_id: employers[Math.floor(Math.random() * employers.length)]._id,
            category_id: categories[Math.floor(Math.random() * categories.length)]._id,
            freelancer_id: faker.random.number(100) > 40 ? freelancers[Math.floor(Math.random() * freelancers.length)]._id : null,
            location: locations[faker.random.number(3)],
            min_budget: faker.random.number({ min: 100, max: 300 }),
            max_budget: faker.random.number({ min: 400, max: 800 }),
            budget_type: faker.random.number({ min: 0, max: 1 }),
            skills: skills.slice(faker.random.number(7)),
            description: faker.lorem.paragraphs(8),
            created_at: new Date(),
            status: faker.random.number({ min: 1, max: 4 }),
        });
    }
    return await Task.insertMany(tasks);
};