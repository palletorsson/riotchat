var Avatars = new Meteor.Collection("avatars");
var Messages = new Meteor.Collection("messages");
var Meta_setting = new Meteor.Collection("meta_setting");
var Gameboard = new Meteor.Collection("gameboard");
var Game = {};
var Settings = {};
var HandleMessage = {}; 
var restart; 

// Routers 
Router.configure({
		layout: 'layout', 
		loadingTemplate: 'loading', 
		notFoundTemplate: 'notFound'
	}); 
	
Router.map(function () {
	this.route('message/:_message/user/:_user', {
		  where: 'server',
		  action: function() {
			 var mess = "user: " + this.params._user + " message: " + this.params._message; 
			 Messages.insert({
								name: this.params._user,
								owner: 1234,
								message: this.params._message,
								avatar_img: 'default_avatar.png', 
								time: Date.now(),
							});
			 this.response.end(mess);
		  }
		})
	});
	


// Allow methods 

Gameboard.allow({
	insert: function (userId, doc) {
		return (userId); 	
	},
	update: function (userId, docs) {
		return (userId);
	},
	remove: function () {
		return false; 
	}
});

Messages.allow({
	insert: function (userid, doc) {
		return (userid && doc.message.length < 1000); 
	},
	update: function () {
		return false; 
	},
	remove: function () {
		return false;
	}
});

Meta_setting.allow({
	insert: function (userId, doc) {
		return (userId && doc.topic.length < 60);
	},
	update: function (userId, docs, fields, modifiers) {
		return _.all(docs, function(doc) {
				return docs.topic.length < 60;
		}); 
	},
	remove: function () {
		return true; 
	}
});

Avatars.allow({
	insert: function (userId, doc) {
		return (userId); 
	},
	update: function(userId, docs, fields, modifiers) {
		return _.all(docs, function(doc) {
				return docs.avatar_id === userId;		
		}); 
	},
	remove: function () {
		return false; 
	}
});



