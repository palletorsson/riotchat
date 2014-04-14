var Avatars = new Meteor.Collection("avatars");
var Messages = new Meteor.Collection("messages");
var Meta_setting = new Meteor.Collection("meta_setting");
var Gameboard = new Meteor.Collection("gameboard");
var Game = {};
var Settings = {};
var HandleMessage = {}; 

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
		console.log(doc.message)
		//return (userid && doc.message.length < 500); 
		return true; 
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
		Settings.encryption = true;
		Settings.create_game = false; 
		Settings.remove_game = false;

		if (Settings.create_game) {
			Meteor.call('create_gameboard');
		}
		if (Settings.remove_game) {
			Meteor.call('remove_gameboard');
		}

		// Game
		Game.gridOffsetY = 100;
		Game.gridOffsetX = 300;

		Game.playerOffsetY = 250;
		Game.playerOffsetX = 80;

		Game.network = {}
		Game.canvas = document.getElementById('myCanvas');
		Game.c = Game.canvas.getContext('2d');
		
		Game.topBoundary = Game.gridOffsetY;
		Game.buttomBoundary = Game.canvas.height / 2 + 500;
		Game.leftBoundary = 100;
		Game.rightBoundary = Game.canvas.width;

		Game.grid = {
				width: 18,
				height: 18
			}
 
		Game.tile = new Image();
		Game.tile.src = "/img/under.png";

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

		Game.copy_me_avatar = "/img/droid-evanroth-occupy.gif"

		Game.copy_me_1 = new Image();
		Game.copy_me_1.src = "/img/copytile_iso1.png";

		Game.copy_me_2 = new Image();
		Game.copy_me_2.src = "/img/copytile_iso2.png";
				
 		Game.black = new Image();
		Game.black.src = "/img/dark.png";
 
 		Game.black_2 = new Image();
		Game.black_2.src = "/img/dark_part.png";
		

		Game.resetTileCount = function() {
			Game.tiles_green = 0; 
			Game.tiles_bad = 0; 
			Game.tiles_copy_me = 0; 
			Game.tiles_natural = 0; 
		}

		Game.resetTileCount(); 

		Game.draw = function(tileMap) {
		
		
			//Game.c.fillStyle = '#000000'; 
       		//Game.c.fillRect(0, 0, Game.c.width, Game.c.height);

		
							   	
			Game.c.clearRect (0, 0, Game.c.width, Game.c.height);
			//Game.c.drawImage(Game.space, 0, 0, Game.c.width, Game.c.height);
			var i = 0; 
			for (var row = 0; row < Game.grid.width; row++) {
				for (var col = 0; col < Game.grid.height; col++) {

					var tilePositionX = (row - col) * Game.tile.height;

					// Center the grid horizontally
					tilePositionX += (Game.canvas.width / 2) - (Game.tile.width / 2);

					var tilePositionY = (row + col) * (Game.tile.height / 2);

					/* 	2 is green previously allocated 
						1 is current postion 
					    3 is good ia 
						4 is bad ia    			
						else is untouched 
					*/
				
							
					if ( tileMap[row] != null && tileMap[row][col] != null) {
						
						if ( tileMap[row][col] == 1 ) {
							Game.tiles_green = Game.tiles_green + 1; 
							Game.c.drawImage(Game.green, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
						} else if ( tileMap[row][col] == 2 ) {
							Game.tiles_green = Game.tiles_green + 1; 
							Game.c.drawImage(Game.green_current, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							
						} else if ( tileMap[row][col] == 3 ) {
							Game.tiles_copy_me = Game.tiles_copy_me + 1; 
							Game.c.drawImage(Game.copy_me, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
 							
    					} else if ( tileMap[row][col] == 7 ) {
							Game.tiles_copy_me = Game.tiles_copy_me + 1; 
							Game.c.drawImage(Game.copy_me_1, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							//var newItem = "item" + i;
							//Game.network[newItem] =  { point: row+"_"+col, "positionX": Math.round(tilePositionX), "positionY":Math.round(tilePositionY) } ;
						} else if ( tileMap[row][col] == 8 ) {
							Game.tiles_copy_me = Game.tiles_copy_me + 1; 
							Game.c.drawImage(Game.copy_me_2, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);
							//var newItem = "item" + i;
							//Game.network[newItem] =  { point: row+"_"+col, "positionX": Math.round(tilePositionX), "positionY":Math.round(tilePositionY) } ; 
						} else if ( tileMap[row][col] == 4 ) {
							Game.c.drawImage(Game.black, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
var newItem = "item" + i;	
							Game.network[newItem] =  { "positionX": Math.round(tilePositionX)+32, "positionY":Math.round(tilePositionY)+32  }; 
					
							Game.tiles_bad = Game.tiles_bad + 1; 					
						} else if ( tileMap[row][col] == 5 ) {
							Game.c.drawImage(Game.black_2, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
					
							Game.tiles_bad = Game.tiles_bad + 1; 
						} else if ( typeof (tileMap[row][col]) == "string"  ) {
							Game.c.drawImage(Game.green_current, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							Game.tiles_green = Game.tiles_green + 1; 
						} else  {
							Game.c.drawImage(Game.red, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
						}
					} else {
						Game.c.drawImage(Game.tile, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
						Game.tiles_natural = Game.tiles_natural + 1; 
					}
					i = i + 1; 
				}
			}


			//console.log(Game.network)


			var	positionX_previous = 300; 
			var positionY_previous = 300;
			Game.c.lineWidth = 2;
			Game.c.strokeStyle="brown"; 
			$.each(Game.network, function( index, value ) {

				//console.log( index + ": " + value.positionX + ": " + value.positionY + ": " +positionX_previous +": " + positionY_previous );
				//if (value.positionX < 800 && value.positionY < 800) {
					Game.c.beginPath();
					Game.c.moveTo(positionX_previous, positionY_previous);
					Game.c.lineTo(value.positionX, value.positionX);
					
					Game.c.stroke()
					positionX_previous = value.positionX; 
					positionY_previous = value.positionY;
	//			}
			});

			Game.network = {}
			var all = Game.tiles_natural + Game.tiles_bad + Game.tiles_green; 
			var good = (Game.tiles_green / all) * 100;
			$(".score_board").html("Datalove: "+good.toFixed(2)+ "%"); 
			Game.tiles_natural = 0; Game.tiles_bad = 0; Game.tiles_green = 0; 
		}
		Game.init_interval = true;

 		//Message
		HandleMessage.ScrollDown = function() {
			var chatDiv = $(".messages");
			chatDiv.scrollTop(chatDiv.prop("scrollHeight"));
		}; 		
		
	Game.urlify = function(text) {
    	var urlRegex = /(https?:\/\/[^\s]+)/g;
		return text.replace(urlRegex, function(url) {
		    return '<a href="' + url + '"  target="_blank">' + url + '</a>';
		})

	}; 

		Meteor.setTimeout(function(){
			var is_settings = Meta_setting.findOne({ _id: "1"});
			if (!is_settings) {
				Meta_setting.insert({ _id: "1", topic:'piracy is fun', channel: "riotchat" });
			}
		}, 3000);
		Session.set("showchat", true); 			
		
		HandleMessage.helpEnc = function(message) {
			alert(message);	console.log(message)
            return message.ciphertext.toString(CryptoJS.enc.Base64);
	
            
        }

        HandleMessage.helpDec = function (message) {
	alert(CryptoJS.enc.Base64(message))
            return CryptoJS.enc.Base64(message);
      	}

	});

 
	// check if user has avatar 
	Deps.autorun(function () {
	  if (Meteor.userId()) {
		var user = Meteor.user();
		var id = Meteor.userId();
		var users_avatar = Avatars.findOne({avatar_id: id});
		if (users_avatar) {
			Session.set("avatar", true); 
		} else {
			Session.set("avatar", false);
		}
	  }
	});

	// Gameboard functions: 
	Meteor.subscribe("gameboard");

	Template.gameboard.gameboard= function () {
		game = Gameboard.findOne({});	
		return game;		
	}	
	
	Handlebars.registerHelper("board_key", function(board) {
		return board;  
	});		
	
	Template.gameboard.rendered = function () {
	   Meteor.call('get_gameboard', function(err, data) {
			if (err) {
				console.log(err);
			} else {
				var gamemap = data;	
				tileMap = gamemap.board;
				Game.draw(tileMap);
			}
		});
	}
	
	Template.gameboard.events({ 	
 		'mousemove .the_canvas': function(e) {	
			if(Game.init_interval) { 
				Game.init_interval = false;
				Meteor.setTimeout(function(){
					Meteor.call('get_gameboard', function(err, data) {
						if (err) {
							console.log(err);
						} else {
						var gamemap = data;	
						tileMap = gamemap.board;
						Game.draw(tileMap); 
						Game.init_interval = true;
						}
					});
				}, 3000); 
			}
		},
		
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
							Game.c.height = $( window ).height()-100;

			

							if (Game.tiles_bad < 10) {
							//	tileMap[7][7] = 4; 
							}

						
							if (Game.tiles_copyme == 0) {
							//	tileMap[1][1] = 3;  
							}		

							Game.resetTileCount(); 

							// Gameboard.update({ _id: "1" }, { $set: { 'board' : tileMap }}); 
		 					last_player_row = avatar.last_player_row || 4; 
 							last_player_col = avatar.last_player_col || 4; 
							
							var position_y_top = e.pageY-Game.playerOffsetY; 
							var position_x_left =  e.pageX-Game.playerOffsetX;			 
		
						

							Meteor.call('moveAi', row, col, avatar._id, last_player_row, last_player_col, position_y_top, position_x_left, function(err, data) {
								if (err) {
									console.log(err);
								} else {
									console.log(data);
									Game.draw(data);
								}
							});
					
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
  		return meta;
	};
	
	Meteor.subscribe("messages");
	
	Template.messages.messages = function () {	
		if (Settings.encryption) {

			var items = Messages.find({}, {sort: {time : -1}, limit: 100 }).fetch();
			items = items.sort(function(a,b) { return parseInt(a.time) - parseInt(b.time) } );
			
			secret = "copyriot";

			items.forEach( function(item) { 
 				try {

                   message = {ct : item.message, iv: item.iv, s:item.s}
					message = JsonFormatter.parse(message)
					var decrypted = CryptoJS.AES.decrypt(message, secret, { format: JsonFormatter });
					console.log(decrypted); 
					var new_message = decrypted.toString(CryptoJS.enc.Utf8)
 					console.log(new_message); 
					item.message = new_message;
                } catch (err) {
                   // console.log("Failure in toString(CryptoJS.enc.Utf8): " + err.message);
                }
	   			
			});

			items.forEach(function(item) {
				// item.message = Game.urlify(item.message); 
			});
			return items; 

		} else {
			var items = Messages.find({}, {sort: {time : -1}, limit: 100 }).fetch();
			items = items.sort(function(a,b) { return parseInt(a.time) - parseInt(b.time) } );
			items.forEach(function(item) {
				item.message = Game.urlify(item.message); 
			});
			return items; 
		}
  		return messages;
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
				HandleMessage.ScrollDown();
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
				console.log(element.value); 
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
		}, 1000); 
	
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
					username = "_nano",
					message_form = e.target;

				if (message_form.value.trim()[0] == "/") {
				
					var splited = message_form.value.split(" "); 
					if (splited[0] == "/topic") {
						var topic = ''; 
							for (var j = 1; j < splited.length; j++) {
								topic = topic + " " + splited[j]; 
							}
							Meta_setting.update({_id: "1"}, { $set: {topic: topic}}); 
							message_form.value = '';
					}
					return  true; 
				} 				




				if(avatar) {
															
					avatar_img = avatar.avatar_img;
					username = avatar.avatar_name;	
					if (username.trim() == '') {
						 
						username = user.profile.name || "_nano";
					}
					if (avatar_img.trim() == '') {
						avatar_img = "default_avatar.png";
					}									
				} else {
					username = user.username;
				}
				
				message = message_form.value
				

				message = message.replace(/<(?:.|\n)*?>/gm, '');

				

				if (Settings.encryption) {
					secret = "copyriot";
 				   var encrypted = CryptoJS.AES.encrypt(message, secret,  { format: JsonFormatter });
					
					var json = JsonFormatter.stringify(encrypted)

				}
			
			 	if (message.length > 1 && $.trim(message) != '') {
		    		Messages.insert({
		      			name: username,
						owner: user._id,
						s: json.s, 
						iv: json.iv,
		      			message: json.ct,
						avatar_img: avatar_img, 
		      			time: Date.now(),
		    		});
				message_form.value = '';
				Meteor.setTimeout(function(){
					HandleMessage.ScrollDown() 
					$("#message").focus(); 
				}, 500); 

       	     	} else {
					message_form.value = '';	
				}

    		} else {
			//	if ((this.rows * this.cols) <= this.value.length) 
    			//	$(this).animate({ height: "4em" }, 500);                   
			}
		}

	});

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
		{name: "occupy-everything", type:"gif"},
		{name: "systaime", type:"gif"},
		{name: "dog", type:"gif"},
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
		avatars = Avatars.find({}); 
		return avatars; 
	};

	Template.avatarList.events({
	    'click img.player' : function (e, t) {
			var player = $("img#"+this.avatar_id);
			var event = new jQuery.Event("click");
			event.pageX = e.clientX;
			event.pageY = e.clientY;
			$(".the_canvas").trigger(event);
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
					Avatars.update({_id: avatar._id}, { $set: { avatar_name: el_name.value, avatar_message: el_message.value, avatar_img: el_image.value}}); 
				} else {
					Avatars.insert({avatar_id: user._id, 
					avatar_name: el_name.value, avatar_message: el_message.value, avatar_img: el_image.value, avatar_left:"300", avatar_top:"500" });
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
					console.log(secret);
				}
			}
	});




	Template.secret_form.changing_secret = function () {
		return Session.get("changing_secret"); 
	};

} // end of isClient

