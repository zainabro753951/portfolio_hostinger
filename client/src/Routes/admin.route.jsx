import DEducPage from '../pages/admin/DEducation/DEducPage'
import DPricingPlanPage from '../pages/admin/DPricingPlan/DPricingPlanPage'
import DSiteSettingsPage from '../pages/admin/DSiteSettings/DSiteSettingsPage'
import DTestimonialPage from '../pages/admin/DTestimonial/DTestimonialPage'
import DAboutPage from '../pages/admin/DAbout/DAboutPage'
import DProjectsPage from '../pages/admin/DProjects/DProjectsPage'
import DAddProjectPage from '../pages/admin/DAddProject/DAddProjectPage'
import DSkillsPage from '../pages/admin/DSkills/DSkillsPage'
import DContactMessagePage from '../pages/admin/DContactMessage/DContactMessagePage'
import DAnalyticsPage from '../pages/admin/DAnalytics/DAnalyticsPage'
import DExperiencePage from '../pages/admin/DExperience/DExperiencePage'
import DServicesPage from '../pages/admin/DServices/DServicesPage'
import DFaqsPage from '../pages/admin/DFaqs/DFaqsPage'

export const adminRoutes = [
  {
    path: 'projects',
    elem: <DProjectsPage />,
  },
  {
    path: 'add-project',
    elem: <DAddProjectPage />,
  },
  {
    path: 'add-project/:id',
    elem: <DAddProjectPage />,
  },
  {
    path: 'about',
    elem: <DAboutPage />,
  },
  {
    path: 'skills',
    elem: <DSkillsPage />,
  },
  {
    path: 'skills/:id',
    elem: <DSkillsPage />,
  },
  {
    path: 'education',
    elem: <DEducPage />,
  },
  {
    path: 'education/:id',
    elem: <DEducPage />,
  },
  {
    path: 'experience',
    elem: <DExperiencePage />,
  },
  {
    path: 'experience/:id',
    elem: <DExperiencePage />,
  },
  {
    path: 'services',
    elem: <DServicesPage />,
  },
  {
    path: 'services/:id',
    elem: <DServicesPage />,
  },
  {
    path: 'faqs',
    elem: <DFaqsPage />,
  },
  {
    path: 'faqs/:id',
    elem: <DFaqsPage />,
  },
  {
    path: 'testimonials',
    elem: <DTestimonialPage />,
  },
  {
    path: 'testimonials/:id',
    elem: <DTestimonialPage />,
  },
  {
    path: 'pricing-plan',
    elem: <DPricingPlanPage />,
  },
  {
    path: 'pricing-plan/:id',
    elem: <DPricingPlanPage />,
  },
  {
    path: 'site-settings',
    elem: <DSiteSettingsPage />,
  },
  {
    path: 'user-messages',
    elem: <DContactMessagePage />,
  },
  {
    path: 'analytics',
    elem: <DAnalyticsPage />,
  },
]
