import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getCoordinates, getDistanceTime, getSuggestions, getReverse, getIpLookup } from '../controllers/maps.controller.js';
import { coordinatesSchema, distanceTimeSchema, suggestionsSchema, reverseSchema } from '../validators/maps.validator.js';
import { validate } from '../middlewares/validation.middleware.js';
const router = Router();

router.get(
    '/coordinates',
    isAuthenticated,
    validate(coordinatesSchema),
    getCoordinates
);

router.get(
    '/distanceTime',
    isAuthenticated,
    validate(distanceTimeSchema),
    getDistanceTime
)

router.get(
    '/suggestions',
    isAuthenticated,
    validate(suggestionsSchema),
    getSuggestions
)

router.get(
    '/reverse',
    isAuthenticated,
    validate(reverseSchema),
    getReverse
)

router.get(
    '/ip-lookup',
    isAuthenticated,
    getIpLookup
)

export default router;