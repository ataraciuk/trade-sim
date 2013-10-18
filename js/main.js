TradeSim = {};

TradeSim.products = [
	{ name: 'Wands', img: 'img/wand.jpg', basePrize: 20, modifier: 0.5 },
	{ name: 'Swords', img: 'img/Sword.png', basePrize: 50, modifier: 0.2 },
	{ name: 'Ponies', img: 'img/pony.gif', basePrize: 30, modifier: 0.4 },
	{ name: 'Masks', img: 'img/mask.jpg', basePrize: 12, modifier: 0.8 }
];

TradeSim.markets = [
	{name: 'Coolville', produces: [0,1], consumes:[2,3]},
	{name: 'Funcity', produces: [2,3], consumes:[0,1]}
];

TradeSim.user = {
	money: 500,
	stock: []
};

TradeSim.currentMarket = 0;

TradeSim.init = function() {
	for(i = 0, l = TradeSim.markets.length; i < l; i++) {
		var market = TradeSim.markets[i];
		market.stock = [];
		for(j = 0, m = TradeSim.products.length; j < m; j++) {
			market.stock[j] = Math.floor((Math.random()*60)+20);
		}
	}
	for(i = 0, l = TradeSim.products.length; i < l; i++) {
		TradeSim.user.stock[i] = 0;
	}
	TradeSim.initDOM();
	$('#changeMarket').click(function(e){
		e.preventDefault();
		$(this).attr('disabled', 'disabled');
		$('.market').hide();
		$('#switching').show();
		setTimeout(function(){
			$('#switching').hide();
			TradeSim.currentMarket = (TradeSim.currentMarket + 1) % TradeSim.markets.length;
			$('.market#market'+TradeSim.currentMarket).show();
			$('#changeMarket').removeAttr('disabled');
		}, TradeSim.travelTime * 1000);
	});
	setInterval(TradeSim.onSecond, 1000);
}

TradeSim.buyPrize = function(m, p) {
	var prod = TradeSim.products[p], market = TradeSim.markets[m];
	return Math.round(prod.basePrize - prod.basePrize * prod.modifier * market.stock[p] / TradeSim.maxStock);
}

TradeSim.sellPrize = function(m, p) {
	return Math.round(TradeSim.buyPrize(m,p) * Math.sqrt(Math.sqrt(1 - TradeSim.products[p].modifier)));
}

TradeSim.onSecond = function() {
	TradeSim.duration--;
	if(TradeSim.duration > 0) {
		TradeSim.DOM.timer.html(TradeSim.duration);
		if(TradeSim.duration % TradeSim.productsCycle === 0) {
			for(i = 0, l = TradeSim.markets.length; i < l; i++) {
				var market = TradeSim.markets[i];
				for(j = 0, m = market.produces.length; j < m; j++) {
					var prod = market.produces[j];
					market.stock[prod] += TradeSim.productVar;
					if(market.stock[prod] > TradeSim.maxStock) market.stock[prod] = TradeSim.maxStock;
					TradeSim.updateDomProd(i, prod);
				}
				for(j = 0, m = market.consumes.length; j < m; j++) {
					var prod = market.consumes[j];
					market.stock[prod] -= TradeSim.productVar;
					if(market.stock[prod] < 0) market.stock[prod] = 0;
					TradeSim.updateDomProd(i, prod);
				}
			}
		}
	} else {

	}
}

TradeSim.updateDomProd = function(m, p) {
	var row = TradeSim.DOM.markets[m][p];
	row.children(':nth-child(2)').html(TradeSim.markets[m].stock[p]);
	row.children(':nth-child(3)').html('$'+TradeSim.buyPrize(m,p));
	row.children(':nth-child(4)').html('$'+TradeSim.sellPrize(m,p));
}

TradeSim.initDOM = function() {
	TradeSim.DOM.timer.html(TradeSim.duration);
	var DOMUserStock = TradeSim.DOM.user.find('#userStock');
	TradeSim.DOM.userMoney = TradeSim.DOM.user.find('#userMoney');
	TradeSim.DOM.userMoney.html(TradeSim.user.money);
	for(i = 0, l = TradeSim.products.length; i < l; i++) {
		var product = TradeSim.products[i];
		DOMUserStock.append('<tr><td><img src="'+product.img+'" />'+product.name+':</td><td id="userStock'+i+'">'+TradeSim.user.stock[i]+'</td></tr>');
	}
	for(i = 0, l = TradeSim.markets.length; i < l; i++) {
		var market = TradeSim.markets[i];
		var DOMMarket = $('<div id="market'+i+'" class="market"><h2>'+market.name+'</h2></div>');
		DOMMarket.append('<div>Produces: '+Enumerable.From(market.produces).Select("TradeSim.products[$].name").ToArray().join(', ')+'</div>');
		DOMMarket.append('<div>Consumes: '+Enumerable.From(market.consumes).Select("TradeSim.products[$].name").ToArray().join(', ')+'</div>');
		var table = $('<table><tr><th>Product</th><th>In stock</th><th>Buy for</th><th>Sell for</th></tr></table>').appendTo(DOMMarket);
		TradeSim.DOM.markets[i] = [];
		for(j = 0, m = TradeSim.products.length; j < m; j++) {
			var product = TradeSim.products[j];
			table.append('<tr id="marketProduct-'+i+'-'+j+'"><td><img src="'+product.img+'" />'+product.name+
				'</td><td>'+market.stock[j]+'</td><td>$'+TradeSim.buyPrize(i,j)+'</td><td>$'+
				TradeSim.sellPrize(i,j)+'</td></tr>');
			TradeSim.DOM.markets[i][j] = table.find('#marketProduct-'+i+'-'+j);
		}
		$('#markets').append(DOMMarket).children('.market').first().show();
	}
}

TradeSim.DOM = {
	timer: $('#timer'),
	markets: [],
	user: $('#user')
};

TradeSim.maxStock = 100;
TradeSim.duration = 120; //seconds
TradeSim.productsCycle = 2; //seconds
TradeSim.productVar = 5;
TradeSim.travelTime = 5;

TradeSim.init();