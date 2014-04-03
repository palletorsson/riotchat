var Avatars = new Meteor.Collection("avatars");
var Messages = new Meteor.Collection("messages");
var Gameboard = new Meteor.Collection("gameboard");
var Game = {};
var Settings = {};
var HandleMessage = {}; 

// Allow methods 

Gameboard.allow({
	insert: function () {
		return true; 
	},
	update: function () {
		return true; 
	},
	remove: function () {
		return true; 
	}
});

Messages.allow({
	insert: function () {
		return true; 
	},
	update: function () {
		return false; 
	},
	remove: function () {
		return true;
	}
});

Avatars.allow({
	insert: function () {
		return true; 
	},
	update: function () {
		return true; 
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
			Meteor.call('create_gameboard')
		}
		if (Settings.remove_game) {
			Meteor.call('remove_gameboard')
		}

		// Game
		Game.gridOffsetY = 70;
		Game.gridOffsetX = 20;

		Game.canvas = document.getElementById('myCanvas');
		Game.c = Game.canvas.getContext('2d');
		
		Game.topBoundary = Game.gridOffsetY;
		Game.buttomBoundary = Game.canvas.height / 2 + 500;
		Game.leftBoundary = 400;
		Game.rightBoundary = Game.canvas.width;

		Game.grid = {
				width: 18,
				height: 18
			}
 
		Game.tile = new Image();
		Game.tile.src = "/img/under.png";

		Game.dirt = new Image();
		Game.dirt.src = "/img/dirt.png";

		Game.green = new Image();
		Game.green.src = "/img/green.png";

		Game.green_current = new Image();
		Game.green_current.src = "/img/green_current.png";		

		Game.copy_me = new Image();
		Game.copy_me.src = "/img/copytile_iso.png";
		Game.copy_me_avatar = "/img/droid-evanroth-occupy.gif"

 		Game.black = new Image();
		Game.black.src = "/img/dark_icecream.png";

 		Game.black_current = new Image();
		Game.black_current.src = "/img/black_current.png";
		Game.black_bad_avatar = "/img/servilliance.png"


		Game.red = new Image();
		Game.red.src = "/img/red.png";

		Game.resetTileCount = function() {
			Game.tiles_green = 0; 
			Game.tiles_bad = 0; 
			Game.tiles_copy_me = 0; 
			Game.tiles_natural = 0; 
		}

		Game.resetTileCount(); 

		Game.draw = function(tileMap) {
			//console.log(tileMap)
			Game.c.clearRect (0, 0, Game.canvas.width, Game.canvas.height);
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



var insert_html_bad = '<div class="avatar_image removing" id=""> <div class="insert_npc" style="position:absolute; top:'+Math.round(tilePositionX)+'px; left:'+Math.round(tilePositionY)+'px"></div> <img src="'+Game.black_bad_avatar+'" alt="bad_" class="insert_npc" style="z-index: 4; height: 100px; width:100px; top:'+Math.round(tilePositionX)+'px; left:'+Math.round(tilePositionY)+'px"></div>'; 

					*/
				
					if ( tileMap[row] != null && tileMap[row][col] != null) {
						if ( tileMap[row][col] == 1 ) {
							Game.tiles_green = Game.tiles_green + 1; 
							Game.c.drawImage(Game.green_current, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
						} else if ( tileMap[row][col] == 2 ) {
							Game.tiles_green = Game.tiles_green + 1; 
							Game.c.drawImage(Game.green, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
		
						} else if ( tileMap[row][col] == 3 ) {
							Game.tiles_copy_me = Game.tiles_copy_me + 1; 
							Game.c.drawImage(Game.copy_me, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							var insert_html_good = '<div class="avatar_image removing" id=""> <div class="npc" style="position:absolute; top:'+Math.round(tilePositionY)+'px; left:'+Math.round(tilePositionX)+'px">omni</div> <img src="'+Game.copy_me_avatar+'" alt="bad_" class="npc" style="z-index: 4; height: 200px; top:'+Math.round(tilePositionY-100)+'px; left:'+Math.round(tilePositionX-00)+'px" /> </div>'; 		
						} else if ( tileMap[row][col] == 4 ) {
							Game.c.drawImage(Game.black, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
							Game.tiles_bad = Game.tiles_bad + 1; 					
						} else if ( tileMap[row][col] == 5 ) {
							Game.c.drawImage(Game.black_current, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	

						} else  {
							Game.c.drawImage(Game.red, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
						}
					} else {
						Game.c.drawImage(Game.tile, Math.round(tilePositionX), Math.round(tilePositionY), Game.tile.width, Game.tile.height);	
						Game.tiles_natural = Game.tiles_natural + 1; 
					}
				}
			}
			// insert npcs into the dom
			$(".perspective_grid .removing").remove(); 
			$(".perspective_grid").append(insert_html_good); 
		}

 		//Message
		HandleMessage.ScrollDown = function() {
			var chatDiv = $(".messages");
			console.log(chatDiv.prop("scrollHeight"));
			chatDiv.scrollTop(chatDiv.prop("scrollHeight"));
		}; 		
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
		} else {
			Session.set("avatar", false);
		}
	  }
	});

	// Gameboard functions: 
	Meteor.subscribe("gameboard");

	Template.gameboard.gameboard = function () {
		return Gameboard.findOne({});		
	}	

	
	Template.gameboard.events({ 
 		'click .the_canvas': function(e) {	
			if (e.pageY > Game.topBoundary && e.pageY < Game.buttomBoundary && e.pageX > Game.leftBoundary && e.pageX < Game.rightBoundary ) {
	 			if (Meteor.userId()) {
					var the_game = Gameboard.findOne({});	

	 				tileMap = the_game.board;
				
					last_row = Session.get("last_click_row") || 7;  
					last_col = Session.get("last_click_col") || 7;  
				
					if (!tileMap[last_row] || tileMap[last_row] === 'undefined') {
							tileMap[last_row] = [];
						}

					tileMap[last_row][last_col] = 2;	

					// Take into account the offset on the X axis caused by centering the grid horizontally
					Game.gridOffsetX = (Game.canvas.width / 2) - (Game.tile.width / 2);
		
					var col = (e.clientY - Game.gridOffsetY) * 2;
					
					col = ((Game.gridOffsetX + col) - e.clientX) / 2;
					var row = ((e.clientX + col) - Game.tile.width) - Game.gridOffsetX;
		
					row = Math.round(row / Game.tile.height);
					col = Math.round(col / Game.tile.height);
				
					// Check the boundaries!
				
					if (row >= 0 && 
						col >= 0 && 
						row <= Game.grid.width &&
						col <= Game.grid.height) {

						if (!tileMap[row] || tileMap[row] === 'undefined') {
							tileMap[row] = [];
						}

						Session.set("last_click_row", row);
						Session.set("last_click_col", col);  
					
						tileMap[row][col] = 1;	
						

						if (Game.tiles_bad < 10) {
							tileMap[7][7] = 4; 
						}

						
						if (Game.tiles_copyme == 0) {
							tileMap[1][1] = 3;  
						}		

						Game.resetTileCount(); 

						Gameboard.update({ _id: "1" }, { $set: { 'board' : tileMap }}); 

						Meteor.call('moveAi', function(err, data) {
							if (err) {
								console.log(err);
							} else {
								console.log(data);
								Game.draw(data);
							}
						});
					
					}

					var user = Meteor.user();
					if(user) {	
						var avatar = Avatars.findOne({avatar_id: user._id});
						if(avatar) {
							Avatars.update({_id:avatar._id}, { $set: { avatar_top: e.pageY-285, avatar_left: e.pageX-75}});
						} else {
							console.log("make yourself an avatar")
						}
					} else {
						console.log("to riot login")
					}
					Game.draw(tileMap);
				} 
			}
		}, 
		'click img.npc': function (e, t) {
			console.log("omni"); 
			id = this.id; 
			type = this.type; 
			var m = $('#npc_message_'+id);

			if (type == "rant") {		
				m.css({top: e.pageY+'px',left:e.pageX+'px'}).show().fadeOut(10000); 
				return false; 
			} else {
				m.html("Ask omniMarx ( <a>x</a> ): <input type='text' id='ask_irc'>").css({top: e.pageY+'px',left:e.pageX+'px'}).show().find('input').focus().end().find('a').css({cursor:'pointer'}).on('click', function(){$(this).parent().hide()});;
			}
		}, 
		'click img.npc': function (e, t) {
			
			id = this.id; 					
			var m = $('#npc_message_'+id);
			m.css({top: e.pageY+'px',left:e.pageX+'px'}).show();//.fadeOut(10000); 
			return false;
				
		},  
		'keydown input#ask_irc' : function (e, t) {
    		if (e.which == 13) {
				element = t.find("#ask_irc");
					Meteor.call('fetchFromService', element.value, function(err, respJson) {
						if(err) {
							console.log("error occured on receiving data on server. ", err );
						} else {
							$(element).val(respJson.answer);
							setTimeout(function() {
								$(element).val('');
							}, 1200);													
						}
						
					});
				element.value = ""; 
				return false;
			} 
		}
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

					
	// Messages function: 
	Meteor.subscribe("messages");

	Template.messages.messages = function () {	
		if (Settings.encryption) {
			messages = Messages.find({}, {sort: {time : 1} }).fetch();
			secret = Session.get("secret");
			secret = "copyriot";
			messages.forEach( function(messages) { 
				console.log(messages.message);    
				var decrypted = CryptoJS.AES.decrypt(messages.message, secret);
				console.log(decrypt); 
	   			messages.message = decrypted.toString(CryptoJS.enc.Utf8); 
			});
		} else {
			var items = Messages.find({}, {sort: {time : 1} }).fetch();
    		return items.slice(-15);
		}
  		return messages;
	};

	
	Template.messages.events({
	  	'click .removemessage': function () {
			Messages.remove(this._id);
	  	}
		});

	// show and hide chat
	Template.chat.showchat = function () {
			return Session.get("showchat"); 
		}

	Template.chat.expanded = function () {
			return Session.get("expandedj"); 
		}


	Template.chat.events({
		'click a#showchat': function (e, t) {
				Session.set("showchat", true);	
				HandleMessage.ScrollDown();
			},
		'click a#hidechat': function (e, t) {
				Session.set("showchat", false);
			}
	});


	Template.chat.rendered = function () { 
		HandleMessage.ScrollDown(); 
	};  	

	Template.header.events ({ 
		'click a#expand_right': function(e, t) { 
			$(".messages").removeClass( "sized" ).addClass( "expanded" );
			$('.chat_form').addClass( "irc" );
			Session.set("expanded", true);		
		},
		'click a#contract_left': function(e, t) { 
			Session.set("expanded", false);
			$(".messages").removeClass( "expanded" )
			$('.chat_form').removeClass( "irc" );
			$('.divider').show();
			var chatDiv = $(".messages");
			chatDiv.scrollTop(chatDiv.prop("scrollHeight"));
				if (chat_width == "default") {
					$(".messages").css( "left","-300px"); 
					chat_width = "minimized"; 
				} else {
					$(".messages").css( "left","0" ); 
					chat_width = "default"; 
				}
		}
	});

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
					console.log("interactive"); 
					message_form.value = '';
					return false
				} 				

				if(avatar) {										
					avatar_img = avatar.avatar_img;
					username = avatar.avatar_name;	
					if (username == '') {
						username = user.username;
					}								
				} else {
					username = user.username;
				}

				message = message_form.value
				console.log(message, avatar_img, user._id, username, Date.now())

				if (Settings.encryption) {
					secret = Session.get("secret");
	 				var encrypted =  CryptoJS.AES.encrypt(message, secret);
	   				var decrypted = CryptoJS.AES.decrypt(encrypted, secret);
					var decrypted = decrypted.toString(CryptoJS.enc.Utf8);  
				}
			
			 	if (message.length > 2 && $.trim(message) != '') {
		    		Messages.insert({
		      			name: username,
						owner: user._id, 
		      			message: message,
						avatar_img: avatar_img, 
		      			time: Date.now(),
		    		});

				HandleMessage.ScrollDown(); 
				message_form.value = '';

       	     	} else {
					message_form.value = '';	
				}

    		} else {
			//	if ((this.rows * this.cols) <= this.value.length) 
    			//	$(this).animate({ height: "4em" }, 500);                   
			}
		}

	});

	// Avatar fucntion:
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
	    'mouseover img.player' : function (e, t) {
			var player = $("img#"+this.avatar_id);
			player.addClass("player_big");
			player.removeClass("player_size");
			player.animate({
     			marginLeft:'-100px',
				width: '20px', 
				height: '40px',
  			}, 500);
		}, 
		'mouseout img.player' : function (e, t) {
			var player = $("img#"+this.avatar_id);
			player.removeClass("player_big");
			player.addClass("player_size");
				player.animate({
     			marginLeft:'0px',
				width: '100px',
				height: '200px',
  			}, 4000);
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
				// console.log(el_name, el_message, el_image)
				
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
	Meteor.publish("gameboard", function() {
		return Gameboard.find();
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

		moveAi: function() {
			var the_game = Gameboard.findOne({});
			var tileMap = the_game.board; 
			// bad ai 
			var bad_one_pos = the_game.the_bad; 
			
			row = bad_one_pos[0];
			col = bad_one_pos[1]; 	

			rand_row = Math.floor((Math.random()*2)-1); 
			rand_col = Math.floor((Math.random()*2)-1);
			new_row = rand_row + row;
			new_col = rand_col + col; 

			// bad ai revolve map 
			if (new_row < 0) { new_row = 16 }; 
			if (new_row > 16) { new_row = 0 }; 
			if (new_col < 0) { new_col = 16 };
			if (new_col > 16) { new_col = 0 };


			if (!tileMap[new_row] || tileMap[new_row] === 'undefined') {
				tileMap[new_row] = [];
			}	

 			// check to see if bad trying to step on current player position 
			console.log(tileMap[new_row][new_col]);  
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
						var can_move = true; 							
						new_good_row = new_good_row -2; 
						new_good_col = new_good_col -2;			
					}
				}
			} 

			if (new_good_row <= 0 || new_good_row > 11) {new_good_row=1}
			if (new_good_col <= 0 || new_good_col > 10) {new_good_col=1}
			 			console.log(new_good_row, current_good_col)
			if (can_move) {
				tileMap[new_good_row][new_good_col] = 3;
				
			} else {
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


