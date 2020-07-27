const faker = require('faker');
// faker.locale = 'fa';

const Review = require('../models/review');

module.exports = async (freelancers, employers, tasks) => {
    const revs = [];
    tasks.forEach(task => {
        if (task.freelancer_id) {
            revs.push({
                reviewer: task.freelancer_id,
                reviewee: task.employer_id,
                task: task._id,
                score: faker.random.number({ min: 2, max: 5 }),
                comment: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. ',
                created_at: new Date(),
            });
            revs.push({
                reviewer: task.employer_id,
                reviewee: task.freelancer_id,
                task: task._id,
                score: faker.random.number({ min: 2, max: 5 }),
                comment: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. ',
                created_at: new Date(),
            });
        }
    });
    return await Review.insertMany(revs);
};