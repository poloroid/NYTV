'use strict';
angular.module('copWatchApp').controller('MainCtrl',function($scope,$http,$sce) {
	Array.max = function( array ){
		return Math.max.apply( Math, array );
	};
	$scope.modal=$sce.trustAsResourceUrl('http://www.csszengarden.com/');
	$http.get('../../assets/newswire.json').success(function(data){
		var finalarray=[];
		var texts= [];
		var art=[];
		for(var result in data.results){
			//FOR EACH ARTICLE, CHOOSE ONE PICTURE
			var multimedias=[];
			for(var media in data.results[result].media){
				var elements=[];
				for(var element in data.results[result].media[media]['media-metadata']){
					elements.push(data.results[result].media[media]['media-metadata'][element].width);
				}
				var o= {};
				o.size=Array.max(elements);
				o.pos2=elements.indexOf(Array.max(elements));
				o.url=data.results[result].media[media]['media-metadata'][elements.indexOf(Array.max(elements))].url;
				if(multimedias.length===0){
					multimedias.push(o);
					multimedias[0].pos1=media;
				}else{
					if(o.size>multimedias[0].size){
						multimedias.pop(0);
						multimedias.push(o);
						multimedias[0].pos1=media;	
					}
				}
			}
			finalarray.push(multimedias);
			texts.push(data.results[result].title);
			art.push(data.results[result].url);			
		}
		$scope.items=[];

		for(var y=0;y<=19;y++){
			if(finalarray[y].length>0){
				var a=finalarray[y][0].url;
				var b=texts[y];
				var c=art[y];
				var u={URL:a,TEXT:b,index:y,link:c};
				$scope.items.push(u);
			}
		}
		
		console.log($scope.items);
	});



$scope.getArticleList=function(query,sort){
	if(query.length>2){
		$scope.fbool=true;
		$http.get('http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+query+'&page=0&sort='+sort+'&api-key=2783a442cf22ff3d9e32c5090a891b71:16:69454860').success(function(data){
			console.log(data);
			if(query===$scope.query){
				for(var i=0;i<9;i++){
					console.log(data.response.docs[i].multimedia.length);
					if(data.response.docs[i].multimedia.length>0){
						data.response.docs[i].hasImage=true;
						data.response.docs[i].imgUrl='http://static01.nyt.com/'+data.response.docs[i].multimedia[0].url;
						console.log(data.response.docs[i].imgUrl);
					}
					else{
						data.response.docs[i].hasImage=false;
					}
				}
				$scope.response=data.response.docs;
			}


		}

		);
	}
};
$scope.showModal=function(url){
	$scope.modal=$sce.trustAsResourceUrl(url);
	console.log(url);
};
}
).directive('article', function () {
	return {
		restrict: 'A',
		template: '<div class="panel panel-info"><div class="panel-heading"><h3 class="panel-title"> <a ng-click="showModal(article.web_url);" data-toggle="modal" data-target="#myModal">{{article.headline.main}}</a></h3></div><div class="panel-body"><div style="float:left" ng-if="article.hasImage"><img ng-src="{{article.imgUrl}}"/></div>{{article.snippet}}</div></div><p class="pull-right">{{article.pub_date | date}}</p></div>'
	};
}
);



