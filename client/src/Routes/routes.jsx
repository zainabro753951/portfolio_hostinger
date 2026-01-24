import AboutPage from '../pages/About/AboutPage'
import ContactPage from '../pages/Contact/ContactPage'
import HomePage from '../pages/home/HomePage'
import ProjectPage from '../pages/Projects/components/ProjectPage'
import ProjectsPage from '../pages/Projects/ProjectsPage'
import ReviewsPage from '../pages/Reviews/ReviewsPage'
import ServicesPage from '../pages/Services/ServicesPage'

const allRoutes = [
  {
    element: <HomePage />,
    path: '/',
  },
  {
    element: <AboutPage />,
    path: '/about',
  },
  {
    element: <ServicesPage />,
    path: '/services',
  },
  {
    element: <ProjectsPage />,
    path: '/projects',
  },
  {
    element: <ProjectPage />,
    path: '/projects/:projectSlug',
  },
  {
    element: <ReviewsPage />,
    path: '/reviews',
  },
  {
    element: <ContactPage />,
    path: '/contact',
  },
  {
    element: <ContactPage />,
    path: '/contact/:planId',
  },
]

export default allRoutes
