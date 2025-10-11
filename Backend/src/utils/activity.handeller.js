import activityLog from '../models/activity.model.js';
import {asyncHandler} from './async.handeller.js'

export const logActivity = asyncHandler(async({action, performedBy = null, target = null, targetModel, description}) => {
    await activityLog.create(
        { action,performedBy,target,targetModel,description }
    )
});