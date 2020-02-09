const faker = require('faker');

const Review = require('../models/review');

module.exports = async (freelancers, employers, tasks) => {
    const reviews = [];
    freelancers.forEach(fl => {
        for (let i = 0; i < 10; i++) {
            reviews.push({
                reviewer: employers[Math.floor(Math.random() * employers.length)]._id,
                reviewee: fl._id,
                score: faker.random.number({ min: 3, max: 5 }),
                task: tasks[Math.floor(Math.random() * tasks.length)]._id,
                comment: faker.lorem.sentences(2),
                created_at: new Date(),
            });
        }
    });
    const fReviews = await Review.insertMany(reviews);
    const empReviews = [];
    employers.forEach(fl => {
        for (let i = 0; i < 10; i++) {
            reviews.push({
                reviewer: freelancers[Math.floor(Math.random() * freelancers.length)]._id,
                reviewee: fl._id,
                score: faker.random.number({ min: 3, max: 5 }),
                task: tasks[Math.floor(Math.random() * tasks.length)]._id,
                comment: faker.lorem.sentences(2),
                created_at: new Date(),
            });
        }
    });
    const eReviews = await Review.insertMany(empReviews);
    return { fReviews, eReviews };
};