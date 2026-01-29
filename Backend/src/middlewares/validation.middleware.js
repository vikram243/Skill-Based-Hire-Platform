import { ZodError } from 'zod';
import { ApiError } from '../utils/api.handeller.js';

const tryParseJSONFields = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const res = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
        try {
          res[key] = JSON.parse(val);
          continue;
        } catch (e) {
          // fall through to keep original string
        }
      }
    }
    res[key] = val;
  }
  return res;
};

export const validate = (schema) => (req, res, next) => {
  try {
    // make shallow copies and try to parse JSON-like string fields
    const body = tryParseJSONFields(req.body || {});
    const params = tryParseJSONFields(req.params || {});
    const query = tryParseJSONFields(req.query || {});

    const data = { body, params, query };

    const result = schema.safeParse(data);
    if (!result.success) {
      const formatted = result.error.format();
      // Build concise error message
      const first = result.error.errors[0];
      const message = first ? `${first.path.join('.')} - ${first.message}` : 'Invalid request';
      throw new ApiError(400, message);
    }

    // attach validated body back to req (params and query are read-only)
    req.body = data.body;

    return next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    if (err instanceof ZodError) {
      const first = err.errors[0];
      return next(new ApiError(400, `${first.path.join('.')} - ${first.message}`));
    }
    return next(err);
  }
};

export default validate;
