var Drink = require('../models/Drink')
var Venue = require('../models/Venue')

module.exports = {
  index: index,
  selectType: selectType,
  newDrink: newDrink,
  createDrink: createDrink,
  showDrink: showDrink,
  updateDrink: updateDrink,
  destroyDrink: destroyDrink,
  newReview: newReview,
  addReview: addReview
}

function index(req, res, next){
  // Drink.find({},function(err, drinks){
  //   if (err) next(err);
  //
  //   res.json(drinks);
  // });
  var selectedType = req.query.drinkType
  Drink.find({drinkType: selectedType}, function(err, drinks){
    if (err)
      console.log('error occurred in the database');
    res.json(drinks)
  })
}

function selectType(req, res, next){
  res.render('../views/drinks/selectType')
  // return ;
}

function newDrink(req, res){
  Venue.find({}, function(err, venues){
    if (err) next(err);

    // Change to ejs later
    res.render('../views/drinks/new', {venues: venues});
  });

};


function createDrink(req, res) {
  console.log(req.body)
  var drink = new Drink(req.body);
  console.log(drink.venue);
  drink.save(function(err){
    if (err) res.json({message: 'Could not create drink b/c:' + err});
    Venue.findOne({name: drink.venue}, function(err, venue){
      if (err) next(err);
      venue.drinks.push(drink);
      console.log(venue);
      venue.save();
    })
    res.redirect("/drinks");
  });
}

function showDrink(req, res){
  var id = req.params.id;

  Drink.findById({_id: id}, function(err, drink){
    if (err) res.json({message: 'Could not find drink b/c' + err});
    res.json({drink:drink})
  })
}

function updateDrink(req, res){
  var id = req.params.id
  // var id = req.params.drinkType;

  Drink.findById({_id: id}, function(err, drink){
    if(err) res.json({message: 'Could not find b/c' + err});

    if(req.body.drinkType) drink.drinkType = req.body.drinkType;
    if(req.body.alcohol)   drink.alcohol = req.body.alcohol;
    if(req.body.drinkName) drink.drinkName = req.body.drinkName;

    drink.save(function(err) {
      if(err) res.json({message: 'Could not update drink b/c' + err});

      res.json({message: 'Drink successfully updated!'});
    });
  });
}

function destroyDrink(req, res) {
  var id = req.params.id;

  Drink.remove({_id: id}, function(err) {
    if(err) res.json({message: 'Could not destroy drink b/c' + err});

    res.json({message: 'Drink successfully destroyed'});
  });
}

function newReview(req, res){
  var id = req.params.id // get this var to the form <% id %>
  res.render('../views/drinks/addreview', {id: id})
}

function addReview(req, res, next){
  // res.render('../views/newReview')
  Drink.findById(req.params.id, function(err, drink){
    if (err) next(err);
    console.log('drink: ' + drink)
    console.log('reviews: ' + drink.reviews)
    drink.reviews.push(req.body)
    drink.save(function(err) {
      if(err) res.json({message: "Could not add review b/c" + err});

      res.json(drink);
    });
    // only has keys that are properties of reviews
  })
}
