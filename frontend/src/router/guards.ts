import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { getAuthToken } from '../services/api'

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = getAuthToken()
  const publicRoutes = ['/login', '/register', '/forgot-password']
  
  if (!token && !publicRoutes.includes(to.path)) {
    // Redirect to login if not authenticated and trying to access protected route
    next('/login')
  } else if (token && publicRoutes.includes(to.path)) {
    // Redirect to dashboard if authenticated and trying to access auth pages
    next('/')
  } else {
    next()
  }
}