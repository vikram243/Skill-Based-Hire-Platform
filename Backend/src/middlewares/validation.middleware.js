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
        }
      }
    }
    res[key] = val;
  }
  return res;
};

export const validate = (schema) => (req, res, next) => {
  try {
    const body = tryParseJSONFields(req.body || {});
    const params = tryParseJSONFields(req.params || {});
    const query = tryParseJSONFields(req.query || {});

    const data = { body, params, query };

    const result = schema.safeParse(data);
    if (!result.success) {
      const formatted = result.error.format();
      // Build concise error message
      const first = result.error.errors[0];
      if (first) {
        const rawPath = first.path.join('.');
        const path = rawPath.startsWith('body.') ? rawPath.slice(5) : rawPath;
        const message = `${path} - ${first.message}`;
        throw new ApiError(400, message);
      }
      throw new ApiError(400, 'Invalid request');
    }

    req.body = data.body;

    return next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    if (err instanceof ZodError) {
      const first = err.errors[0];
      if (first) {
        const rawPath = first.path.join('.');
        const path = rawPath.startsWith('body.') ? rawPath.slice(5) : rawPath;
        return next(new ApiError(400, `${path} - ${first.message}`));
      }
      return next(new ApiError(400, 'Invalid request'));
    }
    return next(err);
  }
};

export default validate;
