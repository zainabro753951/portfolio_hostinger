import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  projects: [],
  project: null, // single project for editing/viewing
  projectCounts: {
    allProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
  },
}

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProjects: (state, action) => {
      const { isLoading, projects } = action.payload

      // 🔹 Step 1: Always update loading state first
      if (typeof isLoading === 'boolean') {
        state.isLoading = isLoading
      }

      // 🔹 Step 2: Only update data when loading is complete
      if (!isLoading && Array.isArray(projects)) {
        state.projects = projects

        // 🔹 Step 3: Compute project counts
        const published = projects.filter(item => item.status?.toLowerCase() === 'published').length

        const draft = projects.filter(item => item.status?.toLowerCase() === 'draft').length

        state.projectCounts = {
          allProjects: projects.length,
          publishedProjects: published,
          draftProjects: draft,
        }
      }
    },

    // 🔹 Sort projects based on selected option
    sortProjects: (state, action) => {
      const sortType = action.payload
      let sorted = [...state.projects]

      switch (sortType) {
        case 'Newest':
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break

        case 'Oldest':
          sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break

        case 'Most Popular':
          sorted.sort((a, b) => (b.views || 0) - (a.views || 0))
          break

        default:
          // Reset to default (no sorting)
          sorted = [...state.projects]
          break
      }

      state.projects = sorted
    },

    // 🔹 Find project by ID
    projectFindById: (state, action) => {
      const projectId = action.payload
      const found = state.projects.find(p => p.id === projectId)
      state.project = found || null
    },

    projectFindBySlug: (state, action) => {
      const projectSlug = action.payload
      const found = state.projects.find(p => p.slug.toLowerCase() === projectSlug.toLowerCase())
      state.project = found || null
    },

    // 🔹 Clear selected project
    clearProject: state => {
      state.project = null
    },
  },
})

export const { addProjects, sortProjects, projectFindById, projectFindBySlug, clearProject } =
  projectSlice.actions
export default projectSlice.reducer
