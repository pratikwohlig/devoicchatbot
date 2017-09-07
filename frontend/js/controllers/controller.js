myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout,$rootScope,apiService,$cookies) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        //$scope.categorydropdown = apiService.getCategoryDropdown({});

        
        angular.element(document).ready(function () {
            apiService.get_session({}).then( function (response) {
                $cookies.put("csrftoken",response.data.csrf_token);
                $cookies.put("session_id",response.data.session_id);
                $.jStorage.set("csrftoken",response.data.csrf_token);
                //console.log(response.data);
            });
        });
        

        

    })

    .controller('ChatCtrl', function ($scope, $rootScope,TemplateService, $timeout,$http,apiService,$state,$sce,$cookies,$location,$compile) {
        
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
        if(referrerurl == null || referrerurl == "http://104.46.103.162:8096/")
            $rootScope.validDomain = true;
        $rootScope.languagelist = [
            {id:"en" , name:"English"},
            {id:"hi" , name:"Hindi"},
            {id:"mr" , name:"Marathi"},
            {id:"gu" , name:"Gujarati"},
            {id:"ta" , name:"Tamil"},
        ];
        $rootScope.selectedLanguage = $rootScope.languagelist[0];
        $scope.formSubmitted = false;
        $scope.loginerror=0;
        $rootScope.isLoggedin = false;
        if($.jStorage.get("isLoggedin"))
            $rootScope.isLoggedin = true;
        $scope.login = function(username,password,language)
        {
            /*
            $scope.formData = {username:username,password:sha256_digest(password),csrfmiddlewaretoken:token};
            
            apiService.login($scope.formData).then(function (callback){
                //console.log(callback);
            });*/
            $.jStorage.flush();
            if(username == "admin@exponentiadata.com" && password == "admin")
            {
                $.jStorage.set("id", 1);
                $.jStorage.set("name", "Admin");
                $.jStorage.set("language", language.id);
                $.jStorage.set("email", username);
                $.jStorage.set("isLoggedin", true);
                $rootScope.isLoggedin = true;
            }
            else {
                $scope.loginerror = -1;
            }
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
            var msg = {Text:"Hi, How may I help you ?",type:"SYS_FIRST"};
            $rootScope.pushSystemMsg(0,msg); 
        };
        $rootScope.autocompletelist = [];
        $rootScope.chatOpen = false;
        $rootScope.showTimeoutmsg = false;
        $rootScope.firstMsg=false;
        $rootScope.chatmsg = "";
        $rootScope.chatmsgid = "";
        
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
            $scope.formData = { category:categoryid };
            //console.log(category.name);
            apiService.getCategoryQuestions($scope.formData).then( function (response) {
                $rootScope.links = response.data.data;
                $rootScope.links.type = "cat_faq";
                //console.log($rootScope.links);
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
            if(chatText == "" || chatText == " " || chatText == null)
                $rootScope.autocompletelist = [];
            else {
                $rootScope.chatdata = { string:$rootScope.chatText};
                apiService.getautocomplete($rootScope.chatdata).then(function (response){
                       // console.log(response.data);
                    $rootScope.autocompletelist = response.data.data;
                });
            }
        };
        $rootScope.showFAQAns = function(e) {
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
            });
            
        };
        $scope.trustedHtml = function (plainText) {
            return $sce.trustAsHtml(plainText);
        };
        $rootScope.pushQuesMsg = function(id,value) {
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            var value2 = $rootScope.links;
            if(value2[id].link != "" )
            {
                var linkdata="";
                final_link = value2[id].link.split("<br>");
                _.each(final_link, function(value, key) {
                    var languageid = $.jStorage.get("language");
                    $scope.formData = {"text": value,"language":languageid };
                    var dummy = "id='"+key+"' data-id='"+id+"' ng-click='pushPortalLink("+id+","+key+");'";
                    linkdata += "<p class='portalapp' "+dummy+">"+value+"</p>";
                    
                    // value2.queslink = $sce.trustAsHtml(value2.queslink);
                    // msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                    // $timeout(function(){
                    //     $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                    //     $rootScope.showMsgLoader=false;
                    //     $rootScope.scrollChatWindow();
                    // },2000);
                    // apiService.translate($scope.formData).then( function (response) {
                    //     console.log(response);
                    //     if(response.xhrStatus == "complete")
                    //     {
                    //         var dummy = "id='"+key+"' data-id='"+id+"' ng-click='pushPortalLink("+id+","+key+");'";
                    //         linkdata += "<p class='portalapp' "+dummy+">"+response.data.data+"</p>";
                    //         console.log(linkdata);
                    //         console.log(response.data.data);
                    //         if(key == (final_link.length-1))
                    //     {
                    //         console.log(key+"-key,length:"+final_link.length);
                    //         value2.queslink=linkdata;
                    //         console.log(value2.queslink);
                    //         value2.queslink = $sce.trustAsHtml(value2.queslink);
            
                    //         msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                    //         $timeout(function(){
                    //             $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                    //             $rootScope.showMsgLoader=false;
                    //             $rootScope.scrollChatWindow();
                    //         },2000);
                    //     }
                    //         return;
                    //     }
                        
                    // }).finally(function() {
                        
                    // });
                    
                });
                value2.queslink=linkdata;
            }
            
            else
            {    
                value2.queslink = value2[id].answers.replace(new RegExp("../static/data_excel/", 'g'), adminurl2+'static/data_excel/');
                // value2.queslink = $sce.trustAsHtml(value2.queslink);
            
                // msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
                // $timeout(function(){
                //     $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                //     $rootScope.showMsgLoader=false;
                //     $rootScope.scrollChatWindow();
                // },2000);
            }
            
            value2.queslink = $sce.trustAsHtml(value2.queslink);
            
            msg2={"queslink":angular.copy(value2.queslink),type:"cat_faq"};
            $timeout(function(){
                $rootScope.chatlist.push({id:id,msg:msg2,position:"left",curTime: $rootScope.getDatetime()});
                $rootScope.showMsgLoader=false;
                $rootScope.scrollChatWindow();
            },2000);
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
                value3.queslink=answer1;
                
            }
            //$compile(linkdata)($scope);
            msg2={"queslink":angular.copy(value3.queslink),type:"cat_faq"};
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
            if(!$rootScope.firstMsg)
            {
                $rootScope.firstMsg = true;
                msg = {Text:"Hi, How may I help you ?",type:"SYS_FIRST"};
                $rootScope.pushSystemMsg(0,msg);  
            }
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
        $rootScope.pushMsg = function(id,value) {
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
        };
        $rootScope.pushAutoMsg = function(id,value,answer) {
            $rootScope.msgSelected = true;
            $rootScope.chatmsgid = id;
            $rootScope.chatmsg = value;
            $rootScope.answers = answer;
            console.log(answer);
            $rootScope.autocompletelist = [];
            $rootScope.chatlist.push({id:id,msg:value,position:"right",curTime: $rootScope.getDatetime()});
            //console.log("msgid="+id+"chatmsg="+$rootScope.msgSelected);
            var automsg = { Text: answer , type : "SYS_AUTO"};
            $rootScope.pushSystemMsg(id,automsg);
            $rootScope.showMsgLoader = false;
            //$.jStorage.set("chatlist",$rootScope.chatlist);
            $rootScope.msgSelected = false;
            $rootScope.chatmsgid = "";
            $rootScope.chatmsg = "";
            $rootScope.answers = "";
            $rootScope.scrollChatWindow();
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
        if($.jStorage.get("showchat"))
            $rootScope.showChatwindow();
        else
            $rootScope.minimizeChatwindow();

        $rootScope.ratecardSubmit = function(coldata,rowdata) {
            console.log(coldata,rowdata);
        };
        $rootScope.getDthlinkRes = function(colno,lineno,dthlink) {
            //console.log(colno,lineno,dthlink);
            mysession = $.jStorage.get("sessiondata");
            //console.log(mysession);
            mysession.DTHlink=dthlink;
            mysession.DTHline=lineno;
            mysession.DTHcol=colno;
            formData = mysession;
            //console.log(formData);
            apiService.getDthlinkRes(formData).then(function (data){
                angular.forEach(data.data.data.tiledlist, function(value, key) {
                    if(value.type=="DTHyperlink")
                    {
                        $rootScope.DthResponse(0,data.data.data);
                        
                        $("#topic").text(data.data.data.tiledlist[0].topic);
                        $.jStorage.set("sessiondata",data.data.data.session_obj_data);
                    }
                });
            });
        };
        $rootScope.DthResponse = function(id,data) {
            // $rootScope.pushSystemMsg(id,data);
            // $rootScope.showMsgLoader = false; 
            // $rootScope.selectTabIndex = 0;
            
            // //var node_data = {"node_data": {"elements": ["Guidelines", "Shifting", "Accessibility", "Charges"], "element_values": ["<br>To define general guidelines to be followed by Branches while processing Account Closure. <br><br> Branch should attempt for retention of account before closing the account as opening a new account is expensive. <br><br> Channels through which Account Closure request is received: <br> 1. Customers In Person (CIP) who walk in to the Branch <br>\n2. Representatives/Bearer of customers who walk in to the Branch <br>\n3. Mail / Drop Box <br><br> Check Documentation and Signature Protocol <br><br> Check Mode of Payment for closure Proceeds <br><br> Check for Customer Handling on receipt of request <br><br> Check Process at Branch \u2013Checks during acceptance of closure form <br><br> Check Process at Branch- Post acceptance of Closure form <br><br> ", "<br>Customer is unwilling to give us another chance  <br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance. <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront. <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.  <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>In case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.\nCustomer will pay the  necessary amount to regularize the account <br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly. <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel <br><br>\n4) Branch to journal of the attempts made to retain the customer. <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.", "<br>If customer is closing his/ her account due to inconvenient accessibility, solutions like Home Banking, Beat Pick up facility, etc. should be re-iterated. <br>\nIn case customer has an account which he/ she is not eligible for an accessibility offering he/ she is interested in, an upgraded account should be offered especially if account balances justify it (ensure that new AMB/AQBs and NMCs are communicated clearly).Customer is unwilling to give us another chance  <br><br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance.  <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront. <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.  <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d.  <br><br> This needs to be done diligently and would be subject to audits.  <br><br>\nCustomer is unwilling to give another chance: < <br><br>> Customer will pay the  necessary amount to regularize the account  <br><br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d  <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d  <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly.  <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel  <br><br> \n4) Branch to journal of the attempts made to retain the customer.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.C2", "<br>1) Customer expresses concerns on high charges, ascertain the nature of charges levied and recommend an upgraded account where required (e.g. if customer finds DD charges high, up-sell to an account with a higher free DD limit or an account offering At Par cheque facility if usage is on our locations). Communicate the AMB/AQB and NMC to customer clearly. <br><br>\n2) The account can be upgraded/downgrade as per customer requirement by retaining the same account Number  <br><br>\n3) Branch can also explain the benefits of Basic/Small Account and offer conversion to the said  account as it will address their inability to maintain the account.  <br><br>\nCustomer is unwilling to give us another chance  <br><br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance.  <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront.  <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.   <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.  <br><br>\nCustomer will pay the  necessary amount to regularize the account   <br><br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d  <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d  <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly.  <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel  <br><br>\n4) Branch to journal of the attempts made to retain the customer.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.\n"]}};
            // var ele = new Array("Process");
            // ele2 = [  
            //             "Guidelines",
            //             "Shifting",
            //             "Accessibility",
            //             "Charges"
            //         ];
            // ele=ele.concat(ele2);
            // var ele_val = new Array(data.tiledlist[0]);
            // element_values = [  
            //             "<br>To define general guidelines to be followed by Branches while processing Account Closure. <br><br> Branch should attempt for retention of account before closing the account as opening a new account is expensive. <br><br> Channels through which Account Closure request is received: <br> 1. Customers In Person (CIP) who walk in to the Branch <br>\n2. Representatives/Bearer of customers who walk in to the Branch <br>\n3. Mail / Drop Box <br><br> Check Documentation and Signature Protocol <br><br> Check Mode of Payment for closure Proceeds <br><br> Check for Customer Handling on receipt of request <br><br> Check Process at Branch \u2013Checks during acceptance of closure form <br><br> Check Process at Branch- Post acceptance of Closure form <br><br> ",
            //             "<br>Customer is unwilling to give us another chance  <br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance. <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront. <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.  <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>In case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.\nCustomer will pay the  necessary amount to regularize the account <br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly. <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel <br><br>\n4) Branch to journal of the attempts made to retain the customer. <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.",
            //             "<br>If customer is closing his/ her account due to inconvenient accessibility, solutions like Home Banking, Beat Pick up facility, etc. should be re-iterated. <br>\nIn case customer has an account which he/ she is not eligible for an accessibility offering he/ she is interested in, an upgraded account should be offered especially if account balances justify it (ensure that new AMB/AQBs and NMCs are communicated clearly).Customer is unwilling to give us another chance  <br><br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance.  <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront. <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.  <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d.  <br><br> This needs to be done diligently and would be subject to audits.  <br><br>\nCustomer is unwilling to give another chance: < <br><br>> Customer will pay the  necessary amount to regularize the account  <br><br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d  <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d  <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly.  <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel  <br><br> \n4) Branch to journal of the attempts made to retain the customer.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.C2",
            //             "<br>1) Customer expresses concerns on high charges, ascertain the nature of charges levied and recommend an upgraded account where required (e.g. if customer finds DD charges high, up-sell to an account with a higher free DD limit or an account offering At Par cheque facility if usage is on our locations). Communicate the AMB/AQB and NMC to customer clearly. <br><br>\n2) The account can be upgraded/downgrade as per customer requirement by retaining the same account Number  <br><br>\n3) Branch can also explain the benefits of Basic/Small Account and offer conversion to the said  account as it will address their inability to maintain the account.  <br><br>\nCustomer is unwilling to give us another chance  <br><br>\n1) In case of Issues expressed by the customer where he / she is willing to give the Bank another chance.  <br><br>\n2) Branch to attempt fix the problem within 48 hours or 7 days on the outside for extreme cases and revert to the customer. This TAT for revert to be communicated to the customer upfront.  <br><br>\n3) Customers to be sent a personalised letter thanking them for their time and an acknowledgement, that we value their business and have remedied whatever caused them to want to leave in the first place. A list of all reasons for closure with the action taken, to be stated.   <br><br>\n4) Once the customer has been retained, the customer letter / form duly marked \u201cNOT FOR CLOSURE \u2013 RETAINED\u201d, along with a copy of the resolution letter to be sent to CPC for filing in the customer record.  <br><br>\n5) Siebel to be updated with the same comment and closed.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.  <br><br>\nCustomer will pay the  necessary amount to regularize the account   <br><br>\nCustomer is unwilling to regularize the account after all attempts then branch user to follow the protocol as detailed in chapter \u201cAccount closure requests with debit balance/TBMS lien.\u201d  <br><br>\n1) Where the customer is not willing to continue, Branch to ensure that the complete details on Account closure form and all the checks to be made as detailed in the chapter  \u201cGeneral Guidelines to be followed for Account closure\u201d  <br><br>\n2) In case of any incomplete request, the customer needs to be apprised of the requirements and Siebel to be updated accordingly.  <br><br>\n3) If the a/c closure request is complete in all respects / once the complete request is received from the customer, the same needs to be sent to CPC, post updating the Siebel  <br><br>\n4) Branch to journal of the attempts made to retain the customer.  <br><br>\nIn case the BOM/SM/BM/ RBM / AM or the branch staff are able / Not able  to retain the customer, then protthe SR which has been created needs to be closed with the Closure Description in Siebel as, \u201cCustomer Retained\u201d. This needs to be done diligently and would be subject to audits.\n"
            //         ]
            // ele_val = ele_val.concat(element_values);
            // //_.insert(ele, "Process", [0]);
            // $rootScope.tabvalue.elements = ele;
            // $rootScope.tabvalue.element_values=ele_val;
            // //$rootScope.$emit("setTabData", $scope.node_data);
           
            
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
            //CsrfTokenService.getCookie("csrftoken").then(function(token) {
                $scope.formData = { user_input:value,csrfmiddlewaretoken:$rootScope.getCookie("csrftoken"),auto_id:"",auto_value:"",user_id:$cookies.get("session_id") };
                //var mysessiondata = $.jStorage.get("sessiondata");
                //mysessiondata = mysessiondata.toObject();
                //mysessiondata.data = {id:parseInt(id),Text:value};
				//mysessiondata.data = {id:id,Text:value};
                //$rootScope.formData = mysessiondata;
                $timeout(function(){
                    $(".chatinput").val("");
                });
                apiService.getCategoryFAQ($scope.formData).then(function (data){
						
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
                        // else if(value.type=="DTHyperlink")
                        // {
                        //    $rootScope.DthResponse(0,data.data.data);  
                        // }
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
                    msg = {Text:"Sorry I could not understand",type:"SYS_EMPTY_RES"};
                    $rootScope.pushSystemMsg(0,msg); 
                    $rootScope.showMsgLoader=false;
                });
            //});
            
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
                }
                else
                {
                    $('ul#ui-id-1').find("li:first").focus().addClass("active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:first").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:first").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:first").attr("data-value");
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
                }
                else
                {
                    $('ul#ui-id-1').find("li:last").focus().addClass("active");
                    $(".chatinput").val($('ul#ui-id-1').find("li:last").text());
                    $rootScope.autolistid = $('ul#ui-id-1').find("li:last").attr("data-id");
                    $rootScope.autolistvalue = $('ul#ui-id-1').find("li:last").attr("data-value");
                    $rootScope.answers = $(storeTarget).attr("data-answers");
		    	}

                return;
            }
            if(e.which == 13) // Enter
            {
                if($rootScope.autolistid=="" || $rootScope.autolistid == null )
                {
                    console.log("null",$rootScope.autolistid);
                    $(".chatinput").val("");
                    $rootScope.pushMsg("",$rootScope.chatText);
                }
                else {
                    $rootScope.pushMsg("",$rootScope.autolistvalue);
                    //$rootScope.pushAutoMsg($rootScope.autolistid,$rootScope.chatText,$rootScope.answers);
                }
                
                //$rootScope.pushMsg("",$(".chatinput").val());
                $(".chatinput").val("");
            }
        };
        $rootScope.likeChatClick = function(){
            $timeout(function(){
                $('span.thumbsup').css("color", "#ed232b");
                $('.thumbsdown').css("color", "#444");
            },200);
        };
        $rootScope.$dislikemodalInstance = {};
        $rootScope.dislikesuggestionerror = 0;
        $rootScope.dislikeChatClick = function(){
            /*$rootScope.$dislikemodalInstance = $uibModal.open({
                scope: $rootScope,
                animation: true,
                size: 'sm',
                templateUrl: 'views/modal/dislikechat.html',
                //controller: 'CommonCtrl'
            });*/
            $timeout(function(){ 
                $('span.thumbsdown').css("color", "#ed232b");
                $('.thumbsup').css("color", "#444");
            },200);
        };
        /*$rootScope.dislikeCancel = function() {
            //console.log("dismissing");
            $scope.$dislikemodalInstance.dismiss('cancel');
        };
        $rootScope.dislikesuggestionsubmit = function(suggestion){
            console.log("suggestion",suggestion);
            $rootScope.dislikesuggestionSuccess = 1;
            $timeout(function(){
                $rootScope.dislikesuggestionSuccess = 0;
                $rootScope.dislikeCancel();
            },500);
        };*/
        
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