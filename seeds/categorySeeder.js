const Category = require('../models/category');

const categories = [
    {
        title: 'توسعه وب و نرم‌افزار',
        description: 'مهندسی نرم‌افزار و توسعه موبایل',
    },
    {
        title: 'علم داده و آنالیز',
        description: 'متخصص، تحلیلگر داده',
    },
    {
        title: 'حساب‌داری و مشاوره',
        description: 'تحلیلگر مالی، حسابدار، بازرسی',
    },
    {
        title: 'نویسندگی و ترجمه',
        description: 'مترجم',
    },
    {
        title: 'مارکتینگ و فروش',
        description: 'مدیر برند، هماهنگی مارکت',
    },
    {
        title: 'طراحی و گرافیک',
        description: 'طراحی وب',
    },
    {
        title: 'دیجیتال مارکتینگ',
        description: 'تحلیلگر مارکت، مدیر مارکت',
    },
    {
        title: 'آموزش',
        description: 'مربی',
    },
];

module.exports = async () => {
    return await Category.insertMany(categories);
};
