ymaps.ready(init);

function init(){
    var myMap = new ymaps.Map("map", {
        center: [55.790023, 37.595546], // Координаты Вадковского переулка, 3Ас1
        zoom: 16
    });

    var myPlacemark = new ymaps.Placemark([55.790023, 37.595546], {
        balloonContent: '<strong>Юридическая компания "Гестион"</strong><br>Москва, Вадковский пер., 3Ас1<br>Тел: +7 (916) 777-77-77'
    }, {
        preset: 'islands#redDotIcon'
    });

    myMap.geoObjects.add(myPlacemark);
}