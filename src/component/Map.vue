<template>
    <div id="map">
    </div>
</template>

<script setup>
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import { onMounted } from 'vue';
onMounted(() => {
    const map = new Map({
        target: 'map',
        layers: [new TileLayer({
            source: new OSM(),
        })],
        view: new View({
            center: [0, 0],
            zoom: 2
        })
    })
})

</script>

<style scoped>
#map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}
</style>