const mongoose = require('mongoose');
const faker = require('faker');

const Category = require('./models/category');
const Freelancer = require('./models/freelancer');

mongoose.connect('mongodb://127.0.0.1:27017/' + 'hireo_db', {
    useCreateIndex: true,
    useNewUrlParser: true,
});

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

for (let i = 0; i < categories.length; i++) {
    const cat = new Category(categories[i]);
    cat.save();
}

for (let i = 0; i < 10; i++) {
    const freelancer = new Freelancer({
        email: faker.internet.email(),
        password: faker.lorem.word(),
    });
    freelancer.save();
}
