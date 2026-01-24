import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  skills: [],
  skill: {},
}

export const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    addSkills: (state, action) => {
      const { isLoading, skills } = action.payload

      // 🔹 Step 1: Always update loading state first
      if (typeof isLoading === 'boolean') {
        state.isLoading = isLoading
      }

      // 🔹 Step 2: Update data only when loading is finished
      if (!isLoading && Array.isArray(skills)) {
        state.skills = skills
      }
    },

    // 🔹 Find single skill by ID
    skillFindById: (state, action) => {
      const skillId = action.payload
      const found = state.skills.find(s => s.id === skillId)
      state.skill = found || {}
    },

    // 🔹 Clear single skill
    clearSkill: state => {
      state.skill = {}
    },
  },
})

export const { addSkills, skillFindById, clearSkill } = skillSlice.actions
export default skillSlice.reducer
