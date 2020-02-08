const mongoose = require('mongoose');
const faker = require('faker');

const Category = require('./models/category');
const Freelancer = require('./models/freelancer');
const Job = require('./models/job');
const Employer = require('./models/employer');
const Task = require('./models/task');
const Bid = require('./models/bid');
const Review = require('./models/review');

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
                        status: faker.random.number({ min: 1, max: 4 }),
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
                        status: faker.random.number({ min: 1, max: 4 }),
                    });
                }
                Task.insertMany(tasks)
                    .then(tasks => {
                        console.log('Tasks Done');
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
                                success: faker.random.number({ min: 20, max: 100 }),
                                rec: faker.random.number({ min: 50, max: 100 }),
                                onTime: faker.random.number({ min: 50, max: 100 }),
                                onBudget: faker.random.number({ min: 50, max: 100 }),
                            });
                        }
                        Freelancer.insertMany(freelancers)
                            .then(docs => {
                                console.log('Freelancers Done');
                                const bids = [];
                                tasks.forEach(task => {
                                    for (let i = 0; i < 5; i++) {
                                        bids.push({
                                            freelancer_id: docs[Math.floor(Math.random() * docs.length)]._id,
                                            task_id: task._id,
                                            minimal_rate: faker.random.number({ min: task.min_budget, max: task.max_budget }),
                                            delivery_time: {
                                                quantity: faker.random.number({ min: 1, max: 60 }),
                                                type: faker.random.number(1),
                                            },
                                            created_at: new Date(),
                                        });
                                    }
                                });
                                const reviews = [];
                                docs.forEach(fl => {
                                    for (let i = 0; i < 10; i++) {
                                        reviews.push({
                                            reviewer: emps[Math.floor(Math.random() * emps.length)]._id,
                                            reviewee: fl._id,
                                            score: faker.random.number({ min: 3, max: 5 }),
                                            task: tasks[Math.floor(Math.random() * tasks.length)]._id,
                                            comment: faker.lorem.sentences(2),
                                            created_at: new Date(),
                                        });
                                    }
                                });
                                Review.insertMany(reviews)
                                    .then(reviews => {
                                        console.log('Reviews Done');
                                    });
                                    Review.insertMany(empReviews)
                                    .then(reviews => {
                                        console.log('Reviews Done');
                                    });
                                Bid.insertMany(bids)
                                    .then(docs => {
                                        console.log('Bids Done');
                                    });
                                const empReviews = [];
                                empReviews.forEach(fl => {
                                    for (let i = 0; i < 10; i++) {
                                        empReviews.push({
                                            reviewer: docs[Math.floor(Math.random() * docs.length)]._id,
                                            reviewee: fl._id,
                                            score: faker.random.number({ min: 3, max: 5 }),
                                            task: tasks[Math.floor(Math.random() * tasks.length)]._id,
                                            comment: faker.lorem.sentences(2),
                                            created_at: new Date(),
                                        });
                                    }
                                });
                            });
                    });
            });
    });



