import readline from 'readline'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

// ─────────────────────────────────────────────
// 1) COLOR UTILITY
// ─────────────────────────────────────────────
const colors = {
  cyan: txt => `\x1b[36m${txt}\x1b[0m`,
  green: txt => `\x1b[32m${txt}\x1b[0m`,
  yellow: txt => `\x1b[33m${txt}\x1b[0m`,
  red: txt => `\x1b[31m${txt}\x1b[0m`,
  bold: txt => `\x1b[1m${txt}\x1b[0m`,
  dim: txt => `\x1b[2m${txt}\x1b[0m`,
}

// ─────────────────────────────────────────────
// 2) CLI HEADER
// ─────────────────────────────────────────────
console.clear()
console.log(colors.green('==============================================='))
console.log(colors.green('      🚀 SUPER ADMIN ACCOUNT CREATOR - CLI      '))
console.log(colors.green('===============================================\n'))

// ─────────────────────────────────────────────
// 3) CUSTOM READLINE (for masked password)
// ─────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
})

// ─────────────────────────────────────────────
// 4) NORMAL INPUT
// ─────────────────────────────────────────────
const ask = query => new Promise(resolve => rl.question(colors.cyan(query), resolve))

// ─────────────────────────────────────────────
// 6) EMAIL VALIDATOR
// ─────────────────────────────────────────────
const validEmail = email => /\S+@\S+\.\S+/.test(email)

// ─────────────────────────────────────────────
// 7) MAIN FUNCTION
// ─────────────────────────────────────────────
async function createAdmin() {
  console.log(colors.yellow("\n✨ Let's create your super admin account!\n"))

  // Username
  let adminName = await ask('👤 Enter Admin Name: ')
  while (!adminName.trim()) {
    console.log('Admin Name is required!')
    adminName = await ask('👤 Enter Admin Name: ')
  }

  // Email
  let email = await ask('📧 Enter email: ')
  while (!validEmail(email)) {
    console.log(colors.red('❌ Invalid email format.'))
    email = await ask('📧 Enter email: ')
  }

  // Password
  let password = await ask('🔐 Enter password: ')
  while (password.length < 6) {
    console.log(colors.red('❌ Password must be at least 6 characters.'))
    password = await ask('🔐 Enter password: ')
  }

  // Create Admin With Api
  const backendurl = process.env.BACKEND_URL
  const response = await axios.post(`${backendurl}/super-admin/register`, {
    adminName,
    email,
    password,
  })

  if (response.status === 400 || response.status === 500) {
    return console.log('Something went wrong please try again later!')
  }

  // Summary Output
  console.log(colors.green('\n==============================================='))
  console.log(colors.green('        ✅ SUPER ADMIN CREATED SUCCESSFULLY     '))
  console.log(colors.green('===============================================\n'))

  console.log(`👤 adminName:  ${colors.bold(adminName)}`)
  console.log(`📧 Email:     ${colors.bold(email)}`)
  console.log(`🔐 Password:  ${colors.bold('*'.repeat(password.length))}`)

  console.log(colors.yellow('\n🚀 Setup complete!\n'))

  rl.close()
  process.exit(0)
}

createAdmin()
