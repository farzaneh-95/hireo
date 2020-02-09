const faker = require('faker');

const Freelancer = require('../models/freelancer');

module.exports = async () => {
    const freelancers = [];
    const skills = ['Laravel', 'Node.js', 'Express', 'Mysql', 'HTML5', 'Mongodb', 'React', 'Vuejs', 'Photoshop', 'Redis'];
    const countries = ['USA', 'UK', 'France', 'Spain', 'Germany', 'Sweden'];
    const profilePictures = ['/images/user-avatar-big-01.jpg', '/images/user-avatar-big-02.jpg', '/images/user-avatar-big-03.jpg'];
    for (let i = 0; i < 100; i++) {
        freelancers.push({
            email: faker.internet.email(),
            password: '12345678',
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            skills: skills.slice(faker.random.number(7)),
            minimal_hourly_rate: faker.random.number({ min: 40, max: 100 }),
            nationality: countries[faker.random.number(5)],
            bio: faker.lorem.paragraphs(3),
            rate: faker.random.number({ min: 2, max: 5 }),
            tag_line: faker.lorem.words(2),
            profile_picture: profilePictures[faker.random.number(2)],
            success: faker.random.number({ min: 20, max: 100 }),
            rec: faker.random.number({ min: 50, max: 100 }),
            onTime: faker.random.number({ min: 50, max: 100 }),
            onBudget: faker.random.number({ min: 50, max: 100 }),
        });
    }
    return await Freelancer.insertMany(freelancers)
};