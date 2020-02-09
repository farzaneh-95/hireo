const Category = require('../models/category');

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

module.exports = async () => {
    return await Category.insertMany(categories);
};
