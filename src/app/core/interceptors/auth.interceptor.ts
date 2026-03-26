import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window === 'undefined') {
    return next(req);
  }

  const credentials = localStorage.getItem('basicAuth');

  if (!credentials) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`
      }
    })
  );
};