if (Meteor.isClient) {

	Meteor.startup(function () {

		// Settings
		Settings.encryption = false;
		Settings.create_game = false; 
		Settings.remove_game = false;

		if (Settings.create_game) {
			Meteor.call('create_gameboard');
		}

		if (Settings.remove_game) {
			Meteor.call('remove_gameboard');
		}

		// Game
		Game.gridOffsetY = 70;
		Game.gridOffsetX = 70;
		
		Game.playerOffsetY = 230; // top to bottom
		Game.playerOffsetX = 30; // left to right

		Game.network = {}
		
		Game.center_work = {}
		Game.broccoli_kopimi_num = 0; 
		Game.broccoli_kopimi = {
			0:" Datalove", 
			1:" Obtain the Internet",
			2:" Start using IRC",
			3:" Group and birth a site",
			4:" Experiment with research chemicals",
			5:" Design a three-step program",
			6:" Take a powerful stance for something positive and essential",
			7:" Regulate nothing",
			8:" Say that you have to move in two weeks, but stay for seven months, Come back a year later and do it all over again",
			9:" ROTFLOL",
			10:" Relax: you’re already halfway there",
			11:" Just kidding",
			12:" Don’t think outside the box. Build a box",
			13:" Support support",
			14:" Organize and go to parties and fairs",
			15:" Start 3–4 blogs about the same things",
			16:" Drain the private sector of coders, graphic artists and literati",
			17:" Create a prize that is awarded",
			18:" Express yourself often in the media, vaguely",
			19:" Spread all rumors",
			20:" Seek out and try carding and travel by expensive trains, Don’t order sushi",
			21:" Start a radio station",
			22:" Everything you use you can copy and give an arbitrary name, whether it’s a news portal, search engine or public service",
			23:" Buy a bus",
			24:" Install a MegaHAL",
			25:" Make sure that you are really good friends with people who can use Photoshop, HTML, databases, and the like",
			26:" Read a shitload of philosophy",
			27:" Give yourself cult status, and act accordingly",
			28:" Never aim",
			29:" Pick on everyone",
			30:" Invent or misuse Kopimi",
			31:" Do things together as a composition, not as a collective",
			32:" Make your advertising confusingly similar to that of established ventures",
			33:" Always act with intent",
			34:" Assert, in any context, that the establishment is lagging",
			35:" When criticized, blame others and refer to the cluster formation’s non-linear time-creating swarm hierarchy",
			36:" Send everything to all media, regardless of niche",
			37:" Start an anonymous confession venture",
			38:" Make babies and blog their upbringing",
			39:" Be sure to closely study and keep abreast with substances",
			40:" Participate in lively Internet discussions that don’t interest you",
			41:" Start at least three to four IRC channels about every project",
			42:" Fight and make up often",
			43:" Share files with anyone who wants them",
			44:" Deal often with humor sites",
			45:" Hang out with the Left, the Right and the Libertarians",
			46:" See “23” in everything",
			47:" Flirt with money",
			48:" Be AFK very little",
			49:" Threaten large American culture corporations",
			50:" Broadcast radio from Skäggetorp",
			51:" Make a “1 list” for successful projects",
			52:" Be unsure what the list should be named",
			53:" Take upon yourself a lot of projects",
			54:" Make sure to be connected to technical, aesthetical, and philosophical people of world class competence",
			55:" Sleep over at each others houses regularly",
			56:" Publish a book about Kopimi",
			57:" At a trial, deny everything",
			58:" Cultivate unfounded myths and react to them",
			59:" Hack sites, e-mail accounts and more",
			60:" Continuously mock and ridicule all aspects of copyright",
			61:" Create an Internet site where people can buy and sell votes in democratic elections",
			62:" Claim to be true, fair and satisfied",
			63:" Collect money for fraux’s trip to Iceland",
			64:" Confidently claim that all disconnected computers are broken",
			65:" Do NOT go to Kurdistan",
			66:" Make sure to thoroughly establish the claim that all hardware is overpriced",
			67:" Affirm all words and signs",
			68:" Mindfuck each other to appropriate extent",
			69:" Take care of small animals",
			70:" Create and spiritualize the concept of “Snel hest",
			71:" Start and own a think-tank",
			72:" Deny magnetism",
			73:" Start a business school, Drop out",
			74:" Write press releases often",
			75:" Use IRC while in your underwear and eat pizza",
			76:" Juggle with other people’s balls",
			77:" Ensure that there is no conclusive evidence of Ikko giving monki advertising money by means of volada’s helicopter",
			78:" Cause inflation and a global financial crisis",
			79:" Express yourself vaguely if anyone asks you: 'How much is a bandwidth?'",
			80:" Use 'dynamic' to mean 'completely out of control'",
			81:" Never mention Hotmail, MSN or Windows",
			82:" Have all project meetings on IRC",
			83:" Claim to receive around 1256 e-mails a day",
			84:" Force a prosecutor to draw up several thousand pages of drivel",
			85:" Above all abstract everything",
			86:" Have a liberal vision of hell",
			87:" Consider yourself overly qualified for top positions in American film and music industries",
			88:" Create the world’s largest file-sharing service in a twinkling",
			89:" Attract international attention by accident",
			90:" Control the portal and opinion makers in all mediums",
			91:" Standardize and explain your way of doing things at all levels",
			92:" Have 3576 anonymous confessions on your hard drive, Including the authors’ IP addresses and personal information",
			93:" Preserve the Internet",
			94:" Mention the Internet as a source in serious discussions",
			95:" Rarely mention reasons for your IT elitism",
			96:" Dismiss expressions like “from farm to table” as superstition",
			97:" Follow the yellow fellow",
			98:" Skip the last points of your 100 point list",
			99:" Establish social services as a parody of antisocial services",
			101:" Start from scratch",
			102:" Be careful of burning kittens",
			103:" Write a book. but start with the back cover",
			104:" Use parables in abundance. preferably about “butter” and “snow”",
			105:" Stop using IRL, Use AFK instead",
			106:" Cultivate contacts within the powers of state intelligence services",
			107:" Always define “flat organization” arbitrarily, subjectively and without common sense",
			108:" Upload",
			109:" Take over #g-d",
			110:" PROFIT",
		}
		
		
		Game.grid = {
				width: 18,
				height: 18
			}
 
		Game.tile = new Image();
		Game.tile.src = "/img/green.png";

		Game.space = new Image();
		Game.space.src = "/img/space_5.jpg";

		Game.dirt = new Image();
		Game.dirt.src = "/img/dirt.png";

		Game.green = new Image();
		Game.green.src = "/img/green.png";

		Game.green_current = new Image();
		Game.green_current.src = "/img/green_current.png";		

		Game.copy_me = new Image();
		Game.copy_me.src = "/img/copytile_iso_.png";

		Game.copy_me_avatar = "/img/droid-evanroth-occupy.gif";

		Game.copy_me_1 = new Image();
		Game.copy_me_1.src = "/img/copytile_iso1.png";

		Game.copy_me_2 = new Image();
		Game.copy_me_2.src = "/img/copytile_iso2.png";
				
 		Game.black = new Image();
		Game.black.src = "/img/dark.png";
 
 		Game.black_2 = new Image();
		Game.black_2.src = "/img/dark_part.png";
		
		Game.dark = new Image();
		Game.dark.src = "/img/black_current.png";

		Game.red = new Image();
		Game.red.src = "/img/red.png";
		
		Game.eye = new Image();
		Game.eye.src = "/img/eye_tran.png";
		
		Game.red_marker = new Image();
		Game.red_marker.src = "/img/copytile_current.png";
		
		Game.black_marker = new Image();
		Game.black_marker.src = "/img/dark_cur.png";
		
		Game.positionX_net_previous = 0; 
		Game.positionY_net_previous = 0;


		Game.resetTileCount = function() {
			Game.tiles_green = 0; 
			Game.tiles_bad = 0; 
			Game.tiles_copy_me = 0; 
			Game.tiles_natural = 0; 
		}
		
		Game.resetTileCount(); 
		Game.your_avatar_id = "";
		Game.evil_eye = false; 
		Game.winscore = 66; 
		

		Game.draw = function(tileMap, the_bad, the_copyme) {							   	
			Game.c.clearRect (0, 0, Game.c.width, Game.c.height);

			var i = 0; 
			for (var row = 0; row < Game.grid.width; row++) {
				for (var col = 0; col < Game.grid.height; col++) {
					
					var tilePositionX = (row - col) * Game.tile.height;

					// Center the grid horizontally
					tilePositionX += (Game.canvas.width / 2) - (Game.tile.width / 2);

					var tilePositionY = (row + col) * (Game.tile.height / 2);

					/* 	
					 * null is untouched 
					 * 1 is player current postion 
					 * 2 is step by player, light green previously allocated  
					 * 3; big good IA
					 * , 4, 5 is good IA
					 * 7: low drak bad IA
					 * 8: high dark bad IA 
					 * 9: unused
					 * 10 - 20 environment    			 
					 */
					if(tileMap) {
						if ( tileMap[row] != null && tileMap[row][col] != null) {
							
							if ( tileMap[row][col] == 1 ) {
								Game.tiles_green = Game.tiles_green + 1; 
								Game.c.drawImage(Game.green, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							} else if ( tileMap[row][col] == 2 ) {
								Game.tiles_green = Game.tiles_green + 1; 
								Game.c.drawImage(Game.green_current, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
								Game.tiles_copy_me = Game.tiles_copy_me + 0.1; 
							} else if ( tileMap[row][col] == 5) {
								Game.tiles_copy_me = Game.tiles_copy_me + 1.5; 
								Game.c.drawImage(Game.copy_me, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);
								var newItem = i;	
								Game.network[newItem] =  { "positionX": Math.round(tilePositionX)+32, "positionY":Math.round(tilePositionY)+32  };
							} else if ( tileMap[row][col] == 3 ) {
								Game.tiles_copy_me = Game.tiles_copy_me + 1; 
								Game.c.drawImage(Game.copy_me_1, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							} else if ( tileMap[row][col] == 4) {
								Game.tiles_copy_me = Game.tiles_copy_me + 0.5; 
								Game.c.drawImage(Game.copy_me_2, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);
							} else if ( tileMap[row][col] == 8 ) {
								Game.c.drawImage(Game.black, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
									
								var newItem = i;	
								Game.center_work[newItem] =  { "positionX": Math.round(tilePositionX)+32, "positionY":Math.round(tilePositionY)+32  };
								Game.tiles_bad = Game.tiles_bad + 0.2; 					
							} else if ( tileMap[row][col] == 7 ) {
								Game.c.drawImage(Game.black_2, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);						
								Game.tiles_bad = Game.tiles_bad + 0.1; 
							} else if ( typeof (tileMap[row][col]) == "string"  ) {
								Game.c.drawImage(Game.green_current, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
								Game.tiles_green = Game.tiles_green + 1; 
							} else if (tileMap[row][col] == 11 ) {
								Game.c.drawImage(Game.red, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
								 
							} else  {
								Game.c.drawImage(Game.red, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							}
						} else {
							Game.c.drawImage(Game.dark, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							Game.tiles_natural = Game.tiles_natural + 1; 
						}
						i = i + 1; 	
						if(the_copyme) {
							if ( row == the_copyme[0] && col == the_copyme[1]) {
								Game.c.drawImage(Game.red_marker, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);
								the_copyme = false; 	
							} 
						}
						if(the_bad) {
							if ( row == the_bad[0] && col == the_bad[1]) {
								Game.c.drawImage(Game.black_marker, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
								the_bad = false; 
							} 
						}

					}
				}
			}
					
		Game.network = _.shuffle(Game.network);

		Game.c.lineWidth = 2;

		Game.c.strokeStyle= 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',0.2)'; 
		Game.c.beginPath()
		
		var rand_pos_net = Math.floor((Math.random()*6)-3);
	
		$.each(Game.network, function( index, value ) {
			if (index == 0) {
				Game.c.moveTo(value.positionX, value.positionY);
			}
			Game.c.lineTo(value.positionX+32+rand_pos_net, value.positionY-16+rand_pos_net);			
		});	
		Game.c.closePath();
		Game.c.stroke();
		
		Game.network_temp = Game.network;
		
		Game.network = {}
		if (Game.evil_eye) {
			Game.c.strokeStyle='rgba(119,136,153,0.2)';  
	 
			Game.c.beginPath()
			var rand_pos_center = Math.floor((Math.random()*200)+600); 
			Game.c.drawImage(Game.eye, rand_pos_center-32, rand_pos_center-48);	
			$.each(Game.center_work, function( index, value ) {
				Game.c.moveTo(rand_pos_center, rand_pos_center);
				Game.c.lineTo(value.positionX+32, value.positionY-16);			
			});	
			Game.c.closePath();
			Game.c.stroke()
						
			Game.center_work = {}
		}
			
		if(Math.floor((Math.random()*10)-1)%3 == 0) {
			Game.broccoli_kopimi_num++; 
		}
		var all = Game.tiles_bad + Game.tiles_green + Game.tiles_copy_me; 
		var good = ((Game.tiles_copy_me - Game.tiles_bad) / all) * 100;

		if (good > Game.winscore) {	
			$(".disabling").show().html("<h5>Datalove: We won! Just kidding, Lets take the battle to the next level. Kopimi!</h5>"); 
			$(".score_board").html("<h5>Datalove: We won! Just kidding, Lets take the battle to the next level. Kopimi!</h5>"); 
			Meteor.setTimeout(function(){				
				Meteor.call('remove_gameboard');
				Meteor.call('create_gameboard');
				$(".disabling").hide(); 
			}, 5000);	
			
		} else {	
			$(".score_board").html("<h3>Datalove: "+good.toFixed(2)+ "% | "+ Game.broccoli_kopimi[Game.broccoli_kopimi_num]) +"</h3>"; 	
		}
		
		if (Game.broccoli_kopimi_num > 110) {
				Game.broccoli_kopimi_num = 0; 
		}
		
	
		Game.tiles_natural = 0; Game.tiles_bad = 0; Game.tiles_green = 0; Game.tiles_copy_me = 0;
		var id = Game.your_avatar_id;
		var html_= '<img src="img/marker.png" />'; 
		var element_ = $("#div_"+id+ " .indicator_img_div");
		
		element_.html('<img src="img/marker_.png" />'); 
	}
		
		Game.shuffle = function(array)  {
		   for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		}
		
		Game.init_interval = true;
		 							   	
		Game.ismoving = true; 
		Game.pausId = 0;
		Game.timoutGameId = 0;
		Game.animate_players = function() {
				Meteor.setTimeout(function(){
					Game.pausId = Meteor.setInterval(function(){
						Game.c.strokeStyle= 'rgba('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+',0.5)'; 
		
						Game.network_temp = _.shuffle(Game.network_temp);

						var rand_pos_net = Math.floor((Math.random()*6)-3);
						Game.c.beginPath()
					
						$.each(Game.network_temp, function( index, value ) {
							if (index == 0) {
								Game.c.moveTo(value.positionX, value.positionY);
							}
							Game.c.lineTo(value.positionX+32+rand_pos_net, value.positionY-16+rand_pos_net);			
						});
							
						Game.c.closePath();
						Game.c.stroke();	
					}, 1300);
					Game.ismoving = false; 
					clearTimeout(Game.timeoutGameId); 
				}, 23000);
				if (Game.ismoving) {
					clearTimeout(Game.timeoutGameId);   
					clearInterval(Game.pausId);
					Game.pausId  = 0;
					Game.timoutGameId = 0;
				} 	
			}
		
 		//Messages
		HandleMessage.ScrollDown = function() {
			var chatDiv = $(".messages");
			chatDiv.scrollTop(chatDiv.prop("scrollHeight"));
		}; 		
		
		Game.urlify = function(text) {
			if (text) {
				var urlRegex = /(https?:\/\/[^\s]+)/g;
				return text.replace(urlRegex, function(url) {
					return '<a href="' + url + '"  target="_blank">' + url + '</a>';
				})
			}
		}; 
		
		Meteor.setTimeout(function(){
			var is_settings = Meta_setting.findOne({ _id: "1"});
			if (!is_settings) {
				Meta_setting.insert({ _id: "1", topic:'piracy is fun', channel: "riotchat" });
			}
		}, 3000);		
		if (Settings.encryption) {
			HandleMessage.helpEnc = function(message) {
				return message.ciphertext.toString(CryptoJS.enc.Base64);
			}

			HandleMessage.helpDec = function (message) {
				return CryptoJS.enc.Base64(message);
			}
		}
	
		Session.set("showchat", true); 
		
		
	});

 
	// check if user has avatar 
	Deps.autorun(function () {
	  if (Meteor.userId()) {
		var user = Meteor.user();
		var id = Meteor.userId();
		var users_avatar = Avatars.findOne({avatar_id: id});
		if (users_avatar) {
			Session.set("avatar", true);
			Game.your_avatar_id = users_avatar.avatar_id;  
		} else {
			Session.set("avatar", false);
		}
	  }
	});

	// Gameboard functions: 
	Meteor.subscribe("gameboard");

	Template.gameboard.gameboard = function () {
		game = Gameboard.findOne({});	
		if(game) { 
			return game;		
		}
	}	
	
	Meteor.autosubscribe(function(){
    Gameboard.find({}).observe({
      changed: function(item){
        	Meteor.call('get_gameboard', function(err, data) {
				if (err) {
					console.log(err);
				} else {
				var gamemap = data;	
				tileMap = gamemap.board;
				Game.draw(tileMap, data.the_bad, data.the_copyme); 
				}
			}); 
      }
    });
  });
	
	Handlebars.registerHelper("board_key", function(board) {
		if(board) { 
			return board; 
		}  
	});		
	
	Template.gameboard.rendered = function () {
	   Meteor.call('get_gameboard', function(err, data) {
			if (err) {
				console.log(err);
			} else {
				var gamemap = data;	
				tileMap = gamemap.board;
				if (tileMap) {
					Game.draw(tileMap, data.the_bad, data.the_copyme); 
				}
				$(".disabling").hide(); 
			}
		});
		Game.canvas = document.getElementById('myCanvas');
		Game.c = Game.canvas.getContext('2d');

		Game.topBoundary = Game.gridOffsetY;
		Game.buttomBoundary = Game.canvas.height / 2 + 500;
		Game.leftBoundary = 100;
		Game.rightBoundary = Game.canvas.width;
		
	}
	
	Template.gameboard.events({ 	
		
 		'click .the_canvas': function(e) {	
			if (e.pageY > Game.topBoundary && e.pageY < Game.buttomBoundary && e.pageX > Game.leftBoundary && e.pageX < Game.rightBoundary ) {
	 			if (Meteor.userId()) {
						var user = Meteor.user();
						var avatar = Avatars.findOne({avatar_id: user._id});
		
						if(avatar) {

						// Take into account the offset on the X axis caused by centering the grid horizontally

						Game.gridOffsetX = (Game.canvas.width / 2) - (Game.tile.width / 2);

						var cX = e.clientX || e.pageX; 
						var cY = e.clientY || e.pageY; 
						
						var col = (cY - Game.gridOffsetY) * 2;
					
						col = ((Game.gridOffsetX + col) - cX) / 2;
						var row = ((cX + col) - Game.tile.width) - Game.gridOffsetX;
		
						row = Math.round(row / Game.tile.height);
						col = Math.round(col / Game.tile.height);
						
						// Check the boundaries!
					
						
						if (row >= 0 && 
							col >= 0 && 
							row <= Game.grid.width &&
							col <= Game.grid.height) {			
							Game.c.width  = $( window ).width();
							Game.c.height = $( window ).height();

		
		 					last_player_row = avatar.last_player_row || 4; 
 							last_player_col = avatar.last_player_col || 4; 

							var clickY = e.pageY; 
							var clickX = e.pageX; 
							var position_y_top = clickY-Game.playerOffsetY; 
							var position_x_left = clickX-Game.playerOffsetX;	
									 
							
							Meteor.call('moveAi', row, col, avatar._id, last_player_row, last_player_col, position_y_top, position_x_left, function(err, data) {
								if (err) {
									console.log(err);
								} else {
									Game.draw(data.board, data.the_bad, data.the_copyme);
								}
							});
							// Game.ismoving = true; 
					
						}
					
					} else {
						console.log("make yourself an avatar")
					}

				} 
			}
		}, 
		
	}); 
										
	// Meta function: 
	Meteor.subscribe("meta_setting");
	
	// Messages function: 
	Template.meta_setting.meta = function () {	
		var meta = Meta_setting.findOne({});
		if (meta) { 	
			return meta;
		}
	};
	
	Meteor.subscribe("messages");

	Template.messages.rendered = function () {
 		Meteor.setTimeout(function(){
			HandleMessage.ScrollDown() 
			$("#message").focus(); 
		}, 1000); 
	}

	Template.messages.messages = function () {	
		if (Settings.encryption) {
			var today = new Date;
				today = today.valueOf();
			var yesterday = new Date
			    yesterday = yesterday.setDate(yesterday.getDate()-1)
				yesterday = yesterday.valueOf();
				
			var items = Messages.find({}, {sort: {time : -1}, limit: 100 }, {time: {$lt: yesterday}}).fetch();
			items = items.sort(function(a,b) { return parseInt(a.time) - parseInt(b.time) } );		
			var take_secret = Session.get("visable_secret");
			items.forEach( function(item) { 

 				try {
                    message = {ct : item.message, iv: item.iv, s:item.s}; 
					message = JsonFormatter.parse(message); 
					var decrypted = CryptoJS.AES.decrypt(message, take_secret, { format: JsonFormatter });
					var new_message = decrypted.toString(CryptoJS.enc.Utf8); 
					item.message = new_message;
                } catch (err) {
					console.log("Failure in toString(CryptoJS.enc.Utf8): " + err.message);
                }
	   			
			});

			
			items.forEach(function(item) {
				// item.message = Game.urlify(item.message); 
			});
			return items; 

		} else {
			
			var items = Messages.find({}, {sort: {time : -1}, limit: 40 }).fetch();
			if (items) {
				items = items.sort(function(a,b) { return parseInt(a.time) - parseInt(b.time) } );
				items.forEach(function(item) {
					item.message = Game.urlify(item.message); 
				});
				if (items.length > 0) { 
					var eml = $("#msg_"+items[items.length - 1].owner); 
					eml.html("<div class='example-number'>"+items[items.length - 1].message+"</div>");
				}
				
				return items; 
				
			} else {
				return {}; 
			}
		}
	};

	
	Template.messages.events({
	  	'click .removemessage': function () {
			Messages.remove(this._id);
	  	}, 
		
		});

	// show and hide chat
	Template.chat.showchat = function () {
			return Session.get("showchat"); 
		}

	Template.chat.irc_mode = function () {
		return Session.get("irc_mode"); 
	}
	
	Template.chat.talk_to_omnihal = function () {
		return Session.get("talk_to_omnihal"); 
	}
	
	Template.chat.events({
		'click a#showchat': function (e, t) {
				Session.set("showchat", true);	
				Session.set("irc_mode", false);
				$(".messages").removeClass( "expanded" )
				$('.chat_form').removeClass( "irc" );
				$('.divider').show();		
				HandleMessage.ScrollDown();
			},
		'click a#irc_mode': function (e, t) {	
				Session.set("irc_mode", true);
				$(".messages").removeClass( "sized" ).addClass( "expanded" );
				$('.chat_form').addClass( "irc" );			
			},
		'click a#hidechat': function (e, t) {
				Session.set("showchat", false);
				Session.set("irc_mode", false);
			},
		'click a#onmiHal': function (e, t) {
			Session.set("talk_to_omnihal", true); 	
			$(".ask_omni").focus(); 		
		},  
		'click a#remove_omni': function (e, t) {
			Session.set("talk_to_omnihal", false); 
		}, 
		'keydown input#ask_omni' : function (e, t) {
    		if (e.which == 13) {
				element = t.find("#ask_omni");	
				Meteor.call('fetchFromService', element.value, function(err, respJson) {
					if(err) {
						console.log("error occured on receiving data on server. ", err );
						answer_element = t.find("#omni_answer");
						$(answer_element).html("I'm asleep, please checkin later...");
						Meteor.setTimeout(function() {
							$(element).val('');
						}, 4000);
					} else {
						answer_element = t.find("#omni_answer");
						$(answer_element).html("").html(respJson.answer);
						Meteor.setTimeout(function() {
							$(element).val('');
						}, 2000);													
					}				
				});
				element.value = ""; 
				return false;
			} 
		}
	});


	Template.chat.rendered = function () { 
		Meteor.setTimeout(function(){
			HandleMessage.ScrollDown() 
			$("#message").focus(); 
		}, 2000); 
	
	};  	

	Handlebars.registerHelper("prettifyDate", function(timestamp) {
		formated = new Date(timestamp).toString();
		formated_time = formated.substring(16,21);
		formated_date = formated.substring(4,10);
		formated = formated_date + " | " + formated_time;
		return formated; 
	});		

	Template.chat_message.events({
	    'keydown' : function (e, t) {
    		if (e.which === 13) { 			
				var user = Meteor.user(),	
				avatar = Avatars.findOne({avatar_id: user._id}),
				avatar_img = "default_avatar.png",
				username = user.username || "_nano",
				message_form = e.target;
				
				HandleMessage.message = message_form.value 
				
				if (HandleMessage.message.length > 1 && $.trim(HandleMessage.message) != '') {	
				
					if(avatar) {														
						avatar_img = avatar.avatar_img;
						username = avatar.avatar_name;	
						
						if (username.trim() == '') {			 
							username = user.profile.name || "_nano";
						}
						
						if (avatar_img.trim() == '') {
							avatar_img = "default_avatar.png";
						}
															
					} 

				
					if (HandleMessage.message.trim()[0] == "/") {			
						var splited = HandleMessage.message.split(" "); 
						if (splited[0] == "/topic") {
							var topic = ''; 
								for (var j = 1; j < splited.length; j++) {
									topic = topic + " " + splited[j]; 
								}
								Meta_setting.update({_id: "1"}, { $set: {topic: topic}}); 
								HandleMessage.message = '';
								message_form.value = '';
						} else if (splited[0] == "/omnihal") {
							var question = ''; 
								for (var g = 1; g < splited.length; g++) {
									question = question + " " + splited[g]; 
								}					
							Meteor.call('fetchFromService', question, function(err, respJson) {
								if(err) {
									console.log("error occured on receiving data on server. ", err );
									message_form.value.val("I'm asleep, please checkin later...");
									Meteor.setTimeout(function() {
										message_form.value = '';
									}, 1000);
								} else {
									var msg = "/omnihal: "+respJson.question; 
									
									Messages.insert({
										name: username,
										owner: user._id,
										message: msg,
										avatar_img: avatar_img, 
										time: Date.now(),
									});
									var omni_msg = username + ": "+respJson.answer;
									Messages.insert({
										name: "omnihal",
										owner: user._id,
										message: omni_msg,
										avatar_img: "omni.gif", 
										time: Date.now(),
									});
									
									Meteor.setTimeout(function() {
										message_form.value = '';
									}, 1000);													
								}
							});
							HandleMessage.message = ''
						} else {
							HandleMessage.message = ''
						}
					} // end of console 
									
					if (HandleMessage.message.length > 1) {
						if (Settings.encryption) {
							var make_secret = Session.get("visable_secret") || "copyriot";
							var encrypted = CryptoJS.AES.encrypt(HandleMessage.message, make_secret, { format: JsonFormatter });
							var json = JsonFormatter.stringify(encrypted)	
							Messages.insert({
								name: username,
								owner: user._id,
								s: json.s, 
								iv: json.iv,
								message: json.ct,
								avatar_img: avatar_img, 
								time: Date.now(),
							});

						} else {
							Messages.insert({
								name: username,
								owner: user._id,
								message: HandleMessage.message,
								avatar_img: avatar_img, 
								time: Date.now(),
							});
						}		
					}
					message_form.value = '';
					Meteor.setTimeout(function(){
							HandleMessage.ScrollDown() 
							$("#message").focus(); 
						}, 500); 
						
       	     	} else {	
					
				} // end of to short message

    		} //end of keydown 13
		} // end of keydown

	}); // end of chat events

	// Avatar function:
	Meteor.subscribe("avatars");

	Template.avatar_choose.avatars = [
		{name: "brad-downey-occupy", type:"gif"},
		{name: "dino-evanroth-occupy", type:"gif"},
		{name: "headless-evanroth-occupy", type:"gif"},
		{name: "pow-evanroth-occupy", type:"gif"},
		{name: "retake-public-domain_telegramsam", type:"jpg"},
		{name: "aram-bartholl-occupy", type:"gif"},
		{name: "gdance-evanroth-occupy", type:"gif"},
		{name: "hula", type:"gif"},
		{name: "olia-dragan-2-occupy", type:"gif"},
		{name: "occupy-net-evanroth-02", type:"gif"},
		{name: "mark-jenkins-occupy", type:"gif"},
		{name: "jesus-evanroth-occupy", type:"gif"},
		{name: "unicorn-evanroth-occupy", type:"gif"},
		//{name: "occupy_everything", type:"gif"},
		{name: "systaime", type:"gif"},
		{name: "dog", type:"gif"},
		{name: "moonwalk-evanroth-occupy", type:"gif"},
		{name: "peretti-occupy-2", type:"gif"},
		{name: "snoop-evanroth-occupy", type:"gif"},
		{name: "olia-dragan-occupy", type:"gif"},
		{name: "jeanluc-evanroth-occupy", type:"gif"},		
		{name: "chunli-evanroth-occupy", type:"gif"},
		{name: "nyan_cat", type:"gif"},
		{name: "olia-dragan-occupy", type:"gif"}, 
		{name: "banana-evanroth-occupy", type:"gif"}, 
		{name: "beyonce", type:"gif"},
		{name: "bugs_troll_mrqmarx", type:"gif"},
		{name: "bowlers-evanroth-occupy", type:"gif"},
		{name: "classwar-ahead_goulassoflosy", type:"gif"},
		{name: "cxzy-dear-maslow-2", type:"gif"},
		{name: "bowlers-evanroth-occupy", type:"gif"},
		{name: "denkmaltanzoccupy", type:"gif"},
		{name: "doucheCat", type:"gif"},
		{name: "dumpfm-LCKY-capitalismidgi_trans", type:"gif"},
		{name: "enough-is-enough", type:"gif"},
		{name: "frodo-evanroth-occupy", type:"gif"},
		{name: "graceypoo-Protest-Gif_gracemcevoy", type:"gif"},
		{name: "greencybergothoccupy", type:"gif"},
		{name: "occupyinternet", type:"gif"},
		{name: "occupyinternet2", type:"gif"},
		{name: "occupy-net-evanroth-03", type:"gif"},
		{name: "oohla-occupy", type:"gif"},
		{name: "snoop-evanroth-occupy", type:"gif"},
		{name: "telegram-sam", type:"gif"},
		{name: "txt-minimi_makemoney", type:"gif"},
		{name: "wPEWe", type:"gif"},
	]


	Template.avatarForm.avatar = function () {
		return Session.get("avatar"); 
	}

	Template.avatar_choose.events ({ 
		'click .choose_avatar': function(e, t) { 			
			var avatar_img = e.currentTarget.name; 
			var targeted = $("#avatar_image_input").val(avatar_img);	 
			var img = $("img#form_img_chosen");
			image_name="img/"+avatar_img; 
			img.attr("src", image_name); 
			$("#"+e.currentTarget.id).css("background-color", "yellow");
		}
	});

 	
	Template.avatarList.avatars = function () {
		avatars = Avatars.find({moved: true}); 
		return avatars; 
	};

	Template.avatarList.events({
	    'click img.player' : function (e, t) {
			var player = $("img#"+this.avatar_id);
			var event = new jQuery.Event("click");
			event.pageX = e.clientX;
			event.pageY = e.clientY;
			$(".the_canvas").trigger(event);
		}, 
		'click .score_board' : function (e, t) {
			var event = new jQuery.Event("click");
			event.pageX = e.clientX;
			event.pageY = e.clientY;
			$(".the_canvas").trigger(event);
		},
		
		'mouseover img.player' : function (e, t) {
			var player = $("img#"+this.avatar_id).not("#"+Game.your_avatar_id);
			player.addClass("player_big");
 		}, 
 		'mouseout img.player' : function (e, t) {
 			var player = $("img#"+this.avatar_id).not("#"+Game.your_avatar_id);
 			
 			player.removeClass("player_big");
 			
 		}

  
	});

	Template.avatarForm.avatar = function () {
		var user = Meteor.user();						
		var avatar = Avatars.findOne({avatar_id: user._id});
		return avatar; 
	};

	Template.avatarForm.editing = function () {
		return Session.get("edit"); 
	}

	Template.avatarForm.events({
		'click a#edit': function (e, t) {
				Session.set("edit", true);	
			},
		'click button#change': function (e, t) {			
				var user = Meteor.user();						
				var avatar = Avatars.findOne({avatar_id: user._id});				
				var el_name = t.find("#avatar_name");
				var el_message = t.find("#avatar_message");
				var el_image = t.find("#avatar_image_input");
				
				if (avatar) {
					Avatars.update({_id: avatar._id}, { $set: { avatar_name: el_name.value, avatar_message: el_message.value, avatar_img: el_image.value, moved:true }}); 
				} else {
					Avatars.insert({avatar_id: user._id, 
					avatar_name: el_name.value, avatar_message: el_message.value, avatar_img: el_image.value, avatar_left:"400", avatar_top:"500", moved:true });
				}
				Session.set("edit", false);	
			},
		 'click button#del': function (e, t) {
				console.log("function can be used later"); 
			}, 
		 'click a#cancel_edit': function (e, t) {
				Session.set("edit", false);
			}
	});

	Template.admin_panel.rendered = function () { 
				html = '<div> <a href="#" class="test_admin">x</a> </div>';
				$(".admin_panel_active").append(html); 
	};

	Template.admin_panel.events({
		'click a.reset_gameboard': function (e, t) {
			Meteor.call('remove_gameboard', function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log("data gamebaord removed "+ data);
				}
			}); 
			},
		'click a.create_gameboard': function (e, t) {
				Meteor.call('create_gameboard', function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log("data gamebaord created " + data);
				}
			});
			},
		'click a.test_admin': function (e, t) {
				if (Meteor.userId()) {
					if (Meteor.user().profile.name == "plix") {
						html = 	'<div> <a href="#removed" class="reset_gameboard">remove_gameboard</a> </div>' + 
								'<div> <a href="#created" class="create_gameboard">create_gameboard</a> </div>';
						$(".admin_panel_active").append(html); 
					}
				}
			}
	});

	Template.secret_form.events({
		'click a#change_secret': function (e, t) {
				Session.set("changing_secret", true);
			},
		'click a#close_secret': function (e, t) {
				Session.set("changing_secret", false);
			},
		'keypress input': function (e, t) {
				if (e.keyCode === 13) {
					var pass = t.find("#pass");
					Session.set("secret", pass.value);
					Session.set("changing_secret", false);	
					secret = Session.get("secret");
					Session.set("secretJoined", true);
					
				}
			}
	});

	Template.secret_form.changing_secret = function () {
		return Session.get("changing_secret"); 
	};

	// about template 
	// $(".disabling").hide(); 
	
	Template.about.show_about = function () { 
		return Session.get("show_about");
	};  
	
	Template.about.about = function () {
		var about_object = []; 
		about_object.points = 
		[
			{ point: {	"title": 	"Here is Riotchat", 
						"content":	"Riot Chat is a Twitter-IRC-game remix. <br>  Riot Chat is an homage to kopimi (copyme), a symbol showing that you want to be copied, and a sandbox for an anti-surveillance communication protocol. <br> Occupy was right: we need to get rid of super managers holding the world down. Since revolutions constantly fail in the streets, we must simultaneously continue to riot the Internet.  " , 
						"media":	"img/kopimi.gif" 
					 } 
			},
			{ point: {	"title": 	"Occypy internet gif animations", 
						"content":	"The avatar gif animations are from the riot of Occypy internet, find more information here <a href='http://occupyinter.net/' target='_blank'> occupyinter.net </a>"					 
					 } 
			},  
			{ point: {	"title": 	"The Chat and OmniHal", 
						"content":	"To talk to OmniHal, the chat bot, type /omnihal and then your message. OmniHal has a young brain. Feed OmniHal with text i the top right corner. <br> Change the topic of the chat by typing /topic and then the new topic" , 

					  } 
			}, 
			{ point: {	"title": 	"OmniHal", 
						"content":	"" , 

					  } 
			}, 
			{ point: {	"title": 	"The Game", 
						"content":	"Help expand the territory of kopimi (copyme) pyramids by getting rid of eyeballs box. Click, move and communicate." , 

					  } 
			}, 
			{ point: {	"title": 	"Fork on github", 
						"content":	"Fork the project <a href='https://github.com/palletorsson/riotchat' target='_blank'> here </a> ", 
					  } 
			}			
		];

		return about_object.points;	
	};
	
	Template.about.events({
		'click #show_about': function (e, t) {
				Session.set("show_about", true);
			},	
		'click #close_about': function (e, t) {
				Session.set("show_about", false);
			}	
	});
	
	
} // end of isClient

if (Meteor.isServer) {

	// models for client to subscribe to
	Meteor.publish("avatars", function() {
		return Avatars.find();
	});
	Meteor.publish("messages", function() {
		return Messages.find({}, {sort: {time : -1}, limit: 50 });
	});
	Meteor.publish("meta_setting", function() {
		return  Meta_setting.find({_id:"1"});
	});
	
	Meteor.publish("gameboard", function() {
	
	game = Gameboard.find({_id:"1"}).observe({
		changed: function (id, fields) {
		  return Gameboard.find({_id:"1"}); 
		},
	});
  
		return  Gameboard.find({_id:"1"});
	});
	Meteor.setInterval(function(){Meteor.call("aiAction");}, 3000);
	

	// communication with omniHal API
	Meteor.methods({
		fetchFromService: function(question) {
			var url = "http://artliberated.org/answers/?question="+question;

			//synchronous GET
			var result = Meteor.http.get(url, {timeout:30000});
				if(result.statusCode==200) {
				var respJson = JSON.parse(result.content);

				return respJson;

			} else {
				console.log("Response issue: ", result.statusCode);
				//var errorJson = JSON.parse(result.content);
				throw new Meteor.Error(result.statusCode, errorJson.error);
				return "I'm sleeping.";
			}
		}, 
		GetSecret: function() {
			var url = "http://artliberated.org/unsecure/";

			var result = Meteor.http.get(url, {timeout:30000});
			if(result.statusCode==200) {
				var respJson = JSON.parse(result.content);
				//respJson = respJson.substring(1, respJson.length-1);

				return respJson;
				
			} else {
				console.log("Response issue: ", result.statusCode);
				throw new Meteor.Error(result.statusCode, errorJson.error);
			}
		},
		aiAction: function() {
			var the_game = Gameboard.findOne({});
			var tileMap = the_game.board; 
			// Bad ai ------------------------------ >

			var bad_pos = the_game.the_bad; 
			var bad_obj = Meteor.call("bad_ai", tileMap, bad_pos);
			tileMap = bad_obj.board; 
			var new_bad_row = bad_obj.the_bad[0]; 
			var new_bad_col = bad_obj.the_bad[1]; 
			
			// Good ai ----------------------------------- >
			
			var good_pos = the_game.the_copyme; 
			good_obj  = Meteor.call("good_ai", tileMap, good_pos);
			tileMap = good_obj.board;
			var new_good_row = good_obj.the_good[0]; 
			var new_good_col = good_obj.the_good[1]; 
			
			// Update Gameboard and return game
			
			Gameboard.update({ _id: "1" }, { $set: { the_bad: [new_bad_row, new_bad_col], the_copyme: [new_good_row, new_good_col], board: tileMap }});
			var local_game = { the_bad: [new_row, new_col], the_copyme: [new_good_row, new_good_col], board: tileMap }
			return local_game; 

		},

		moveAi: function(row, col, avatar_id, last_player_row, last_player_col, position_y_top, position_x_left) {
			//Gameboard.remove({ _id: "1" });
			//Gameboard.insert({ _id: "1", name: 'copyriot', board: {}, the_bad: [16,16], the_omni: [7,7], the_copyme: [1,1] });
			var the_game = Gameboard.findOne({});
			var tileMap = the_game.board; 
						
			tileMap = Meteor.call("act_all_player", tileMap);
			
			/* 	
			 * null is untouched tile 
			 * 1 is player current postion 
			 * 2 is step by player, light green previously allocated  
			 * 3, 4, 5 is good IA, kopimi
			 * 7: low drak bad IA
			 * 8: high dark bad IA 
			 * 9: unused
			 * 10 - 20 environment    			 
			 */
					

			// moving player position -------------------------------- > 
			
			var player_row = row; 
			var player_col = col; 
	
			if (!tileMap[player_row]|| tileMap[player_row] === 'undefined') {
				tileMap[player_row] = [];
			}	
			
			// If player step on enemy or unallocated 
			if (tileMap[player_row][player_col] == 8) { // if high dark
				tileMap[player_row][player_col] = 7; // set to low dark
			} else if (tileMap[player_row][player_col] == null) { // if it is environment
				tileMap[player_row][player_col] = 2;
			} else if (tileMap[player_row][player_col] < 7) { // is kopimi

			} else if (tileMap[player_row][player_col] > 10 ) { // is environment 			
			
			} else {
				tileMap[player_row][player_col] = 2; // else set to light green
			}
			
			Avatars.update({_id:avatar_id}, { $set: 
					{ 
					avatar_top: position_y_top, // ajusting postion 
					avatar_left: position_x_left,  // ajusting postion 
					last_player_row: player_row, 
					last_player_col: player_col,
					time: Date.now(), 
					moved: true
					}});
			
		
			
			// Bad ai ------------------------------ >

			var bad_pos = the_game.the_bad; 
			var bad_obj = Meteor.call("bad_ai", tileMap, bad_pos);
			tileMap = bad_obj.board; 
			var new_bad_row = bad_obj.the_bad[0]; 
			var new_bad_col = bad_obj.the_bad[1]; 
			
			// Good ai ----------------------------------- >
			
			var good_pos = the_game.the_copyme; 
			good_obj  = Meteor.call("good_ai", tileMap, good_pos);
			tileMap = good_obj.board;
			var new_good_row = good_obj.the_good[0]; 
			var new_good_col = good_obj.the_good[1]; 
			
			// Update Gameboard and return game
			
			Gameboard.update({ _id: "1" }, { $set: { the_bad: [new_bad_row, new_bad_col], the_copyme: [new_good_row, new_good_col], board: tileMap }});
			var local_game = { the_bad: [new_row, new_col], the_copyme: [new_good_row, new_good_col], board: tileMap }
			return local_game; 

			 			
		}, 
		act_all_player: function(tileMap) {
		
			var pl = Avatars.find({moved:true}); 
			var square_postions = [-1, 0, 1]; 
			
			pl.forEach(function (p) {
				
				
				var this_rand_row = Math.floor((Math.random()*3)-1); 				
				var this_rand_col = Math.floor((Math.random()*3)-1);
				 
				var this_player_col = p.last_player_col + this_rand_col;
				var this_player_row = p.last_player_row + this_rand_row;
				 
				if (!tileMap[this_player_row]|| tileMap[this_player_row] === 'undefined') {
					tileMap[this_player_row] = [];
				}				
				
				if (tileMap[this_player_row][this_player_col] == 8) { // if high dark
					tileMap[this_player_row][this_player_col] = 7; // set to low dark
				} else if (tileMap[this_player_row][this_player_col] == 7) { // if it is lower dark
					tileMap[this_player_row][this_player_col] = 3;
				} else if (tileMap[this_player_row][this_player_col] == null) { // if it is untoched
					tileMap[this_player_row][this_player_col] = 2;
				} else if (tileMap[this_player_row][this_player_col] < 7) { // is kopimi

				} else if (tileMap[this_player_row][this_player_col] > 10 ) { // is environment 			
			
				} else {
					tileMap[this_player_row][this_player_col] = 2; // else set to light green
				}
			
			});  
			return tileMap;
		},
		bad_ai: function(tileMap, bad_pos) {
		
			bad_row = bad_pos[0];
			bad_col = bad_pos[1]; 	
			
			// bad ai walk 
			rand_row = Math.floor((Math.random()*2)-1); 
			rand_col = Math.floor((Math.random()*2)-1);
			new_row = rand_row + bad_row;
			new_col = rand_col + bad_col; 

			// bad ai revolve map 
			if (new_row < 1) { new_row = 16 }; 
			if (new_row > 16) { new_row = 1 }; 
			if (new_col < 1) { new_col = 16 };
			if (new_col > 16) { new_col = 1 };


			if (!tileMap[new_row] || tileMap[new_row] === 'undefined') {
				tileMap[new_row] = [];
			}	

 			// check to see if bad trying to step on current player position 
			if ( tileMap[new_row][new_col] == 2 ) { 
				tileMap[new_row][new_col] = 8; // set to dark but move the current bad IA away to a higher number on the board
			// if bad ai hits good titles
			} else if ( tileMap[new_row][new_col] == 3 || tileMap[new_row][new_col] == 4 || tileMap[new_row][new_col] == 5 ) { 
							var rand = Math.floor( (Math.random()*5)+1);
								if (rand < 4 ) { 
									tileMap[new_row][new_col] = 8; 
									tileMap[bad_row][bad_col] = 8; 
								} else { 
									tileMap[bad_row][bad_col] = 8; 
									
								}		
								new_col = bad_col+1;
								new_row = bad_row+1;
								 	
			} else if (tileMap[new_row][new_col] > 10 ) { // if it is environment
						
			} else {
				tileMap[new_row][new_col] = 8; // else just move the bad IA
			}
			
			bad_obj = { the_bad: [new_row, new_col], board: tileMap }
			return bad_obj;  
		},
		
		good_ai: function(tileMap, good_pos) {
		
		var square_postions = [-1, 0, 1]; 
			
			var current_good_row = good_pos[0];
			var current_good_col = good_pos[1]; 	


			var rand_row = Math.floor((Math.random()*3)-1); 
			var rand_col = Math.floor((Math.random()*3)-1);
			var new_good_row = rand_row + current_good_row;
			var new_good_col = rand_col + current_good_col; 

		
			if (new_good_row < 0 || new_good_row > 16) {new_good_row=5}
			if (new_good_col < 0 || new_good_col > 16) {new_good_col=5}
		
			if (!tileMap[new_good_row] || tileMap[new_good_row] === 'undefined') {
				tileMap[new_good_row] = [];
			}	

			for (var i = 0; i < square_postions.length; i++) {
				for (var j = 0; j < square_postions.length; j++) {
			
				if (!tileMap[new_good_row+square_postions[i]] || tileMap[new_good_row+square_postions[i]] === 'undefined') {
								tileMap[new_good_row+square_postions[i]] = [];
							}	
				var walk_value = tileMap[new_good_row+square_postions[i]][new_good_col+square_postions[j]]; 

				
				if (walk_value == 7 || walk_value == 8) {
						var can_hit = true; 
						var can_move = false; 		
					} else {
						var can_move = true; 	
						var can_hit = false; 				
					}
				}
			}
			 
			// restricting good ai movement
			if (new_good_row <= 1 || new_good_row > 14) {new_good_row=4}
			if (new_good_col <= 1 || new_good_col > 14) {new_good_col=4}
			 			
			if (can_move) { 
 				if (tileMap[new_good_row][new_good_col] == 3) {
					tileMap[new_good_row][new_good_col] = 4;
				} else if (tileMap[new_good_row][new_good_col] == 4) {
					tileMap[new_good_row][new_good_col] = 5;
				} else if (tileMap[new_good_row][new_good_col] == 5) {
					tileMap[new_good_row][new_good_col] = 5;
				} else if (tileMap[new_good_row][new_good_col] > 10 ) {
				
				} else {
					tileMap[new_good_row][new_good_col] = 3;
				}
				
			} 
			if (can_hit) {
				if (new_row < 14 && new_col < 14) {
					var rand = Math.floor( (Math.random()*5)+1);
					if (rand > 3 ) { 
						tileMap[current_good_row][current_good_col] = 3; 
						tileMap[new_good_row][new_good_col] = 3;
						new_good_row = current_good_row-1; 
						new_good_col = current_good_col-1; 
					} else if (rand == 3) {
						tileMap[current_good_row][current_good_col] = 4; 
						new_good_col = current_good_col-1; 
					
					}  else if (rand == 4) {
						tileMap[current_good_row][current_good_col] = 8; 
						new_good_row = current_good_row-1; 
					} else {
						tileMap[current_good_row][current_good_col]= 3; 
						tileMap[new_good_row][new_good_col] = 8; 							
					}		
					
				}
		
				
			} 
			good_obj = { the_good: [new_good_row, new_good_col], board: tileMap }
			return good_obj;  
			 
			
		}, 
		get_gameboard: function() {
			var a_game = Gameboard.findOne({});
			
			return a_game;  
		},
		
		create_gameboard: function() {
			var tileMap = {};
	
			for (var row = 0; row < 18; row++) {
				for (var col = 0; col < 18; col++) {
					if (!tileMap[row] || tileMap[row] === 'undefined') {
							tileMap[row] = [];
					}	 			
					if (row > 0 && col > 0) {

						var rand = Math.floor((Math.random()*2)+1); 
								
						if (rand == 1) {
							tileMap[row][col] = 2; 	
						} else{
							tileMap[row][col] = 8; 				
						}
					} else {
							tileMap[row][col] = 11; 		
					}
						
				}
			}
			var avatars_ = Avatars.find().fetch();

			var tops = 500 / avatars_.length
			var lefts = 300;
			for (var a = 0; a < avatars_.length; a++) {
				var left = lefts - (a*40); 
				var top = ((a+1)*tops)+100; 
				if (top > 800) {
					lefts = 400; 
					tops = 1000; 
				}
				
				Avatars.update({_id: avatars_[a]._id}, { $set: { avatar_left: left,  avatar_top: top, moved: false }}); 
	
			}
			
			Gameboard.insert({ _id: "1", name: 'copyriot', board: tileMap, the_bad: [16,16], the_omni: [7,7], the_copyme: [1,1] });
		},
		remove_gameboard: function() {
			Gameboard.remove({ _id: "1" });
		}
    });


}


