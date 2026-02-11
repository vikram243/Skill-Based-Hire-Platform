import axios from 'axios';
import config from '../config/config.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import { asyncHandler } from '../utils/async.handeller.js';
import User from '../models/user.model.js';

const parseAddressComponents = (components = []) => {
    const out = { city: '', state: '', pin: '', address: '' };
    for (const c of components) {
        const types = c.types || [];
        if (types.includes('postal_code')) out.pin = c.long_name || c.short_name;
        if (types.includes('administrative_area_level_1')) out.state = c.long_name || c.short_name;
        if (types.includes('locality') || types.includes('sublocality') || types.includes('postal_town')) {
            if (!out.city) out.city = c.long_name || c.short_name;
        }
        if (types.includes('administrative_area_level_2') && !out.city) {
            out.city = c.long_name || c.short_name;
        }
    }
    return out;
};

const callGeocode = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${config.googleMapsApiKey}`;

    const response = await axios.get(url);
    if (!response?.data) throw new Error('No response from geocode API');
    if (response.data.status !== 'OK') {
        throw new Error(response.data.status || 'Geocode error');
    }

    const result = response.data.results[0];
    const location = result.geometry.location;
    const formatted = result.formatted_address;
    const comps = parseAddressComponents(result.address_components || []);
    return {
        lat: location.lat,
        lng: location.lng,
        address: formatted,
        city: comps.city,
        state: comps.state,
        pin: comps.pin
    };
};

const callReverseGeocode = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&key=${config.googleMapsApiKey}`;
    const response = await axios.get(url);
    if (!response?.data) throw new Error('No response from geocode API');
    if (response.data.status !== 'OK') {
        throw new Error(response.data.status || 'Geocode error');
    }
    const result = response.data.results[0];
    const location = result.geometry.location;
    const formatted = result.formatted_address;
    const comps = parseAddressComponents(result.address_components || []);
    return {
        lat: location.lat,
        lng: location.lng,
        address: formatted,
        city: comps.city,
        state: comps.state,
        pin: comps.pin
    };
};

const callDistanceMatrix = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origin
    )}&destinations=${encodeURIComponent(destination)}&key=${config.googleMapsApiKey}`;

    const response = await axios.get(url);
    if (!response?.data) throw new Error('No response from distance matrix API');
    if (response.data.status !== 'OK') {
        throw new Error(response.data.status || 'DistanceMatrix error');
    }

    const element = response.data.rows[0].elements[0];
    if (!element) throw new Error('No element in distance matrix response');
    if (element.status !== 'OK') throw new Error(element.status || 'No route');

    const distanceMeters = element.distance.value;
    const durationSeconds = element.duration.value;

    return {
        distance: element.distance.text,
        duration: element.duration.text,
        distanceMeters,
        durationSeconds,
        distanceKm: Number((distanceMeters / 1000).toFixed(3)),
        durationMin: Number((durationSeconds / 60).toFixed(2))
    };
};

const callPlaceSuggestions = async (input) => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
    )}&key=${config.googleMapsApiKey}`;

    const response = await axios.get(url);
    if (!response?.data) throw new Error('No response from places API');
    if (response.data.status !== 'OK') throw new Error(response.data.status || 'Places error');

    return response.data.predictions.map((p) => ({ description: p.description, place_id: p.place_id }));
};

const getCoordinates = asyncHandler(async (req, res) => {
    const { address } = req.query;
    if (!address) throw new ApiError(400, 'Address is required');

    try {
        const info = await callGeocode(address);

        if (req.user && req.user.id) {
            await User.findByIdAndUpdate(req.user.id, {
                location: {
                    source: 'search',
                    pin: info.pin,
                    address: info.address,
                    city: info.city,
                    state: info.state,
                    lat: info.lat,
                    lng: info.lng
                }
            });
            const user = await User.findById(req.user.id);
            if (user?.providerProfile) {
                await Provider.findByIdAndUpdate(user.providerProfile, {
                    location: {
                        geo: {
                            type: "Point",
                            coordinates: [info.lng, info.lat]
                        }
                    }
                });
            }
        }

        return res.status(200).json(new ApiResponse(200, info, 'Location resolved'));
    } catch (err) {
        const msg = err?.message || 'Failed to fetch coordinates';
        throw new ApiError(400, msg);
    }
});

const getReverse = asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) throw new ApiError(400, 'lat and lng are required');

    try {
        const info = await callReverseGeocode(lat, lng);

        if (req.user && req.user.id) {
            await User.findByIdAndUpdate(req.user.id, {
                location: {
                    source: 'gps',
                    pin: info.pin,
                    address: info.address,
                    city: info.city,
                    state: info.state,
                    lat: info.lat,
                    lng: info.lng
                }
            });
            const user = await User.findById(req.user.id);
            if (user?.providerProfile) {
                await Provider.findByIdAndUpdate(user.providerProfile, {
                    location: {
                        geo: {
                            type: "Point",
                            coordinates: [info.lng, info.lat]
                        }
                    }
                });
            }
        }

        return res.status(200).json(new ApiResponse(200, info, 'Reverse geocoded'));
    } catch (err) {
        throw new ApiError(400, err?.message || 'Failed to reverse geocode');
    }
});

const getDistanceTime = asyncHandler(async (req, res) => {
    const { origin, destination } = req.query;
    if (!origin || !destination) throw new ApiError(400, 'Origin and destination are required');

    try {
        const data = await callDistanceMatrix(origin, destination);
        return res.status(200).json(new ApiResponse(200, data, 'Distance and time fetched'));
    } catch (err) {
        const msg = err?.message === 'ZERO_RESULTS' || err?.message === 'NOT_FOUND' ? 'No route found for the given locations' : (err?.message || 'Failed to get distance and time');
        throw new ApiError(400, msg);
    }
});

const getSuggestions = asyncHandler(async (req, res) => {
    const { input } = req.query;
    if (!input) throw new ApiError(400, 'Input is required');

    try {
        const suggestions = await callPlaceSuggestions(input);
        return res.status(200).json(new ApiResponse(200, suggestions, 'Suggestions fetched'));
    } catch (err) {
        throw new ApiError(500, err?.message || 'Failed to fetch suggestions');
    }
});

const getIpLookup = asyncHandler(async (req, res) => {
    try {
        const url = `http://ip-api.com/json/`;
        const r = await axios.get(url, { timeout: 5000 });
        const d = r.data || {};

        const info = {
            query: d.query,
            city: d.city || '',
            regionName: d.regionName || '',
            zip: d.zip || '',
            lat: d.lat || null,
            lng: d.lon || null,
            status: d.status || 'fail',
            message: d.message || null
        };

        if (req.user && req.user.id && info.status === 'success') {
            await User.findByIdAndUpdate(req.user.id, {
                location: {
                    source: 'ip',
                    pin: info.zip,
                    address: info.city ? `${info.city}, ${info.regionName || ''}`.replace(/, $/, '') : info.query,
                    city: info.city,
                    state: info.regionName,
                    lat: info.lat,
                    lng: info.lng
                }
            });
            const user = await User.findById(req.user.id);
            if (user?.providerProfile) {
                await Provider.findByIdAndUpdate(user.providerProfile, {
                    location: {
                        geo: {
                            type: "Point",
                            coordinates: [info.lng, info.lat]
                        }
                    }
                });
            }
        }

        return res.status(200).json(new ApiResponse(200, info, 'IP lookup fetched'));
    } catch (err) {
        throw new ApiError(500, err?.message || 'Failed to lookup IP');
    }
});

export { getCoordinates, getReverse, getDistanceTime, getSuggestions, getIpLookup };