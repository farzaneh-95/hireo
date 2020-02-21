const faker = require('faker');

const Employer = require('../models/employer');

module.exports = async () => {
    const locations = ['تهران', 'مشهد', 'اصفهان', 'کرمان'];
    const logos = ['/images/company-logo-01.png', '/images/company-logo-02.png', '/images/company-logo-03.png'];
    const employers = [];    
    for (let i = 0; i < 50; i++) {
        employers.push({
            email: faker.internet.email(),
            password: '12345678',
            name: faker.company.companyName(),
            location: locations[faker.random.number(3)],
            bio: faker.lorem.paragraphs(8),
            logo: logos[faker.random.number(2)],
            rate: faker.random.number({ min: 2, max: 5 }),
        });
    }
    return await Employer.insertMany(employers);
};