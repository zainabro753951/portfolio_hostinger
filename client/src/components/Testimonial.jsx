import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// Import required modules
import { Pagination, Navigation } from 'swiper/modules'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import LoadingSkeletonTestimonials from './LoadingSkeletonTestimonial'

const Testimonial = () => {
  const { testimonials, isLoading } = useSelector(state => state.testimonial)

  if (isLoading) return <LoadingSkeletonTestimonials />

  return (
    <div className="relative md:py-[8vw] sm:py-[9vw] xs:py-[10vw] md:px-[2.5vw] sm:px-[3vw] xs:px-[3.5vw] bg-theme-purple/10 w-full text-white font-inter">
      <div className="md:max-w-[75%] mx-auto relative">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
            bulletClass: 'custom-bullet',
            bulletActiveClass: 'custom-bullet-active',
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          className="w-[90%] md:w-[70%]"
        >
          {testimonials?.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="gradient-button md:p-[0.2vw] sm:p-[0.4vw] xs:p-[0.8vw] md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] ">
                <div className="w-full h-full md:p-[1.5vw] sm:p-[2vw] xs:p-[2.5vw] bg-theme-dark md:rounded-[0.8vw] sm:rounded-[1.3vw] xs:rounded-[1.8vw] flex flex-col md:gap-[1.5vw] sm:gap-[2vw] xs:gap-[2.5vw]">
                  <p className="md:text-[1.3vw] sm:text-[2.3vw] xs:text-[4.3vw] text-gray-400">
                    {item?.message}
                  </p>
                  <div className="flex items-center md:gap-[1.5vw] sm:gap-[2.5vw] xs:gap-[3.5vw]">
                    <img
                      src={item?.clientImage?.url}
                      alt={item?.clientName}
                      className="md:w-[3.5vw] md:h-[3.5vw] sm:w-[5.5vw] sm:h-[5.5vw] xs:w-[7.5vw] xs:h-[7.5vw] rounded-full object-cover"
                    />
                    <div>
                      <h3 className="md:text-[1.2vw] sm:text-[2vw] xs:text-[4vw] font-semibold text-white">
                        {item?.clientName}
                      </h3>
                      <p className="text-gray-500 md:text-[0.9vw] sm:text-[1.8vw] xs:text-[3.5vw]">
                        {item?.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="absolute left-[3%] top-1/2 -translate-y-1/2 z-10">
          <button className="swiper-button-prev-custom bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-80 text-white md:p-[1vw] sm:p-[2vw] xs:p-[4vw] rounded-full shadow-lg">
            <FaChevronLeft />
          </button>
        </div>

        <div className="absolute right-[3%] top-1/2 -translate-y-1/2 z-10">
          <button className="swiper-button-next-custom bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-80 text-white md:p-[1vw] sm:p-[2vw] xs:p-[4vw] rounded-full shadow-lg">
            <FaChevronRight />
          </button>
        </div>

        {/* Custom Pagination */}
        <div className="custom-pagination flex justify-center md:gap-[1vw] sm:gap-[1.5vw] xs:gap-[2vw] md:mt-[3vw] sm:mt-[4vw] xs:mt-[5vw]"></div>

        {/* Pagination styles */}
        <style jsx global>{`
          .custom-bullet {
            width: 10px;
            height: 10px;
            background: #555;
            border-radius: 50%;
            transition: all 0.3s;
          }
          .custom-bullet-active {
            background: linear-gradient(90deg, #6a11cb, #2575fc);
            width: 12px;
            height: 12px;
          }
        `}</style>
      </div>
    </div>
  )
}

export default Testimonial
