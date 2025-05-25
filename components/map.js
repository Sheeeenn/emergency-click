import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {

    return(
        <View style={styles.container}>
            <View style={styles.mapWrapper}>
                <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 14.5995,
                    longitude: 120.9842,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                // add this for Google Maps on Android
                provider={MapView.PROVIDER_GOOGLE}
                >
                <Marker
                    coordinate={{ latitude: 14.5995, longitude: 120.9842 }}
                    title="Marker"
                    description="Marker Description"
                />
                </MapView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF3B30',
        padding: 3,
        borderRadius: 16,
    },
    mapWrapper: {
        flex: 1,
        borderRadius: 16,   
        overflow: 'hidden', 
        backgroundColor: '#000',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapScreen;