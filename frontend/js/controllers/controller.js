myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout,$rootScope,apiService,$cookies,$stateParams) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        //$scope.categorydropdown = apiService.getCategoryDropdown({});

        angular.element(document).ready(function () {
            var cust = $.jStorage.get("customerDetails");
            if(cust)
            {
                var customer_id = cust.CustomerID;
                var customer_name = cust.Name;
            }
            else {
                var customer_id ="";
                var customer_name ="";
            }
            apiService.get_session({customer_id:customer_id,customer_name:customer_name}).then( function (response) {
                $cookies.put("csrftoken",response.data.csrf_token2);
                $cookies.put("session_id",response.data.session_id);
                $.jStorage.set("csrftoken",response.data.csrf_token2);
                //console.log(response.data);
            });
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    $scope.$apply(function(){
                        $scope.position = position;
                        console.log(position);
                    });
                });
            }
        });
        

        

    })

    .controller('ChatCtrl', function ($scope, $rootScope,TemplateService, $timeout,$http,apiService,$state,$sce,$cookies,$location,$compile,$uibModal,$stateParams,Idle) {
       //angular.element(document).ready(function () {
            $scope.$on('IdleStart', function() {
                // the user appears to have gone idle
                console.log("Idle started");
            });
       //});
        $rootScope.$on('IdleTimeout', function() {
            // var scope = angular.element(document.getElementById('changepwd')).scope();
            // scope.logout();
            if($.jStorage.get("timer")==25)
            {
                msg = {Text:"Hello! it looks like you've been inactive, type  help if you need anything ",type:"SYS_EMPTY_RES"};
                $rootScope.pushSystemMsg(0,msg); 
                // end their session and redirect to login
                Idle.setIdle(10);
                Idle.watch();
                $.jStorage.set("timer",35);
            }
            else if($.jStorage.get("timer")==35)
            {
                msg = {Text:"It’s been a while since your last response. Please respond within the next few minutes or this chat will be ended.",type:"SYS_EMPTY_RES"};
                $rootScope.pushSystemMsg(0,msg); 
                // end their session and redirect to login
                Idle.setIdle(95);
                Idle.watch();
                $.jStorage.set("timer",95);
            }
            else if($.jStorage.get("timer")==95)
            {
                msg = {Text:"It appears that you’ve been inactive for a few minutes now. Please feel free to use our live chat service if you have any questions.",type:"SYS_EMPTY_RES"};
                $rootScope.pushSystemMsg(0,msg); 
                // end their session and redirect to login
                // Idle.setIdle(10);
                // $.jStorage.set("timer",35);
            }
        });
        var username=$location.search().username; 
        var password=$location.search().password;
        $scope.timerflag=true;
        if(username && password)
        {   
            if($.jStorage.get("username") && $.jStorage.get("username")==username)
            {
                
            }
            else
            {

            
                console.log(username);
                console.log(password);
                console.log("Exist");
                var formData = {customer:username,pword:password};
                angular.element(document).ready(function () {
                    var url = 'http://adserver.i-on.in:9000/crm?customer='+username+'&pword='+password;
                    $.ajax({
                        url: url,
                        dataType: "json",
                        async: true,
                        cache: false,
                        timeout: 3000,
                        headers: { "AuthKey": "685e968a14eaeeade097555e514cf2c1" },
                        type: "GET",
                        success: function (data) {
                            console.log(data,"crm");
                            $.jStorage.set("customerDetails",data.customerDetails);
                            $.jStorage.set("guidance",data.guidance);
                            $.jStorage.set("username",username);
                            location.reload();
                        },
                    });
                });
            }
            // apiService.serverlogin(formData).then(function (callback){

            // });
        }
        else
        {
            console.log("Doesnot");
            $.jStorage.set("customerDetails",{});
            $.jStorage.set("guidance",{});
            $.jStorage.set("username","");
        }
        $rootScope.trustedHtml = function (plainText) {
            return $sce.trustAsHtml(plainText);
        };
        var url = $location.absUrl().split('?')[0];
        // console.log(url);
        // console.log(window.parent.location);
         var pId = $location.path().split("/")[3]||"Unknown";    //path will be /person/show/321/, and array looks like: ["","person","show","321",""]
        //console.log(document.baseURI);
        $scope.getParentUrl =function() {
            var isInIframe = (parent !== window),
                parentUrl = null;

            if (isInIframe) {
                parentUrl = document.referrer;
                console.log("in iframe");
            }

            return parentUrl;
        };
        
        //console.log($scope.getParentUrl());// returns blank if cross domain | if same domain returns null
        var url2 = (window.location != window.parent.location)? document.referrer: document.location.href;
        //console.log(url2);// returns blank if cross domain | returns url
        //console.log(document.referrer);// returns blank if cross domain | returns url
        // if(!window.top.location.href)
        //     console.log("Different domain");
        // else    
        //     console.log("same domain");
        //console.log(Browser.getParentUrl());
        $rootScope.validDomain = false;
        var referrerurl = $scope.getParentUrl();
        if(referrerurl == null || referrerurl == "http://104.46.103.162:8096/" || referrerurl == "http://localhost/flatlab/")
            $rootScope.validDomain = true;
        $rootScope.validDomain = true;
        $rootScope.languagelist = [
            {id:"en" , name:"English"},
            {id:"hi" , name:"Hindi"},
            {id:"mr" , name:"Marathi"},
            {id:"gu" , name:"Gujarati"},
            {id:"ta" , name:"Tamil"},
        ];
        $rootScope.changeLanguage = function(lang) {
            $rootScope.selectedLanguage = lang;
            $.jStorage.set("language", $rootScope.selectedLanguage.id);
        };
        if(!$.jStorage.get("language"))
        {
            $rootScope.selectedLanguage = $rootScope.languagelist[0];
            $.jStorage.set("language", $rootScope.selectedLanguage.id);
        }
        else 
        {
            
            $rootScope.selectedLanguage = $.jStorage.get("language");
            $("#language_list").val($rootScope.selectedLanguage).trigger('change');
            
            var v_obj = _.find($rootScope.languagelist, function(o) { return o.id == $rootScope.selectedLanguage; });
            $rootScope.selectedLanguage=v_obj;
            
            var v_index = _.findIndex($rootScope.languagelist, function(o) { return o.id == $rootScope.selectedLanguage.id; });
            var langname = v_obj.name;
            $("#language_list option:contains(" + langname + ")").prop('selected', true);
            //$('#language_list').find('option:nth-child('+v_index+')').prop('selected', true);            
        }
        $scope.formSubmitted = false;
        $scope.loginerror=0;
        $rootScope.isLoggedin = false;
        
        if($.jStorage.get("isLoggedin"))
            $rootScope.isLoggedin = true;

        
        $scope.login = function(username,password,language)
        {

            // $.jStorage.flush();
            // if(username == "admin@exponentiadata.com" && password == "admin")
            // {
            //     $.jStorage.set("id", 1);
            //     $.jStorage.set("name", "Admin");
            //     $.jStorage.set("language", language.id);
            //     $.jStorage.set("email", username);
            //     $.jStorage.set("isLoggedin", true);
            //     $rootScope.isLoggedin = true;
            // }
            // else 
            // {
            //     $scope.loginerror = -1;
            // }
            $scope.formData = {userid:username,password:password};
            
            apiService.login($scope.formData).then(function (callback){
                //console.log(callback);
                if(callback.data.data.status == "0")
                {
                    $.jStorage.flush();
                    //if(username == "admin@exponentiadata.com" && password == "admin")
                    {
                        $.jStorage.set("id", 1);
                        $.jStorage.set("name", "Admin");
                        $.jStorage.set("language", language.id);
                        $.jStorage.set("email", username);
                        $.jStorage.set("isLoggedin", true);
                        $rootScope.isLoggedin = true;
                    }
                    
                }
                else 
                {
                    $scope.loginerror = -1;
                }
            });
            
        };
        $scope.logout = function()
        {
            $.jStorage.flush();
            $rootScope.isLoggedin = false;
            $rootScope.chatlist = [];
            $.jStorage.set("showchat",false);
            $rootScope.chatOpen = false;
            $rootScope.links = [];
            $rootScope.firstMsg = true;
            // var cust = $.jStorage.get("customerDetails");
            // console.log(cust.Name);
            var msg = {Text:"Hi , How may I help you ?",type:"SYS_FIRST"};
            $rootScope.pushSystemMsg(0,msg); 
        };
        $rootScope.isLoggedin = true;
        $rootScope.autocompletelist = [];
        $rootScope.chatOpen = false;
        $rootScope.showTimeoutmsg = false;
        $rootScope.firstMsg=false;
        $rootScope.chatmsg = "";
        $rootScope.chatmsgid = "";
        $rootScope.autocategory = "";
        $rootScope.autolink = "";
        $rootScope.msgSelected = false;
        $rootScope.chatlist = [];
        // var mylist = $.jStorage.get("chatlist");
        // if(!mylist || mylist == null)
        //     $rootScope.chatlist = [];
        // else
        //     $rootScope.chatlist = $.jStorage.get("chatlist");
        $rootScope.autolistid="";
        $rootScope.autolistvalue="";
        $rootScope.showMsgLoader=false;
        $rootScope.rate_count= 0;
        $rootScope.getCookie = function(c_name)
		{
			if (document.cookie.length > 0)
			{
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1)
				{
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start,c_end));
				}
			}
			return "";
		};
        $rootScope.scrollChatWindow = function() {
            $timeout(function(){
                var chatHeight = $("ul.chat").height();
                $('.panel-body').animate({scrollTop: chatHeight});
            });
        };
        $rootScope.iframeHeight = window.innerHeight-53;
        $rootScope.categorylist = [];
        apiService.getCategoryDropdown({}).then( function (response) {
            $rootScope.categorylist = response.data.data;
            $rootScope.selectedCategory = $rootScope.categorylist[0];
            $("div#all_questions").css("background","none");
        });
        //$rootScope.categorylist = $scope.categorydropdown.data;
        // $rootScope.categorylist =  [
        //     {id:"default",name:"Choose a Category"},
        //     {id:"a1",name:"Account"},
        //     {id:"b1",name:"Billing"},
        //     {id:"br1",name:"Browser"},
        //     {id:"r1",name:"Renewal"},
        //     {id:"nc1",name:"New Connection"},
        // ];
        $rootScope.links = [];
        
        $rootScope.pushLinkmsg = function(index,link) {
            //alert(link);
              
            $rootScope.pushQuestionMsg(index,link);
        };
        $rootScope.getCategoryFAQ = function(category) {
            $scope.formData = { user_input:category._id,csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id") };
            //console.log($scope.formData);
            apiService.getCategoryFAQ($scope.formData).then( function (response) {
                $rootScope.links = response.data;
                //console.log(response.data);
            });
        };
        
        $rootScope.getCategoryQuestions = function(category) {
            categoryid = category._id;
            $rootScope.links = [];
            $scope.formData = { category:categoryid };
            //console.log(category.name);
            apiService.getCategoryQuestions($scope.formData).then( function (response) {
                $rootScope.links = response.data.data;
                
                $rootScope.links.type = "cat_faq";
                if(category.name == "Choose a Category")
                    $("div#all_questions").css("background","none");
                else
                    $("div#all_questions").css("background","#EF9C6D");
                
                $timeout(function(){
                    var chatHeight = $(".all_questions").height();
                    $('#faqs_dropdown').animate({scrollTop: chatHeight});
                });
            });
        };
        $timeout(function(){
            $(document).on('click', '.portalapp', function(){ 
                var linktext=$(this).text();
                $rootScope.pushPortalLink($(this).attr("data-id"),$(this).attr("id"));
                // if($(this).text().search(new RegExp("ION Portal", "i"))>=0)
                // {
                //     $rootScope.pushPortalLink($(this).attr("data-id"),$(this).attr("id"));
                // }
                // else if($(this).text().search(new RegExp("ION app", "i"))>=0)
                // {
                //     $rootScope.pushPortalLink($(this).attr("data-id"),$(this).attr("id"));
                // }
            });
            $(document).on('click', '.faqques a', function(){ 
                $rootScope.showFAQAns(this);
            });
            
        });
        $rootScope.getDatetime = function() {
            //return (new Date).toLocaleFormat("%A, %B %e, %Y");
            return currentTime = new Date();
        };
        $rootScope.chatText = "";
        $rootScope.answers = "";
        $rootScope.getAutocomplete = function(chatText) {
            if($rootScope.answers == '')
            {
                $rootScope.showTimeoutmsg = false;
                // if($rootScope.showTimeoutmsg == false && chatText=="") 
                // {
                //     $timeout(function () {
                //         $rootScope.showTimeoutmsg = true;
                //         msg = {Text:"Any Confusion ? How May I help You ?",type:"SYS_INACTIVE"};
                //         $rootScope.pushSystemMsg(0,msg);
                //     },60000);
                // }
                $rootScope.chatText = chatText;
                if($(".chatinput").val() == "" || $(".chatinput").val() == " " || $(".chatinput").val() == null)
                    $rootScope.autocompletelist = [];
                else {
                    $rootScope.chatdata = { string:$rootScope.chatText};
                    apiService.getautocomplete($rootScope.chatdata).then(function (response){
                        // console.log(response.data);
                        $rootScope.autocompletelist = response.data.data;
                    });
                }
                var languageid = $.jStorage.get("language");
                $scope.formData = {"text": chatText,"language":languageid };
                apiService.translate($scope.formData).then( function (response) {
                    //$(".chatinput").val(response.data.data);
                    //console.log(response.data.data);
                });
            }
        };
        $rootScope.showFAQAns = function(e) {
            var category = $(e).attr("data-category");
            $("#faqs_category option:contains(" + category + ")").attr('selected', 'selected');
            var v_index = _.findIndex($rootScope.categorylist, function(o) { return o.name == category; });
            var v_obj = _.find($rootScope.categorylist, function(o) { return o.name == category; });
            // console.log(v);
            // console.log($rootScope.selectedCategory);
            // //$("#faqs_category").val("Single2").trigger('change');
            // console.log(category);
            if($rootScope.selectedCategory == v_obj)
            {}
            else
            {
                $rootScope.selectedCategory = $rootScope.categorylist[v_index];
                $rootScope.getCategoryQuestions(v_obj);
            }
            
            $(".faqans").slideUp("slow");
            if($(e).parent().parent().parent().find('.faqans').is(":visible") == false)
                $(e).parent().parent().parent().find('.faqans').slideDown();
            //$rootScope.scrollChatWindow();
        };
        $rootScope.pushSystemMsg = function(id,value) {
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.chatlist.push({id:"id",msg:value,position:"left",curTime: $rootScope.getDatetime()});
            //$.jStorage.set("chatlist",$rootScope.chatlist);
            $timeout(function(){
                $rootScope.scrollChatWindow();
            },1500);
            $timeout(function(){
                $rootScope.autocompletelist = [];
            },1000);
        };
        if(!$rootScope.firstMsg)
        {
            $rootScope.firstMsg = true;
            var cust = $.jStorage.get("customerDetails");
            var cust_name = "";
            if(cust.Name)
                cust_name = cust.Name;
            var msg = {Text:"Hi "+cust_name+", I'm your I-on assistant , ask me something from the faq or press the technical queries button below",type:"SYS_FIRST"};
            //msg = {Text:"Hi, How may I help you ?",type:"SYS_FIRST"};
            $rootScope.pushSystemMsg(0,msg);  
        }
        $scope.trustedHtml = function (plainText) {
            return $sce.trustAsHtml(plainText);
        };
        //$scope.textviewbtn = "View More";
        $(document).on('click', '.texttoggle', function(){ 
            var e = $(this);
            //$(this).parent().parent().find('.faqless').toggle();
            //$(this).parent().parent().find(".faqless").children('.faqmore').toggle("fast").promise().done(function(){
            //$(this).parent().parent().find(".faqless").children('.faqmore').fadeIn("fast").promise().done(function(){
                if ($(this).parent().parent().find('.faqmore').is(':visible') === true ){
                    $(this).parent().parent().find(".faqless").children('.faqdot').fadeIn("fast");
                    $(this).parent().parent().find(".faqless").children('.faqmore').fadeOut("fast");
                    
                    $(e).text("View More");
                    console.log("Notvisible");
                }
                else {
                    $(this).parent().parent().find(".faqless").children('.faqdot').fadeOut("fast");
                    $(this).parent().parent().find(".faqless").children('.faqmore').fadeIn("fast");
                    $(e).text("View Less");
                    console.log("visible");
                }
            //});
            //$timeout(function() {
                
                    
            //},1000);
            
            
        });
        $rootScope.pushQuesMsg = function(id,value) {
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            var value2 = $rootScope.links;
            if(value2[id].link != "" )
            {
                var linkdata="";
                var prev_res = false;
                
                final_link = value2[id].link.split("<br>");
                var languageid = $.jStorage.get("language");
                $scope.formData = {"items": final_link,"language":languageid,arr_index:id };
                apiService.translatelink($scope.formData).then( function (response) {
                    value2.queslink=response.data.data.linkdata;
                    value2.queslink = $sce.trustAsHtml(value2.queslink);
                    msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                    $timeout(function(){
                        $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                        $rootScope.showMsgLoader=false;
                        $rootScope.scrollChatWindow();
                    },2000);
                });
                // _.each(final_link, function(value, key) {
                //     var languageid = $.jStorage.get("language");
                //     $scope.formData = {"text": value,"language":languageid };
                //     // var dummy = "id='"+key+"' data-id='"+id+"' ng-click='pushPortalLink("+id+","+key+");'";
                //     // linkdata += "<p class='portalapp' "+dummy+">"+value+"</p>";
                    
                //     // value2.queslink = $sce.trustAsHtml(value2.queslink);
                //     // msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                //     // $timeout(function(){
                //     //     $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                //     //     $rootScope.showMsgLoader=false;
                //     //     $rootScope.scrollChatWindow();
                //     // },2000);
                //     console.log(key,"k");
                //     if(key == 0)
                //         prev_res = true;
                //     else
                //         prev_res = false;
                //     console.log(prev_res);
                //     if(prev_res)
                //     {    
                //         apiService.translate($scope.formData).then( function (response) {
                //             //console.log(response);
                //             prev_res = true;
                //             if(response.xhrStatus == "complete")
                //             {
                //                 var dummy = "id='"+key+"' data-id='"+id+"' ng-click='pushPortalLink("+id+","+key+");'";
                //                 linkdata += "<p class='portalapp' "+dummy+">"+response.data.data+"</p>";
                //                 console.log(linkdata);
                //                 console.log(response.data.data);
                //                 if(key == (final_link.length-1))
                //                 {
                //                     //console.log(key+"-key,length:"+final_link.length);
                //                     value2.queslink=linkdata;
                //                     console.log(value2.queslink);
                //                     value2.queslink = $sce.trustAsHtml(value2.queslink);
                    
                //                     msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                //                     $timeout(function(){
                //                         $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                //                         $rootScope.showMsgLoader=false;
                //                         $rootScope.scrollChatWindow();
                //                     },2000);
                //                     console.log($rootScope.chatlist);
                //                 }
                //                 return;
                //             }
                            
                //         }).finally(function() {
                            
                //         });
                //     }
                // });
                //value2.queslink=linkdata;
            }
            
            else
            {    
                value2.queslink = value2[id].answers.replace(new RegExp("../static/data_excel/", 'g'), adminurl2+'static/data_excel/');
                value2.queslink = $sce.trustAsHtml(value2.queslink);
            
                msg2={"queslink":angular.copy(value2.queslink),type:"cat_faqlink"};
                $timeout(function(){
                    $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                    $rootScope.showMsgLoader=false;
                    $rootScope.scrollChatWindow();
                },2000);
            }
            
            // value2.queslink = $sce.trustAsHtml(value2.queslink);
            
            // msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
            // $timeout(function(){
            //     $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
            //     $rootScope.showMsgLoader=false;
            //     $rootScope.scrollChatWindow();
            // },2000);
            // $el = $( "ul.chat li" ).last();
            // console.log($el);
            // $compile($el)($scope);
            
            //$.jStorage.set("chatlist",$rootScope.chatlist);
            
            
        };
        $rootScope.pushPortalLink= function(id,type) {
            console.log(id,"index");//index of array
            console.log(type,"value");// 0-ion portal ,1-ion app
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = type;
            var value3 = $rootScope.links;
            if(value3[id].answers != "")
            {
                var answer1 =new Array();
                answer1 = value3[id].answers.split("(2nd)");
                if(type==0)
				    answer1 = answer1[0];
                else if(type==1)
                    answer1 = answer1[1];
                answer1 = answer1.replace("\n", "<br />", "g");
                value3.queslink=answer1;
                
            }
            value3.queslink = $sce.trustAsHtml(value3.queslink);
            //$compile(linkdata)($scope);
            msg2={"queslink":angular.copy(value3.queslink),type:"cat_faqlink"};
            $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
            $rootScope.showMsgLoader=false;
            //$.jStorage.set("chatlist",$rootScope.chatlist);
            $timeout(function(){
                $rootScope.scrollChatWindow();
            });
        };
        
        $rootScope.showChatwindow = function () {
            // newlist = $.jStorage.get("chatlist");
            // if(!newlist || newlist == null)
            // {
            //     $rootScope.firstMsg = false;
            // }
            // else
            // { 
            //     $rootScope.firstMsg = true;
            // }
            //$.jStorage.set("showchat",true);
            
            $('#chat_panel').slideDown("slow");
            //$('#chat_panel').find('.panel-body').slideDown("fast");
            //$('#chat_panel').find('.panel-footer').slideDown("slow");
            $('.panel-heading span.icon_minim').removeClass('panel-collapsed');
            $('.panel-heading span.icon_minim').removeClass('glyphicon-plus').addClass('glyphicon-minus');
            $(".clickImage").hide();
            $rootScope.chatOpen = true;
            $rootScope.scrollChatWindow();
        };
        $rootScope.minimizeChatwindow = function() {
            $.jStorage.set("showchat",false);
            $rootScope.showTimeoutmsg = false;
            $rootScope.autocompletelist = [];
            $('#chat_panel').slideUp();
            //$('#chat_panel').find('.panel-body').slideUp("fast");
            //$('#chat_panel').find('.panel-footer').slideUp("fast");
            $('.panel-heading span.icon_minim').addClass('panel-collapsed');
            $('.panel-heading span.icon_minim').addClass('glyphicon-plus').removeClass('glyphicon-minus');
            $(".clickImage").show( "fadeIn");
        };
        $scope.getmaillink= function(w){
            if(w=='mah')
            {
                var msg = {Text:" Email address for Maharashtra is <a href='mailto:customercare.mum@i-on.in'>Customercare.mum@i-on.in</a>",type:"SYS_AUTO"};
                $rootScope.pushSystemMsg(0,msg); 
            }
            else if(w=='other')
            {
                var msg = {Text:" Email address for other states is <a href='mailto:customercare.blr@i-on.in'>Customercare.blr@i-on.in</a>",type:"SYS_AUTO"};
                $rootScope.pushSystemMsg(0,msg); 
            }
        };
        $scope.getcallink= function(w){
            if(w=='mah')
            {
                var msg = {Text:"Toll free number for Maharashtra is <a href='tel:18001209636'>18001209636</a>",type:"SYS_AUTO"};
                $rootScope.pushSystemMsg(0,msg); 
            }
            else if(w=='other')
            {
                var msg = {Text:" Toll free number for other states is <a href='tel:18001035466'>18001035466</a>",type:"SYS_AUTO"};                $rootScope.pushSystemMsg(0,msg); 
            }
        };
        $scope.mailus = function(){
            var msg = {type:"SYS_MAIL"};
            $rootScope.pushSystemMsg(0,msg); 
        };
        $scope.callus = function(){
            var msg = {type:"SYS_CALL"};
            $rootScope.pushSystemMsg(0,msg); 
        };
        $(document).on('click', 'a.mailus', function(){ 
            $scope.mailus();
        });
        $(document).on('click', 'a.callus', function(){ 
            $scope.callus();
        });
        $rootScope.pushMsg = function(id,value) {
            if($rootScope.answers == "")
            {
                if(value != "")
                {
                    $rootScope.msgSelected = true;
                    $rootScope.chatmsgid = id;
                    $rootScope.chatmsg = value;
                    $rootScope.autocompletelist = [];
                    $rootScope.chatlist.push({id:"id",msg:value,position:"right",curTime: $rootScope.getDatetime()});
                    //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
                    $rootScope.getSystemMsg(id,value);
                    //$.jStorage.set("chatlist",$rootScope.chatlist);
                    $rootScope.msgSelected = false;
                    $rootScope.showMsgLoader=true;
                    $rootScope.scrollChatWindow();
                    $timeout(function(){
                        $rootScope.autocompletelist = [];
                    },1000);
                }
            }
            else 
            {
                $rootScope.pushAutoMsg(id,value,$rootScope.answers,$rootScope.autocategory,$rootScope.autolink);
            }
        };
        $rootScope.pushAutoMsg = function(id,value,answer,autocat,autolink) {
            $rootScope.msgSelected = true;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.answers = answer;
            console.log(answer,"ans");
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:id,msg:value,position:"right",curTime: $rootScope.getDatetime()});
            // var automsg = { Text: answer , type : "SYS_AUTO"};
            // $rootScope.pushSystemMsg(id,automsg);
            // $rootScope.showMsgLoader = false;
            // //$.jStorage.set("chatlist",$rootScope.chatlist);
            
            // console.log($rootScope.selectedCategory);
            // //$("#faqs_category").val("Single2").trigger('change');
            // console.log(category);
            if(autocat == "")
            {
                console.log("No cat");
                queslink=$rootScope.answers;
                queslink = $sce.trustAsHtml(queslink);
                msg2={"Text":angular.copy(queslink),type:"SYS_AUTO"};
                $timeout(function(){
                    $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                    $rootScope.showMsgLoader=false;
                    $rootScope.scrollChatWindow();
                },2000);
            }
            else 
            {
                var category = autocat;
                $("#faqs_category option:contains(" + category + ")").attr('selected', 'selected');
                var v_index = _.findIndex($rootScope.categorylist, function(o) { return o.name == category; });
                var v_obj = _.find($rootScope.categorylist, function(o) { return o.name == category; });
                if($rootScope.selectedCategory == v_obj)
                {
                    console.log("same cate");
                    $rootScope.selectedCategory = $rootScope.categorylist[v_index];
                    //$rootScope.getCategoryQuestions(v_obj);
                    var l_index = _.findIndex($rootScope.links, function(o) { return o.questions == value; });
                    var value2 = $rootScope.links;
                    if($rootScope.autolink != "" )
                    {
                        var linkdata="";
                        var prev_res = false;
                        console.log("First link");
                        final_link = $rootScope.autolink.split("<br>");
                        var languageid = $.jStorage.get("language");
                        $scope.formData = {"items": final_link,"language":languageid,arr_index:l_index };
                        apiService.translatelink($scope.formData).then( function (response) {
                            value2.queslink=response.data.data.linkdata;
                            value2.queslink = $sce.trustAsHtml(value2.queslink);
                            msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                            $timeout(function(){
                                $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                                $rootScope.showMsgLoader=false;
                                $rootScope.scrollChatWindow();
                            },2000);
                        });
                    }
                    
                    else
                    {    
                        console.log("2nd link");
                        //value2.queslink = $rootScope.answers.replace(new RegExp("../static/data_excel/", 'g'), adminurl2+'static/data_excel/');
                        value2.queslink = $rootScope.answers;
                        value2.queslink = $sce.trustAsHtml(value2.queslink);
                    
                        msg2={"queslink":angular.copy(value2.queslink),type:"cat_faqlink"};
                        $timeout(function(){
                            $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                            $rootScope.showMsgLoader=false;
                            $rootScope.scrollChatWindow();
                        },2000);
                    }
                }
                else
                {
                    $rootScope.selectedCategory = $rootScope.categorylist[v_index];
                    //$rootScope.getCategoryQuestions(v_obj);
                    console.log(v_obj,"cat obj");
                    categoryid = v_obj._id;
                    $rootScope.links = [];
                    $scope.formData = { category:categoryid };
                    //console.log(category.name);
                    apiService.getCategoryQuestions($scope.formData).then( function (response) {
                        $rootScope.links = response.data.data;
                        
                        $rootScope.links.type = "cat_faq";
                        if(category.name == "Choose a Category")
                            $("div#all_questions").css("background","none");
                        else
                            $("div#all_questions").css("background","#EF9C6D");
                        
                        $timeout(function(){
                            var chatHeight = $(".all_questions").height();
                            $('#faqs_dropdown').animate({scrollTop: chatHeight});
                        });
                        var l_index = _.findIndex($rootScope.links, function(o) { return o.questions == value; });
                        console.log(l_index,"index");
                        console.log(value,"que");
                        console.log($rootScope.links,"link");
                        var value2 = $rootScope.links;
                        if($rootScope.autolink != "" )
                        {
                            var linkdata="";
                            var prev_res = false;
                            console.log("First link");
                            final_link = $rootScope.autolink.split("<br>");
                            var languageid = $.jStorage.get("language");
                            $scope.formData = {"items": final_link,"language":languageid,arr_index:l_index };
                            apiService.translatelink($scope.formData).then( function (response) {
                                value2.queslink=response.data.data.linkdata;
                                value2.queslink = $sce.trustAsHtml(value2.queslink);
                                msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                                $timeout(function(){
                                    $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                                    $rootScope.showMsgLoader=false;
                                    $rootScope.scrollChatWindow();
                                },2000);
                            });
                        }
                        
                        else
                        {    
                            console.log("2nd link",$rootScope.answers);
                            var linkdata="";
                            var prev_res = false;
                            if(autolink != "")
                            {
                                final_link = autolink.split("<br>");
                                var languageid = $.jStorage.get("language");
                                $scope.formData = {"items": final_link,"language":languageid,arr_index:l_index };
                                apiService.translatelink($scope.formData).then( function (response) {
                                    value2.queslink=response.data.data.linkdata;
                                    value2.queslink = $sce.trustAsHtml(value2.queslink);
                                    msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                                    $timeout(function(){
                                        $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                                        $rootScope.showMsgLoader=false;
                                        $rootScope.scrollChatWindow();
                                    },2000);
                                });
                                
                            }
                            else
                            {    
                                value2.queslink = answer;
                                value2.queslink = $sce.trustAsHtml(value2.queslink);
                            
                                msg2={"queslink":angular.copy(value2.queslink),type:"cat_faqlink"};
                                $timeout(function(){
                                    $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                                    $rootScope.showMsgLoader=false;
                                    $rootScope.scrollChatWindow();
                                },2000);
                            }
                        
                            // msg2={"queslink":angular.copy(value2.queslink),type:"cat_faqlink"};
                            // $timeout(function(){
                            //     $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                            //     $rootScope.showMsgLoader=false;
                            //     $rootScope.scrollChatWindow();
                            // },2000);
                        }
                    });
                    
                }
            }
            
            // var value3 = {};
            // if($rootScope.answers != "")
            // {
            //     var answer1 =new Array();
            //     answer1 = $rootScope.answers.split("(2nd)");
            //     // if(type==0)
			// 	//     answer1 = answer1[0];
            //     // else if(type==1)
            //     //     answer1 = answer1[1];
            //     answer1 = answer1[0];
            //     answer1 = answer1.replace("\n", "<br />", "g");
            //     value3.queslink=answer1;
                
            // }
            // value3.queslink = $sce.trustAsHtml(value3.queslink);
            // //$compile(linkdata)($scope);
            // msg2={"queslink":angular.copy(value3.queslink),type:"cat_faqlink"};
            // $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
            // $rootScope.showMsgLoader=false;




            $rootScope.msgSelected = false;
            $rootScope.chatmsgid = "";
            $rootScope.chatmsg = "";
            $rootScope.answers = "";
            $(".chatinput").val("");
            $rootScope.autolistid = "";
            $rootScope.chatText = "";
            $rootScope.scrollChatWindow();
            $timeout(function(){
                $rootScope.autocompletelist = [];
            },1000);
        };
        $rootScope.pushQuestionMsg = function(id,value) {
            $rootScope.msgSelected = true;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:id,msg:value,position:"right",curTime: $rootScope.getDatetime()});
            $rootScope.getQuestionMsg(id,value);
            $rootScope.msgSelected = false;
            //$rootScope.showMsgLoader=true;
            $rootScope.scrollChatWindow();
        };
        // if($.jStorage.get("showchat"))
        //     $rootScope.showChatwindow();
        // else
        //     $rootScope.minimizeChatwindow();
        $rootScope.showQuerybtn = function() {
            var msg = {type:"SYS_QUERY"};
            $rootScope.pushSystemMsg(0,msg); 
        }; 
        $rootScope.ratecardSubmit = function(coldata,rowdata) {
            console.log(coldata,rowdata);
        };
        // $rootScope.getDthlinkRes = function(colno,lineno,dthlink) {
        //     //console.log(colno,lineno,dthlink);
        //     mysession = $.jStorage.get("sessiondata");
        //     //console.log(mysession);
        //     mysession.DTHlink=dthlink;
        //     mysession.DTHline=lineno;
        //     mysession.DTHcol=colno;
        //     formData = mysession;
        //     //console.log(formData);
        //     apiService.getDthlinkRes(formData).then(function (data){
        //         angular.forEach(data.data.tiledlist, function(value, key) {
        //             if(value.type=="DTHyperlink")
        //             {
        //                 $rootScope.DthResponse(0,data.data);
                        
                        
        //             }
        //         });
        //     });
        // };
        $rootScope.getProcessTree = function(process) {
            var cust = $.jStorage.get("customerDetails");
            if(cust)
            {
                var customer_id = cust.CustomerID;
                var customer_name = cust.Name;
            }
            else {
                var customer_id ="";
                var customer_name ="";
            }
            formData = {customer_id:customer_id,customer_name:customer_name ,user_input:process,csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id") };
               
            $rootScope.showMsgLoader = true;
            apiService.outquery(formData).then(function (data){
                    
                angular.forEach(data.data.tiledlist, function(value, key) {
                    if(value.type=="text")
                    {
                        $rootScope.pushSystemMsg(0,data.data);
                        $rootScope.showMsgLoader = false;
                        
                        
                        return false;
                    }
                    // if(value.type=="rate card")
                    // {
                    //     $rootScope.pushSystemMsg(0,data.data.data);
                    //     $rootScope.showMsgLoader = false;
                        
                        
                    //     return false;
                    // }
                    if(value.type=="DTHyperlink")
                    {
                        $rootScope.DthResponse(0,data.data); 
                        $rootScope.showMsgLoader = false; 
                    }
                    // else if(value.type=="Instruction")
                    // {
                    // 	$rootScope.InstructionResponse(0,data.data.data);  
                    // }
                    if(value.type=="FAQ")
                    {
                        // var reversefaq = new Array();
                        // //console.log(data.data.tiledlist[0].FAQ);
                        // reversefaq = _.reverse(data.data.tiledlist[0].FAQ);
                        // data.data.tiledlist[0].FAQ = reversefaq;
                        //console.log(reversefaq);
                        $rootScope.FAQResponse(0,data.data);  
                        $rootScope.showMsgLoader = false;
                    }
                });
                

                //$.jStorage.set("sessiondata",data.data.data.session_obj_data);
            }).catch(function (reason) {
                //console.log(reason);
                msg = {Text:"Nope ! didn't catch that . Do you want to <a href='#' class='mailus'>Mail Us</a>",type:"SYS_EMPTY_RES"};
                $rootScope.pushSystemMsg(0,msg);
                $scope.timerflag = true; 
                $rootScope.showMsgLoader=false;
            });
        };
        $rootScope.getDthlinkRes = function(stage,dthlink,Journey_Name) {
            //console.log(colno,lineno,dthlink);
            //mysession = $.jStorage.get("sessiondata");
            var mysession = {};
            
            //console.log(stage+"-"+dthlink);
            mysession.DTHlink=dthlink;
            //mysession.DTHline=lineno;
            //mysession.DTHcol=colno;
            mysession.DTHstage=stage;
            mysession.Journey_Name = Journey_Name;
            // formData = {};
            // formData.DTHcol = colno;
            // formData.DTHline = lineno;
            // formData.DTHlink = dthlink;
            formData = mysession;
            formData.csrfmiddlewaretoken=$rootScope.getCookie("csrftoken");
            formData.user_id=$cookies.get("session_id");
            //console.log(formData);
            $rootScope.showMsgLoader = true;
            var cust = $.jStorage.get("customerDetails");
            if(cust)
            {
                var customer_id = cust.CustomerID;
                var customer_name = cust.Name;
            }
            else {
                var customer_id ="";
                var customer_name ="";
            }
            formData.customer_id = customer_id;
            formData.customer_name = customer_name;
            apiService.getDthlinkRes(formData).then(function (data){
                angular.forEach(data.data.tiledlist, function(value, key) {
                    if(value.type=="DTHyperlink")
                    {
                        $rootScope.DthResponse(0,data.data);
                        $rootScope.showMsgLoader = false;
                    }
                });
            }).catch(function (reason) {
                //console.log(reason);
                msg = {Text:"Nope ! didn't catch that . Do you want to <a href='#' class='mailus'>Mail Us</a>",type:"SYS_EMPTY_RES"};
                $rootScope.pushSystemMsg(0,msg); 
                $rootScope.showMsgLoader=false;
            });
        };
        $rootScope.DthResponse = function(id,data) {
            // if(data.tiledlist[0].DT.length > 0 || data.tiledlist[0].Text != "")
            // {
        
            //     if(data.tiledlist[0].DT.length > 0 || ( data.tiledlist[0].Text != "" && data.tiledlist[0].Text)  )
            //         $rootScope.pushSystemMsg(id,data);
            
            // }
            var dtstage = data.tiledlist[0].Stage;
            var dtstage = dtstage.replace(".", "");
            data.tiledlist[0].bgstage = dtstage;
            $rootScope.pushSystemMsg(id,data);
        };
        
        $rootScope.FAQResponse = function (id,data) {
            $rootScope.pushSystemMsg(id,data);
            $rootScope.showMsgLoader = false; 
        };
        $rootScope.InstructionResponse = function(id,data) {
            $rootScope.pushSystemMsg(id,data);
			console.log(data);
            $('#myCarousel').carousel({
                interval: false,
                wrap: false
            });
            $('#myCarousel').find('.item').first().addClass('active');
            $rootScope.showMsgLoader = false; 
        };
        $rootScope.getQuestionMsg = function (index,value) {
            $rootScope.pushQuesMsg(index,value);
            $rootScope.showMsgLoader = false; 
        };
        $rootScope.getSystemMsg = function(id,value){
            //console.log("id",id);
            var cust = $.jStorage.get("customerDetails");
            if(cust)
            {
                var customer_id = cust.CustomerID;
                var customer_name = cust.Name;
            }
            else {
                var customer_id ="";
                var customer_name ="";
            }
            //CsrfTokenService.getCookie("csrftoken").then(function(token) {
                $scope.formData = { customer_id:customer_id,customer_name:customer_name,user_input:value,csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id") };
                //var mysessiondata = $.jStorage.get("sessiondata");
                //mysessiondata = mysessiondata.toObject();
                //mysessiondata.data = {id:parseInt(id),Text:value};
				//mysessiondata.data = {id:id,Text:value};
                //$rootScope.formData = mysessiondata;
                $timeout(function(){
                    $(".chatinput").val("");
                });
                $scope.timerflag = false;
                apiService.getCategoryFAQ($scope.formData).then(function (data){
					$scope.timerflag = true;
                    angular.forEach(data.data.tiledlist, function(value, key) {
                        if(value.type=="text")
                        {
                        	$rootScope.pushSystemMsg(0,data.data);
                            $rootScope.showMsgLoader = false;
                            
                            if(value.category && value.category != '')
                            {
                                var v_index = _.findIndex($rootScope.categorylist, function(o) { return o.name == value.category; });
                                var v_obj = _.find($rootScope.categorylist, function(o) { return o.name == value.category; });
                                // console.log(v);
                                // console.log($rootScope.selectedCategory);
                                // //$("#faqs_category").val("Single2").trigger('change');
                                // console.log(category);
                                if($rootScope.selectedCategory == v_obj)
                                {}
                                else
                                {
                                    $rootScope.selectedCategory = $rootScope.categorylist[v_index];
                                    $rootScope.getCategoryQuestions(v_obj);
                                }
                            }
                            return false;
                        }
                        // if(value.type=="rate card")
                        // {
                        //     $rootScope.pushSystemMsg(0,data.data.data);
                        //     $rootScope.showMsgLoader = false;
                            
                            
                        //     return false;
                        // }
                        if(value.type=="DTHyperlink")
                        {
                           $rootScope.DthResponse(0,data.data);  
                           $rootScope.showMsgLoader = false;
                        }
                        // else if(value.type=="Instruction")
                        // {
						// 	$rootScope.InstructionResponse(0,data.data.data);  
                        // }
                        if(value.type=="FAQ")
                        {
                            // var reversefaq = new Array();
                            // //console.log(data.data.tiledlist[0].FAQ);
                            // reversefaq = _.reverse(data.data.tiledlist[0].FAQ);
                            // data.data.tiledlist[0].FAQ = reversefaq;
                            //console.log(reversefaq);
                            $rootScope.FAQResponse(0,data.data);  
                        }
                    });
                    

                    //$.jStorage.set("sessiondata",data.data.data.session_obj_data);
                }).catch(function (reason) {
                    //console.log(reason);
                    msg = {Text:"Nope ! didn't catch that . Do you want to <a href='#' class='mailus'>Mail Us</a>",type:"SYS_EMPTY_RES"};
                    $rootScope.pushSystemMsg(0,msg); 
                    $rootScope.showMsgLoader=false;
                    $scope.timerflag = true;
                });
            //});
            $timeout(function(){
                if(!$scope.timerflag)
                {
                    msg = {Text:"Give me a few seconds",type:"SYS_EMPTY_RES"};
                    $rootScope.pushSystemMsg(0,msg); 
                    //$rootScope.showMsgLoader=false;
                    $scope.timerflag = true;
                }
            },7000);
        };
        
        

        $rootScope.tappedKeys = '';

        $rootScope.onKeyUp = function(e){
            //if(e.key == "ArrowDown" || e.key == "ArrowUp")
            if(e.which == 40 ) // Down arrow
            {
                if($("ul#ui-id-1 li.active").length!=0) {
                    var storeTarget	= $('ul#ui-id-1').find("li.active").next();
                    $("ul#ui-id-1 li.active").removeClass("active");
                    storeTarget.focus().addClass("active");
                    $(".chatinput").val(storeTarget.text());
                    $rootScope.autolistid = $(storeTarget).attr("data-id");
                    $rootScope.autolistvalue = $(storeTarget).attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
                    $rootScope.autocategory = $(storeTarget).attr("data-category");
                    $rootScope.autolink = $(storeTarget).attr("data-link");
                }
                else
                {
                    $('ul#ui-id-1').find("li:first").focus().addClass("active");
                    var storeTarget	= $('ul#ui-id-1').find("li.active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:first").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:first").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:first").attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
                    $rootScope.autocategory = $(storeTarget).attr("data-category");
                    $rootScope.autolink = $(storeTarget).attr("data-link");
		    	}

                return;
            }
            if(e.which == 38 ) // Up arrow
            {
                if($("ul#ui-id-1 li.active").length!=0) {
                    var storeTarget	= $('ul#ui-id-1').find("li.active").prev();
                    $("ul#ui-id-1 li.active").removeClass("active");
                    storeTarget.focus().addClass("active");
                    $(".chatinput").val(storeTarget.text());
                    $rootScope.autolistid = $(storeTarget).attr("data-id");
                    $rootScope.autolistvalue = $(storeTarget).attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
                    $rootScope.autocategory = $(storeTarget).attr("data-category");
                    $rootScope.autolink = $(storeTarget).attr("data-link");
                }
                else
                {
                    $('ul#ui-id-1').find("li:last").focus().addClass("active");
                    var storeTarget	= $('ul#ui-id-1').find("li.active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:last").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:last").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:last").attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
                    $rootScope.autocategory = $(storeTarget).attr("data-category");
                    $rootScope.autolink = $(storeTarget).attr("data-link");
		    	}

                return;
            }
            if(e.which == 13) // Enter
            {
                if($rootScope.autolistid=="" || $rootScope.autolistid == null)
                {
                    if($(".chatinput").val() != "")
                    {
                        console.log("No select only Enter");    
                        $rootScope.pushMsg("",$(".chatinput").val());
                        $(".chatinput").val("");
                        $rootScope.chatText="";
                    }
                }
                else {
                    //$rootScope.pushMsg("",$(".chatinput").val());
                    $rootScope.pushAutoMsg($rootScope.autolistid,$rootScope.autolistvalue,$rootScope.answers,$rootScope.autocategory,$rootScope.autolink)
                    console.log("Select Enter");
                    //$rootScope.pushAutoMsg($rootScope.autolistid,$rootScope.chatText,$rootScope.answers);
                }
                $rootScope.autocompletelist = [];
                //$rootScope.pushMsg("",$(".chatinput").val());
                $(".chatinput").val("");
                $rootScope.autolistid = "";
                $rootScope.chatText = "";
            }
            if(e.which == 8)
            {
                
                if($(".chatinput").val()=="")
                {
                    $rootScope.autocompletelist = [];
                    $rootScope.chatText = "";
                }
                
            }
            // $rootScope.chatText = "";
            // $rootScope.autolistid=="";
            // $rootScope.autolistvalue = "";
        };
        $rootScope.disablefeedback = false;
        $rootScope.likeChatClick = function(){
            $timeout(function(){
                $('span.thumbsup').css("color", "#39E61F");
                $('.thumbsdown').css("color", "#ED6D05");
            },200);
            msg = {Text:"Thank you very much! Talk to you soon.",type:"SYS_EMPTY_RES"};
            $rootScope.pushSystemMsg(0,msg);
            $rootScope.disablefeedback = true;
            var cust = $.jStorage.get("customerDetails");
            if(cust)
            {
                var customer_id = cust.CustomerID;
                var customer_name = cust.Name;
            }
            else {
                var customer_id ="";
                var customer_name ="";
            }
            var formData = { customer_id:customer_id,customer_name:customer_name,user_input:"",csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id"),feedback:"POSITIVE" };
            
            apiService.outfeedback(formData).then(function (data){

            });
        };
        $rootScope.$dislikemodalInstance = {};
        $rootScope.dislikesuggestionerror = 0;
        $rootScope.dislikeChatClick = function(){
            $rootScope.$dislikemodalInstance = $uibModal.open({
                scope: $rootScope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/dislikechat.html',
                //controller: 'CommonCtrl'
            });
            $timeout(function(){ 
                $('span.thumbsdown').css("color", "#F32525");
                $('.thumbsup').css("color", "#ED6D05");
            },200);
        };
        $rootScope.dislikeCancel = function() {
            //console.log("dismissing");
            $scope.$dislikemodalInstance.dismiss('cancel');
            $('span.thumbsdown').css("color", "#ED6D05");
        };
        $rootScope.dislikesuggestionsubmit = function(suggestion){
            //console.log("suggestion",suggestion);
            $rootScope.dislikesuggestionSuccess = 1;
            $timeout(function(){
                $rootScope.dislikesuggestionSuccess = 0;
                $rootScope.dislikeCancel();
            },500);
            $('span.thumbsdown').css("color", "#ED6D05");
            msg = {Text:"Thanks! for taking the time to provide feedback, This will help me improve.",type:"SYS_EMPTY_RES"};
            $rootScope.pushSystemMsg(0,msg);
            $rootScope.disablefeedback = true;
            var cust = $.jStorage.get("customerDetails");
            if(cust)
            {
                var customer_id = cust.CustomerID;
                var customer_name = cust.Name;
            }
            else {
                var customer_id ="";
                var customer_name ="";
            }
            var formData = { customer_id:customer_id,customer_name:customer_name,user_input:"",csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id"),feedback:"NEGATIVE" };
            
            apiService.outfeedback(formData).then(function (data){

            });
        };
        
       $timeout(function(){
            //$('#chatTabs a:last').tab('show');
       },200);
    })
    
    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/form.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        // $scope.data = {
        //     name: "Chintan",
        //     "age": 20,
        //     "email": "chinyan@wohlig.com",
        //     "query": "query"
        // };
        $scope.submitForm = function (data) {
            console.log("This is it");
            return new Promise(function (callback) {
                $timeout(function () {
                    callback();
                }, 5000);
            });
        };
    })
    .controller('GridCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/grid.html");
        TemplateService.title = "Grid"; // This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })

    // Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });