var Avatars = new Meteor.Collection("avatars");
var Messages = new Meteor.Collection("messages");

Messages.allow({
	insert: function () {
		return true; 
	},
	update: function () {
		return false; 
	},
	remove: function (userId, docs) {
		return _.all(docs, function(doc) {
			return doc.owner === userId; 
		}); 
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

	Template.avatarForm.avatar = function () {
		return Session.get("avatar"); 
	}
	
	var chat_width = "default"; 
	var encryption = false;

	Meteor.subscribe("messages");

	Template.messages.messages = function () {	
		if (encryption) {
			messages = Messages.find().fetch({}, { sort: { time: 1 }, limit : 3});	
			secret = Session.get("secret");
			secret = "copyriot";
			messages.forEach( function(messages) { 
				console.log(messages.message);    
				var decrypted = CryptoJS.AES.decrypt(messages.message, secret);
				console.log(decrypt); 
	   			messages.message = decrypted.toString(CryptoJS.enc.Utf8);  	
			});
		} else {
			messages = Messages.find({}, {sort: { time: 0 }, limit : 20});	

		}
  		return messages;
	};

	
	Template.messages.events({
	  	'click .remove': function () {
			Messages.remove(this._id);
	  	}
	});

	Template.chat.rendered = function () { 
		var chatDiv = $(".messages");
		chatDiv.scrollTop(chatDiv.prop("scrollHeight"));
	};  	

	Template.header.events ({ 
		'click #expand_right': function(e, t) { 
			$(".messages").removeClass( "sized" ).addClass( "expanded" );
			$('.time').removeClass('pull-right chat_time');
			$('.divider').hide();
			$('.chat_form').addClass( "irc" );
			$(".messages").css( "left","0" ); 
			chat_width = "minimized";  
		},
		'click #contract_left': function(e, t) { 
			$(".messages").removeClass( "expanded" ).addClass( "sized" );
			$('.time').addClass('pull-right chat_time');
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
				} else {
					username = user.username;
				}

				message = message_form.value

				if (encryption) {
					secret = Session.get("secret");
	 				var encrypted =  CryptoJS.AES.encrypt(message, secret);
	   				var decrypted = CryptoJS.AES.decrypt(encrypted, secret);
					var decrypted = decrypted.toString(CryptoJS.enc.Utf8);  
				}

			 	if (message.length > 3 && $.trim(message) != '') {
		    		Messages.insert({
		      			name: username,
						owner: user._id, 
		      			message: message,
						avatar_img: avatar_img, 
		      			time: Date.now(),
		    		});

					var chatDiv = $(".messages");
					chatDiv.scrollTop(chatDiv.prop("scrollHeight"));
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

	Template.avatar_choose.events ({ 
		'click .choose_avatar': function(e, t) { 
			avatar_img = e.currentTarget.name;
			$("#avatar_image").attr("value", avatar_img); 
			var img = $("img#form_img_chosen");
			image_name="img/"+avatar_img; 
			img.attr("src",image_name ); 
			$("#"+e.currentTarget.id).css( "background-color", "yellow" );
		}
	});

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
	]

	Meteor.subscribe("avatars");

	Template.avatarList.avatars = function () {
		avatars = Avatars.find()
		return avatars; 
	};


	Template.avatarList.events({
	    'mouseover img.player' : function (e, t) {
			var player = $("img#"+this.avatar_id);
			player.addClass("player_big");
			player.removeClass("player_size");
		}, 
		'mouseout img.player' : function (e, t) {
			var player = $("img#"+this.avatar_id);
			player.removeClass("player_big");
			player.addClass("player_size");
		}, 

	});

	Template.avatarList.rendered = function() {
        $('body').on('click .perspective', function(e) { 
			if (e.pageY > 100 && e.pageY < 700 && e.pageX > 400 ) {
				var user = Meteor.user();
				if(user) {	
					var avatar = Avatars.findOne({avatar_id: user._id});
					if(avatar) {
						Avatars.update({_id:avatar._id}, { $set: { avatar_top: e.pageY-220, avatar_left: e.pageX-60}});
					} else {
						console.log("make yourself an avatar")
					}
				} else {
					console.log("to riot login")
				}
			}
        }); 
	} 


	Template.avatarForm.editing = function () {
		return Session.get("edit"); 
	}


	Template.avatarForm.events({
		'click a#edit': function (e, t) {
				Session.set("edit", true);	
			},
		'click button#change': function (e, t) {
				console.log($(e.target))
				var user = Meteor.user();						
				var avatar = Avatars.findOne({avatar_id: user._id});
				var el_name = t.find("#avatar_name");
				var el_message = t.find("#avatar_message");
				var el_image = t.find("#avatar_image");
				console.log(el_name, el_message, el_image)
				
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


	Template.npcList.npcs = [
		{name: "survile_box", id: "001", img: "servilliance.png", npc_message: "Party like it's 1984? <a id='yes'>Yes</a> / No", p_y: "200", p_x: "1000", h:"100", type:"rant"},
		{name: "survile_box", id: "002", img: "pink_player.png", npc_message: "z", p_y: "300", p_x: "1200", h:"40", type:"form"} 
	]


	Template.npcList.events({
		'contextmenu img.npc': function (e, t) {
			e.preventDefault();
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
			//e.preventDefault();
			id = this.id; 
			//console.log($(this.id));				
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
							//console.log(respJson.answer);
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

	$id = function ( id ) { 
		return document.getElementById( id ); 
	}

	Output = function ( msg ) { 
		var m = $id("file_messages"); 
		m.innerHTML = msg + m.innerHTML; 
	} 

	parseFile = function( file ) { 
		if ( file.type.indexOf("image") == 0 ) { 
			var reader = new FileReader(); 
			reader.onload = function(e) { 
				Output( "<p><strong>" + file.name + ":</strong><br />" + '<img src="' + e.target.result + '" /></p>' ); 
			} 
		//reader.readAsDataURL(file); 
		} 
	} 



}

if (Meteor.isServer) {
	Meteor.publish("avatars", function() {
		return Avatars.find();
	});
	Meteor.publish("messages", function() {
		return Messages.find();
	});

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
				var errorJson = JSON.parse(result.content);
				throw new Meteor.Error(result.statusCode, errorJson.error);
			}
		}
});

}


