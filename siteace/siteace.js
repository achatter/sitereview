Websites = new Mongo.Collection("websites");

if (Meteor.isClient) {

    //Routing
Router.configure({
        layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('navbar',{
      to:'navbar'
  });
  this.render('website_form',{
      to:'addform'
  });  
  this.render('website_list',{
      to:'main'
  });  
}); 

Router.route('/review/:_id', function () {
  this.render('navbar',{
      to:'navbar'
  });
  this.render('website',{
      to:'main',
      data:function(){
          return Websites.findOne({_id:this.params._id});
      }
  });  
}); 
    
	//Account Config
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });
    
    /////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort:{upvoteCount:-1}});
		}
	});
    
    
    Template.body.helpers({username:function(){
    if (Meteor.user()){
      return Meteor.user().username;
    }
    else {
      return "";
    }
  }
  });


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			//console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
            var website = Websites.findOne({_id:website_id});
            if (website.upvoteCount){
                Websites.update({_id:website_id},
                          {$set:{upvoteCount:this.upvoteCount+1}});
            }
            else{
                Websites.update({_id:website_id},
                          {$set:{upvoteCount:1}});
            }
        return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			//console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
            var website = Websites.findOne({_id:website_id});
            if (website.downvoteCount){
                Websites.update({_id:website_id},
                          {$set:{downvoteCount:this.downvoteCount+1}});
            }
            else{
                Websites.update({_id:website_id},
                          {$set:{downvoteCount:1}});
            }
			return false;// prevent the button from reloading the page
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
            var title = event.target.title.value;
			var url = event.target.url.value;
            var description = event.target.description.value;
			
			//  put your website saving code in here!	
           if(Meteor.user()){
                Websites.insert(
                    {
                    "title":title,
                    "url":url,
                    "description":description,
                    "createdOn":new Date(),
                    "createdBy":Meteor.user()._id
                });
            }
			return false;// stop the form submit from reloading the page
		}
	});
    
    	Template.website.events({
		"submit .js-save-website-review-form":function(event){
            
        // console.log(event.target.review.value);
		// get the text out of the textbox:
            var review = event.target.review.value;
			
        //  put your website saving code in here!	
          if(Meteor.user()){
              Websites.upsert(
                    {_id:this._id},{$push:{review:review}
                });
            }
			return false;// stop the form submit from reloading the page
		}
	});
}

if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date(),
            review:[]
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date(),
            review:[] 
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date(),
            review:[]
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date(),
            review:[]
    	});
    }
  });
}
