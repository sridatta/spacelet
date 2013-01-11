(function(){

  var toReview = [];
  var numRepeated = 0;
  var numImproved = 0;
  var currCard;
  var setId;

  $(document).ready(function(){
    crossroads.addRoute('/', homepage);
    crossroads.addRoute('/login:?query:', login);
    crossroads.addRoute('/sets/{id}/practice', practice);
    crossroads.parse(window.location.pathname + window.location.search);
  });

  function login(query){
    $(".nav li").click(function(){
      $(".nav li").removeClass("active");
      $(this).addClass("active");
      var formAction = $(this).data("url");
      $("form").attr("action", formAction);
    });

    if(query && query.userExists){
      $("#user-exists").show();
      $("#signup-tab").click();
    } else if (query && query.loginFailed){
      $("#login-failed").show();
      $("#login-tab").click();
    }
  }

  function practice(id){
    setId = id;
    initializeControls();

    var now = Date.now();
    var cards = window.cards;
    for(var i = 0; i < cards.length; i++){
      var card = cards[i];
      if(!card.replayDate || (card.replayDate <= now && card.lastPlayed < card.replayDate)) {
        toReview.push(card);
      }
    }

    if(toReview.length > 0){
      // Show a message telling how many cards to review
      $("#message-stage").empty();
      $("#message-stage").html(makeStartScreen({numToReview:toReview.length, numTotal: cards.length}));
      $("#start-controls").show();
    } 
  }

  function displayNewCard(){
    $("#rating-controls").hide();
    $("#reveal-controls").show();

    var card = toReview.shift();
    currCard = card;

    if(!card){
      uploadCards();
      return false;
    } else {
      card.numRepetitions += 1;
      updateInterval(card);
    }
    // Render into template and put it in the container
    $(".card-container").empty()
                        .html(makeCard({card: card}));
  }

  function showStats(){
    $("#review-stage").hide();
    $(".control-set").hide();
    $("#message-stage").empty();
    $("#message-stage").html(makeStatsScreen({numRepeated:numRepeated, numImproved: numImproved}));
    $("#message-stage").show();
  }

  function uploadCards(){
    var data = {setId:setId, cards: cards};
    $.ajax({url:'/sets/'+setId,
            type:"POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            processData: false,
            success: function(){
              showStats();
          }});
  }

  function initializeControls(){
    $('#start-controls').click(function(e){
      $("#message-stage").hide();
      $("#start-controls").hide();
      displayNewCard();
      $("#review-stage").show();
    });

    $("#reveal-button").click(function(){
      $(".card-answer").css('visibility', 'visible');
      $("#rating-controls").show();
      $("#reveal-controls").hide();
    });

    $(".rating-button").click(function(){
      var score = $(this).data("score");
      updateEF(currCard, score);
      displayNewCard();
    });
  }

  function updateInterval(card) {
    var interval = getInterval(card, card.numRepetitions);
    var dateObj = new Date();
    dateObj.setDate(dateObj.getDate()+interval);
    card.replayDate = dateObj.getTime();
  }

  function getInterval(card, n) {
    if(n == 1) {
      return 1;
    } else if(n == 2){
      return 6;
    } else {
      return card.eFactor * getInterval(card, n-1);
    }
  }

  function updateEF(card, score) {
    var efPrime = Math.max(1.3, card.eFactor+(0.1-(5-score)*(0.08+(5-score)*0.02)));

    if(score < 3) {
      card.numRepetitions = 0;
    } else {
      if(efPrime > card.eFactor) {
        numImproved++;
      }
      card.eFactor = efPrime;
    }

    if(score < 4) {
      toReview.push(card);
      numRepeated++;
    }
  }

  function homepage(){
    $("#search-tab").click(function(){
      $(this).addClass("active");
      $("#url-tab").removeClass("active");
      $("#search-pane").show();
      $("#url-pane").hide();
    });

    $("#url-tab").click(function(){
      $(this).addClass("active");
      $("#search-tab").removeClass("active");
      $("#url-pane").show();
      $("#search-pane").hide();
    });

    $("#url-form").submit(function(e){
      e.preventDefault();
      var url = $("#url-input").val();
      var parser = document.createElement('a');
      parser.href = url;

      if(parser.hostname == "quizlet.com") {
         var quizletId = parser.pathname.split('/')[1];
         window.location.href = "/sets/"+quizletId+"/practice";
      }

    });

    populateResults(cachedResults);
    searchSets($('#set-search-form input').val(), populateResults);
    $('#set-search-form').submit(function(e){
      e.preventDefault();
      $('#set-search-results ul').empty();
      $('#set-search-placeholder').show();
      searchSets($('#set-search-form input').val(), populateResults);
    });
  }

  function searchSets(query, cb){
    $.ajax({url: '/sets/search', dataType:'json', data: {q: query}, success: cb});
  }

  function populateResults(results){
    $('#set-search-placeholder').hide();
    $('#set-search-results ul').empty();
    for(var i = 0; i < results.length; i++) {
      var resultEl = makeResultElement({result: results[i]});
      $('#set-search-results ul').append(resultEl);
    }
  }

  var makeResultElement = Handlebars.compile($("#search-result-template").html());
  var makeCard = Handlebars.compile($("#card-template").html());
  var makeStartScreen = Handlebars.compile($("#start-screen-template").html());
  var makeStatsScreen = Handlebars.compile($("#stats-screen-template").html());

})();
