var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var User = mongoose.model('User');

module.exports = (function(){
	return {
		addEvent: function(req, res){
			var events = new Event(req.body);
  			events.save(function(err, record){
  				if(err){
  					res.json({status:'failed', err:err})
  				}
  				else{
  					User.update({email: req.body.email}, {$inc: { events: 1 }}, {multi: true}, function(err1, record1) {
		  				if(err){
		  					res.json({status:'failed', err:err})
		  				}
		  				else{
		  					res.json({status:'success'})
		  				}
		  			})
  				}
  			})
		},
		getEvents: function(req, res){
			Event.find({}).populate('comments').populate('comments.user').populate('user').populate('attenders').exec(function(err, events){
				    res.json(events);
      })
		},
		getEventsById: function(req, res){
			console.log(req.params.id);
      Event.find({user:req.params.id}).populate('comments').populate('comments.user').populate('user').exec(function(err, events){
				console.log('here i am',events);
				    res.json(events);
			})
		},
  		getEventById: function(req, res)	{
        	Event.find({_id:req.params.id}).populate('comments').populate('comments.user').populate('user').exec(function(err, events){
              console.log(events);
  				    res.json(events);
        	})
	    },
	    attendEvent: function(req, res){
	    	console.log(req.body, ' user in server');
	    	Event.findOne({_id:req.params.id}, function(err, result){
	    		result.attenders.push(req.body);
	    		result.save(function(err){
		          res.json(err);
		          if(err){
		            res.json({err: err});
		          } else {
		            res.json(true);
		          }
		        })
	    		// console.log(result, 'event got back from server');
	    	})
	    	// console.log(req.params.id, 'current event id');
	    	// console.log(req.body, 'in event controller server');
	    }
  }
})();
