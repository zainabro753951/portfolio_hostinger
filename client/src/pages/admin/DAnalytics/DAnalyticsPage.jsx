'use client'
import React from 'react'
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2'

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
)

const glassCard =
  'backdrop-blur-md bg-white/10 dark:bg-gray-900/20 rounded-2xl shadow-lg border border-white/20 p-[1.5vw] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02]'

const DAnalyticsPage = () => {
  // Dummy data (replace with your real data later)
  const visitorsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Visitors',
        data: [120, 180, 150, 200, 250, 300, 280],
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96,165,250,0.3)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const projectsData = {
    labels: ['Portfolio', 'Shopo', 'Protect Harvest', 'SchoolSite', 'EduHome'],
    datasets: [
      {
        label: 'Views',
        data: [400, 250, 380, 200, 300],
        backgroundColor: [
          'rgba(96,165,250,0.6)',
          'rgba(147,197,253,0.6)',
          'rgba(34,211,238,0.6)',
          'rgba(56,189,248,0.6)',
          'rgba(125,211,252,0.6)',
        ],
        borderRadius: 10,
      },
    ],
  }

  const skillsData = {
    labels: ['HTML', 'CSS', 'JS', 'React', 'GSAP', 'Tailwind'],
    datasets: [
      {
        label: 'Skill Strength',
        data: [95, 90, 85, 80, 70, 90],
        backgroundColor: 'rgba(56,189,248,0.3)',
        borderColor: '#38BDF8',
      },
    ],
  }

  const trafficData = {
    labels: ['Organic', 'Referral', 'Social', 'Direct'],
    datasets: [
      {
        data: [45, 20, 25, 10],
        backgroundColor: [
          'rgba(34,197,94,0.6)',
          'rgba(59,130,246,0.6)',
          'rgba(249,115,22,0.6)',
          'rgba(239,68,68,0.6)',
        ],
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
      },
    ],
  }

  const performanceData = {
    labels: ['Load Time', 'Bounce Rate', 'Conversion', 'Engagement'],
    datasets: [
      {
        data: [2.3, 45, 12, 78],
        backgroundColor: [
          'rgba(59,130,246,0.6)',
          'rgba(34,197,94,0.6)',
          'rgba(239,68,68,0.6)',
          'rgba(234,179,8,0.6)',
        ],
        borderColor: 'rgba(255,255,255,0.3)',
      },
    ],
  }

  return (
    <section className="md:px-[2vw] sm:px-[3vw] xs:px-[4vw] py-[3vw] grid md:grid-cols-2 gap-[2vw] auto-rows-[minmax(250px,auto)]">
      {/* Visitors Overview */}
      <div className={`${glassCard}`}>
        <h2 className="text-xl font-semibold text-white mb-3">Visitors Overview</h2>
        <Line
          data={visitorsData}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      {/* Project Engagement */}
      <div className={`${glassCard}`}>
        <h2 className="text-xl font-semibold text-white mb-3">Project Engagement</h2>
        <Bar
          data={projectsData}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      {/* Skill Usage */}
      <div className={`${glassCard}`}>
        <h2 className="text-xl font-semibold text-white mb-3">Skill Usage</h2>
        <Radar
          data={skillsData}
          options={{ scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' } } } }}
        />
      </div>

      {/* Traffic Source */}
      <div className={`${glassCard}`}>
        <h2 className="text-xl font-semibold text-white mb-3">Traffic Source</h2>
        <Doughnut
          data={trafficData}
          options={{ plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }}
        />
      </div>

      {/* Performance Metrics */}
      <div className={`${glassCard} md:col-span-2`}>
        <h2 className="text-xl font-semibold text-white mb-3">Performance Metrics</h2>
        <PolarArea
          data={performanceData}
          options={{ plugins: { legend: { position: 'right', labels: { color: '#fff' } } } }}
        />
      </div>
    </section>
  )
}

export default DAnalyticsPage