if (Meteor.isServer) {

	// models for client to subscribe to
	Meteor.publish("avatars", function() {
		return Avatars.find();
	});
	Meteor.publish("messages", function() {
		return Messages.find();
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

	// communication with omniHal API
	Meteor.methods({
		fetchFromService: function(question) {
			var url = "http://127.0.0.1:8000/answers/?question="+question;
			console.log(url); 
			//synchronous GET
			var result = Meteor.http.get(url, {timeout:30000});
				if(result.statusCode==200) {
				var respJson = JSON.parse(result.content);
				console.log(respJson);
				return respJson;

			} else {
				console.log("Response issue: ", result.statusCode);
				//var errorJson = JSON.parse(result.content);
				throw new Meteor.Error(result.statusCode, errorJson.error);
				return "I'm sleeping.";
			}
		}, 

		moveAi: function(row, col, avatar_id, last_player_row, last_player_col, position_y_top, position_x_left) {
			var the_game = Gameboard.findOne({});
			var tileMap = the_game.board; 


			// player 
			var player_row = row; 
			var player_col = col; 
	
			if  (Math.abs(player_row - last_player_row) < 6 && Math.abs(player_col - last_player_col) < 6 &&  typeof (tileMap[player_row][player_col]) != "string") {
				if (tileMap[player_row][player_col] == 4) {
					tileMap[player_row][player_col] = 5;
				} else {
					tileMap[player_row][player_col] = 2;
				}
				Avatars.update({_id:avatar_id}, { $set: 
						{ 
						avatar_top: position_y_top, 
						avatar_left: position_x_left, 
						last_player_row: player_row, 
						last_player_col: player_col
						}});
			} 


			// bad ai 
			var bad_one_pos = the_game.the_bad; 
			
			bad_row = bad_one_pos[0];
			bad_col = bad_one_pos[1]; 	

			rand_row = Math.floor((Math.random()*2)-1); 
			rand_col = Math.floor((Math.random()*2)-1);
			new_row = rand_row + bad_row;
			new_col = rand_col + bad_col; 

			// bad ai revolve map 
			if (new_row < 0) { new_row = 16 }; 
			if (new_row > 16) { new_row = 0 }; 
			if (new_col < 0) { new_col = 16 };
			if (new_col > 16) { new_col = 0 };


			if (!tileMap[new_row] || tileMap[new_row] === 'undefined') {
				tileMap[new_row] = [];
			}	

 			// check to see if bad trying to step on current player position 

			if ( tileMap[new_row][new_col] == 1 || tileMap[new_row][new_col] == 2 ) {	
				tileMap[new_row][new_col] = 4;
				new_row = new_row +2; 
				new_col = new_col +2;			
			} else {
				tileMap[new_row][new_col] = 4;
			}
	
			// good ai
			var good_one_pos = the_game.the_copyme; 
			var current_good_row = good_one_pos[0];
			var current_good_col = good_one_pos[1]; 	


			var rand_row = Math.floor((Math.random()*3)-1); 
			var rand_col = Math.floor((Math.random()*3)-1);
			var new_good_row = rand_row + current_good_row;
			var new_good_col = rand_col + current_good_col; 


			if (new_good_row < 0 || new_good_row > 11) {new_good_row=1}
			if (new_good_col < 0 || new_good_col > 10) {new_good_col=1}
			var new_good_col
			if (!tileMap[new_good_row] || tileMap[new_good_row] === 'undefined') {
				tileMap[new_good_row] = [];
			}	

			var square_postions = [-1, 0, 1]
			for (var i = 0; i < square_postions.length; i++) {
				for (var j = 0; j < square_postions.length; j++) {
			
				if (!tileMap[new_good_row+square_postions[i]] || tileMap[new_good_row+square_postions[i]] === 'undefined') {
								tileMap[new_good_row+square_postions[i]] = [];
							}	
					var walk_value = tileMap[new_good_row+square_postions[i]][new_good_col+square_postions[j]]; 
					if ( walk_value == 2 )  {
						var can_move = true; 							
					} else if (walk_value == 4) {
						var can_hit = true; 							
						new_good_row = new_good_row -2; 
						new_good_col = new_good_col -2;			
					}
				}
			} 

			if (new_good_row <= 0 || new_good_row > 11) {new_good_row=1}
			if (new_good_col <= 0 || new_good_col > 10) {new_good_col=1}
			 			
			if (can_move) {
				if (tileMap[new_good_row][new_good_col] == 7) {
					tileMap[new_good_row][new_good_col] = 8;
				} else if (tileMap[new_good_row][new_good_col] == 8) {
					tileMap[new_good_row][new_good_col] = 3;
				} else if (tileMap[new_good_row][new_good_col] == 3) {
					tileMap[new_good_row][new_good_col] = 3;
			
				} else {
					tileMap[new_good_row][new_good_col] = 7;
					}
				
			} else if (can_hit) {
				tileMap[new_good_row][new_good_col] = 3;
				
				new_good_row = current_good_row+1;
				new_good_col = current_good_col+1; 
			} 
			
			Gameboard.update({ _id: "1" }, { $set: { the_bad: [new_row, new_col], the_copyme: [new_good_row, new_good_col], board: tileMap }});

			return tileMap; 

			 			
		}, 
		get_gameboard: function() {
			var a_game = Gameboard.findOne({});
			
			return a_game;  
		},
		
		create_gameboard: function() {
			Gameboard.insert({ _id: "1", name: 'copyriot', board: {}, the_bad: [16,16], the_omni: [7,7], the_copyme: [1,1] });
		},
		remove_gameboard: function() {
			Gameboard.remove({ _id: "1" });
		}, 
		newPostion: function(row, col) {
				/*rand_row = Math.floor((Math.random()*2)-1); 
				rand_col = Math.floor((Math.random()*2)-1);
				new_row = rand_row + row;
				new_col = rand_col + col; 
				if (new_row >= 0 && new_col >= 0 && new_row <= 16 && new_col <= 16) { 
						return [new_row, new_col]; 
				} else {
						newPostion(); 
					}

				return true; */ return "hej"; 
		}

    });


}


