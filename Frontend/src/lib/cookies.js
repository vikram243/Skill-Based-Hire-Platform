export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const v = document.cookie.match('(^|;)\s*' + name + '\s*=\s*([^;]+)');
  return v ? decodeURIComponent(v.pop()) : null;
}

export function deleteCookie(name, options = {}) {
  if (typeof document === 'undefined') return;
  const domain = options.domain ? `;domain=${options.domain}` : '';
  const path = options.path ? `;path=${options.path}` : ';path=/';
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT${path}${domain}`;
}
