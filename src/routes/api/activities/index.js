const express = require('express');
const Activity = require('../../../models/Activity');

const router = express.Router();
// Get all activities
router.get('/', (req, res) => {
  const filter = {};
  if (req.query.tags) {
    filter.tags = req.query.tags;
  }
  // "createAt,-startDate"
  const sort = {};
  req.query.sort.spilt(',').forEach((sortField) => {
    if (sortField[0] === '-') {
      sort[sortField.substr(1)] = -1;
    } else if (sortField[0] === '+') {
      sort[sortField.substr(0)] = 1;
    }
  });

  const fields = req.query.fields.replace(',', ' ');

  let query = Activity.find(filter);

  if (sort) {
    query.sort(sort);
  }
  if (fields) {
    query.select(fields);
  }

  if (req.query.limit) {
    query = query.limit(req.query.limit);
  }
  if (req.query.skip) {
    query = query.skip(req.query.skip);
  }

  const activities = query.exec();

  res.json({
    data: activities,
  });
});
//Get activities with sorting
router.get('')
// Get User by specific ID
// Access at GET http://localhost:8080/api/activities/:id
router.get('/:id', (req, res) => {
  // Get User from instance User model by ID
  Activity.findById(req.params.id, (err, act) => {
    if (err) {
      // Handle error from User.findById
      return res.status(404).send('Error 404 Not Found!');
    }

    res.json(act);
  });
});
// Create a new activity
// Access at POST http://localhost:8080/api/activities
router.post('/', (req, res, next) => {
  // Create a new instance of the User model
  const activity = new Activity();

  // Set field value (comes from the request)
  activity.name = req.body.name;
  activity.thumbnialsUrl = req.body.thumbnialsUrl;
  activity.shortDescription = req.body.shortDescription;
  activity.description = req.body.description;
  activity.imgUrl = req.body.imgUrl;
  activity.videoUrl = req.body.videoUrl;
  activity.tags = req.body.tags;
  activity.location = req.body.location;
  activity.faculty = req.body.faculty;
  activity.reservable = req.body.reservable;
  activity.startTime = req.body.startTime;
  activity.endTime = req.body.endTime;

  // Save User and check for error
  activity.save((err, _act) => {
    if (err) {
      // Handle error from save
      next(err);
    }

    res.status(300).json(_act);
  });
});

module.exports = router;
