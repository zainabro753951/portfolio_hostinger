// CodeBlock.jsx
import React from 'react'

const highlightCode = code => {
  let html = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  html = html.replace(/("[^"]*"|'[^']*')/g, `<span class="text-green-500">$1</span>`)
  html = html.replace(/(\b\w+\s*):/g, `<span class="text-cyan-500">$1</span>:`)

  const bracketColors = ['text-green-400', 'text-blue-400', 'text-purple-400']
  let bracketIndex = 0
  html = html.replace(/[\{\}\[\]\(\)]/g, match => {
    const color = bracketColors[bracketIndex % bracketColors.length]
    bracketIndex++
    return `<span class="${color}">${match}</span>`
  })

  html = html.replace(/(\bclass\b)(?![^<]*>)/g, `<span class="text-purple-600 font-bold">$1</span>`)

  return html
}

const CodeBlock = ({ code }) => {
  return (
    <div
      className="bg-theme-dark text-white rounded-xl border border-theme-cyan
      p-4 sm:p-5 md:p-6 shadow-lg w-full mx-auto overflow-hidden"
    >
      <pre className="w-full overflow-x-auto">
        <code
          className="font-fira-code
          text-[3.5vw] leading-[5vw]       /* XS mobile */
          sm:text-[2.6vw] sm:leading-[4vw] /* small devices */
          md:text-[1.1vw] md:leading-[1.7vw] /* desktop */

          whitespace-pre-wrap break-words font-light"
          dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
        />
      </pre>
    </div>
  )
}

export default CodeBlock
