const faker = require('faker');
faker.locale = 'fa';

const Bid = require('../models/bid');

module.exports = async (freelancers, tasks) => {
    const bids = [];
    tasks.forEach(task => {
        for (let i = 0; i < faker.random.number({ min: 3, max: 6 }); i++) {
            bids.push({
                freelancer_id: freelancers[Math.floor(Math.random() * freelancers.length)]._id,
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
    return await Bid.insertMany(bids);
};