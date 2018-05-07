app.factory('CalculatorService', function() {
	var factory = {};
	var maksettavaSumma = null;
	var laskutettavaSumma = null;
	var brutto = null;
	
	// Saattaa olla turha funktio
	factory.maksettavaSumma = function(_laskutettavaSumma, provisio) {
		maksettavaSumma = _laskutettavaSumma*(1-provisio);
		laskutettavaSumma = _laskutettavaSumma;
		return maksettavaSumma;
	}
	
	factory.brutto1 = function(_laskutettavaSumma, provisio, kulutYhteensa, osuus, TyonantajaKustannukset) {
		// Tassa funktiossa maksettavasta summasta vahennetaan kulut ennen osuudella kertomista.
		var _maksettavaSumma = _laskutettavaSumma*(1-provisio);
		return (_maksettavaSumma-kulutYhteensa)*osuus*TyonantajaKustannukset;
	}
	
	factory.brutto2 = function(_laskutettavaSumma, provisio, kulut, osuus, TyonantajaKustannukset) {
		// Tassa funktiossa kulut vahennetaan maksettavasta osuudesta.
		var _maksettavaSumma = _laskutettavaSumma*osuus*(1-provisio);
		return (_maksettavaSumma - kulut) * TyonantajaKustannukset;
	}
	
	return factory;
});