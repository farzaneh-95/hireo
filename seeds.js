const mongoose = require('mongoose');
const faker = require('faker');

const Category = require('./models/category');
const Freelancer = require('./models/freelancer');
const Job = require('./models/job');
const Employer = require('./models/employer');
const Task = require('./models/task');

mongoose.connect('mongodb://127.0.0.1:27017/' + 'hireo_db', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const locations = ['Los Angeles', 'San Fransisco', 'New York', 'Seattle'];
const categories = [
    {
        title: 'Web & Software Dev',
        description: 'Software Engineer, Web / Mobile Developer & More',
    },
    {
        title: 'Data Science & Analitycs',
        description: 'Data Specialist / Scientist, Data Analyst & More',
    },
    {
        title: 'Accounting & Consulting',
        description: 'Auditor, Accountant, Fnancial Analyst & More',
    },
    {
        title: 'Writing & Translations',
        description: 'Copywriter, Creative Writer, Translator & More',
    },
    {
        title: 'Sales & Marketing',
        description: 'Brand Manager, Marketing Coordinator & More',
    },
    {
        title: 'Graphics & Design',
        description: 'Creative Director, Web Designer & More',
    },
    {
        title: 'Digital Marketing',
        description: 'Darketing Analyst, Social Profile Admin & More',
    },
    {
        title: 'Education & Training',
        description: 'Advisor, Coach, Education Coordinator & More',
    },
];
const logos = ['/images/company-logo-01.png', '/images/company-logo-02.png', '/images/company-logo-03.png'];
const profilePictures = ['/images/user-avatar-big-01.jpg', '/images/user-avatar-big-02.jpg', '/images/user-avatar-big-03.jpg'];
Category.insertMany(categories)
    .then(cats => {
        console.log('Categories Done');
        const employers = [];
        for (let i = 0; i < 50; i++) {
            employers.push({
                email: faker.internet.email(),
                password: '12345678',
                name: faker.company.companyName(),
                location: locations[faker.random.number(3)],
                bio: faker.lorem.paragraphs(3),
                logo: logos[faker.random.number(2)],
                rate: faker.random.number({ min: 1, max: 5 }),
            });
        }
        Employer.insertMany(employers)
            .then(emps => {
                console.log('Employers Done');
                const jobs = [];
                for (let i = 0; i < 70; i++) {
                    jobs.push({
                        title: faker.lorem.word(),
                        type: faker.random.number(4),
                        category: cats[Math.floor(Math.random() * cats.length)]._id,
                        location: locations[faker.random.number(3)],
                        min_salary: 40000,
                        max_salary: 120000,
                        tags: ['Laravel', 'Css', 'Javascript', 'Mongodb'],
                        description: faker.lorem.paragraphs(3),
                        posted_by: emps[Math.floor(Math.random() * emps.length)]._id,
                        created_at: new Date(),
                        status: faker.random.number(3),
                    });
                }
                Job.insertMany(jobs)
                    .then(jbs => {
                        console.log('Jobs Done');
                    });
                
                const tasks = [];
                for (let i = 0; i < 73; i++) {
                    tasks.push({
                        name: faker.lorem.words(3),
                        employer_id: emps[Math.floor(Math.random() * emps.length)]._id,
                        category_id: cats[Math.floor(Math.random() * cats.length)]._id,
                        location: locations[faker.random.number(3)],
                        min_budget: faker.random.number({ min: 100, max: 300 }),
                        max_budget: faker.random.number({ min: 400, max: 800 }),
                        budget_type: faker.random.number({ min: 0, max: 1 }),
                        skills: ['Laravel', 'Node.js', 'Express', 'Mysql'],
                        description: faker.lorem.paragraphs(8),
                        created_at: new Date(),
                        status: faker.random.number(3),
                    });
                }
                Task.insertMany(tasks)
                    .then(tsks => {
                        console.log('Tasks Done');
                    });
            });
    });

const freelancers = [];
for (let i = 0; i < 50; i++) {
    freelancers.push({
        email: faker.internet.email(),
        password: '12345678',
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        skills: ['Laravel', 'Node.js', 'Express', 'Mysql', 'HTML5'],
        minimal_hourly_rate: 100,
        nationality: 'USA',
        bio: faker.lorem.paragraph(),
        rate: faker.random.number(5),
        tag_line: faker.lorem.words(2),
        profile_picture: profilePictures[faker.random.number(2)],
    });
}
Freelancer.insertMany(freelancers)
    .then(docs => {
        console.log('Freelancers Done');
    });



